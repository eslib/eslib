import { blue, cyan, green, magenta, whiteBright } from 'cli-color'
import { valid, satisfies, gte } from 'semver'

const host = global || window

/** TODO: can we make this safer by checking that `name` is a key on `type.proto`? */
export function assign(
  name: string,
  fn: Function,
  type: Type,
  source: string,
  version: string
) {

  const prototype: Record<string, Extension> = (host as any)[type].prototype
  const _fn: Extension = function(this: any, ...args: any[]) {
    return _fn.originalFunction.apply(this, args)
  } as Extension
  _fn.originalFunction = fn
  _fn.source = source
  _fn.version = version

  // validate version
  if (!valid(version)) {
    warn(`Version string ${magenta(version)} for method ${green(name)} on type ${blue(type)} is invalid - please specify version as X.Y.Z (eg. ${magenta('1.2.3')})`)
    return
  }

  if (name in prototype) {

    const existing = prototype[name]

    // if method is already natively defined, skip it
    if (isNative(existing)) {
      warn(`Skipping method ${green(name)} because it is already natively installed on ${blue(type)}`)
      return
    }

    // if property is defined by something else, skip it
    if (!('source' in existing) || !('version' in existing) || !('originalFunction' in existing)) {
      warn(`Skipping method ${green(name)} because it is already defined on ${blue(type)} by some library outside of ESlib`)
    }

    // if method is defined by another eslib, skip it
    if (existing.source !== _fn.source) {
      warn(`Skipping method ${green(name)} (provided by ${cyan(_fn.source)}) on ${blue(type)} because another method with the same name was already installed by ${cyan(existing.source)}`)
      return
    }

    // if method is defined by the same eslib at an incompatible version, skip it
    if (!isCompatible(existing, _fn)) {
      warn(`Skipping method ${green(name)} at version ${magenta(_fn.version)} (provided by ${cyan(_fn.source)}) because a${gte(existing.version, _fn.version) ? ' newer' : 'n older'} version ${magenta(existing.version)} is already installed on ${blue(type)}.`)
      return
    }
  }

  Object.defineProperty(prototype, name, {
    configurable: false,
    enumerable: false,
    writable: true, // allow overwriting in subsequent calls
    value: _fn
  })
}

export type Extension<T = any> = {
  (...args: any[]): T
  originalFunction: Function
  source: string
  version: string
}

export type Type = 'Array' | 'Date' | 'Function' | 'Map' | 'Number' | 'Object' | 'Set' | 'String' | 'Symbol' | 'WeakMap' | 'WeakSet' | 'TypedArray'

function isCompatible(a: Extension, b: Extension) {
  return a.source === b.source
    && satisfies(b.version, '^' + a.version)
}

function isNative(fn: Function) {
  return fn.toString().indexOf('[native code]') > -1
}

function warn(message: string) {
  console.warn(whiteBright.bgRed(`ESLib warning`), message)
}
