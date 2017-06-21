import { valid, satisfies, gte } from 'semver'

const host = global || window

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
    console.warn(`version string "${version}" for method "${name}" on type "${type}" is invalid. Please specify version as X.Y.Z (eg. "1.2.3").`)
    return
  }

  if (name in prototype) {

    const existing = prototype[name]

    // if method is already natively defined, skip it
    if (isNative(existing)) {
      console.warn(`ESLib warning: skipping method "${name}" because it is already natively installed on type "${type}".`)
      return
    }

    // if property is defined by something else, skip it
    if (!('source' in existing) || !('version' in existing) || !('originalFunction' in existing)) {
      console.warn(`ESLib warning: skipping method "${name}" because it is already defined on type "${type}" by some library outside of ESlib.`)
    }

    // if method is defined by another eslib, skip it
    if (existing.source !== _fn.source) {
      console.warn(`ESLib warning: skipping method "${name}" (provided by "${_fn.source}") on type "${type}" because another method with the same name was already installed by "${existing.source}."`)
      return
    }

    // if method is defined by the same eslib at an incompatible version, skip it
    if (!isCompatible(existing, _fn)) {
      console.warn(`ESLib warning: skipping method "${name}" at version ${_fn.version} (provided by "${_fn.source}") because a${gte(existing.version, _fn.version) ? ' newer' : 'n older'} version ${existing.version} is already installed on type "${type}".`)
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
