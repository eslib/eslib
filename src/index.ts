import { black, blue, cyan, green, magenta } from 'cli-color'
import { valid, satisfies, gte } from 'semver'

export function assign<T, K extends keyof Array<T>>(type: ArrayConstructor, fns: Record<K, Array<T>[K]>, author: string, version: string): void
export function assign<K extends keyof Date>(type: DateConstructor, fns: Record<K, Date[K]>, author: string, version: string): void
export function assign<K extends keyof Function>(type: FunctionConstructor, fns: Record<K, Function[K]>, author: string, version: string): void
export function assign<T, U, K extends keyof Map<T, U>>(type: MapConstructor, fns: Record<K, Map<T, U>[K]>, author: string, version: string): void
export function assign<K extends keyof Number>(type: NumberConstructor, fns: Record<K, Number[K]>, author: string, version: string): void
export function assign<K extends keyof Object>(type: ObjectConstructor, fns: Record<K, Object[K]>, author: string, version: string): void
export function assign<T, K extends keyof Set<T>>(type: SetConstructor, fns: Record<K, Set<T>[K]>, author: string, version: string): void
export function assign<K extends keyof String>(type: StringConstructor, fns: Record<K, String[K]>, author: string, version: string): void
export function assign<K extends keyof Symbol>(type: SymbolConstructor, fns: Record<K, Symbol[K]>, author: string, version: string): void
export function assign<T extends object, U, K extends keyof WeakMap<T, U>>(type: WeakMapConstructor, fns: Record<K, WeakMap<T, U>[K]>, author: string, version: string): void
export function assign<T, K extends keyof WeakSet<T>>(type: WeakSetConstructor, fns: Record<K, WeakSet<T>[K]>, author: string, version: string): void
export function assign<T extends Type>(
  type: T,
  fns: Record<string, any>,
  // fn: any, // TODO: find out why `Function` doesn't work with the above String overload
  author: string,
  version: string
) {

  const prototype = type.prototype as Record<string, Extension>

  for (const name in fns) {

    const _fn: ExtendedExtension = function(this: any, ...args: any[]) {
      return _fn.originalFunction.apply(this, args)
    } as ExtendedExtension
    _fn.originalFunction = fns[name]
    _fn.author = author
    _fn.version = version

    // validate version
    if (!valid(version)) {
      warn(`Version string ${magenta(version)} for method ${green(name)} on type ${blue(type.name)} is invalid - please specify version as X.Y.Z (eg. ${magenta('1.2.3')})`)
      continue
    }

    if (name in prototype) {

      const existing = prototype[name] as ExtendedExtension

      // if method is already natively defined, skip it
      if (isNative(existing)) {
        warn(`Skipping method ${green(name)} because it is already natively installed on ${blue(type.name)}`)
        continue
      }

      // if property is defined by something else, skip it
      if (!('author' in existing) || !('version' in existing) || !('originalFunction' in existing)) {
        warn(`Skipping method ${green(name)} because it is already defined on ${blue(type.name)} by some library outside of ESlib`)
        continue
      }

      // if method is defined by another eslib, skip it
      if (existing.author !== _fn.author) {
        warn(`Skipping method ${green(name)} (provided by ${cyan(_fn.author)}) on ${blue(type.name)} because another method with the same name was already installed by ${cyan(existing.author)}`)
        continue
      }

      // if method is defined by the same eslib at an incompatible version, skip it
      if (!isCompatible(existing, _fn)) {
        warn(`Skipping method ${green(name)} at version ${magenta(_fn.version)} (provided by ${cyan(_fn.author)}) because a${gte(existing.version, _fn.version) ? ' newer' : 'n older'} version ${magenta(existing.version)} is already installed on ${blue(type.name)}.`)
        continue
      }
    }

    Object.defineProperty(prototype, name, {
      configurable: false,
      enumerable: false,
      writable: true, // allow overwriting in subsequent calls
      value: _fn
    })

  }
}

export type ExtendedExtension<T = any> = Extension<T> & {
  originalFunction: Function
  author: string
  version: string
}

export type Extension<T = any> = {
  (...args: any[]): T
  originalFunction?: Function
  author?: string
  version?: string
}

export type Type = ArrayConstructor | DateConstructor | FunctionConstructor | MapConstructor | NumberConstructor | ObjectConstructor | SetConstructor | StringConstructor | SymbolConstructor | WeakMapConstructor | WeakSetConstructor

function isCompatible(a: ExtendedExtension, b: ExtendedExtension) {
  return a.author === b.author
    && satisfies(b.version, '^' + a.version)
}

function isNative(fn: Function) {
  return fn.toString().indexOf('[native code]') > -1
}

function warn(message: string) {
  console.warn(black.bgYellowBright(`ESLib warning`), message)
}
