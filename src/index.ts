import { valid } from 'semver'
import { model } from './model'
import { isNative, isCompatible } from './utils'

export let authors = model()
export let versions = model()

/** @private */
export let __errors: AssignError[] = []

const reserved = model()
reserved.set(Object.prototype as any)('get')('@eslib')
reserved.set(Object.prototype as any)('set')('@eslib')

export type AssignError = {
  error: ASSIGN_ERROR
  meta: {
    author: string
    method: string
    type: object
    version: string
    [k: string]: any
  }
}

export enum ASSIGN_ERROR {
  ALREADY_EXISTS_EXTERNAL,
  ALREADY_EXISTS_INCOMPATIBLE_LIB,
  ALREADY_EXISTS_INCOMPATIBLE_VERSION,
  ALREADY_EXISTS_NATIVE,
  INVALID_VERSION,
  RESERVED_WORD
}

export function assign<T extends object, K extends keyof T>(
  type: T,
  fns: Record<K, T[K]>,
  author: string,
  version: string
): AssignError[] {

  let errors: AssignError[] = []

  for (let method in fns) {

    let fn = fns[method]

    // validate version
    if (!valid(version)) {
      errors.push({
        error: ASSIGN_ERROR.INVALID_VERSION,
        meta: { author, method, type, version }
      })
      continue
    }

    if (method in type) {

      let existing = type[method]

      // if method is already natively defined, skip it
      if (isNative(existing)) {
        errors.push({
          error: ASSIGN_ERROR.ALREADY_EXISTS_NATIVE,
          meta: { author, method, type, version }
        })
        continue
      }

      // if property is defined by something else, skip it
      if (!authors.has(type)(method)) {
        errors.push({
          error: ASSIGN_ERROR.ALREADY_EXISTS_EXTERNAL,
          meta: { author, method, type, version }
        })
        continue
      } else {

        // if method is defined by another eslib, skip it
        if (authors.get(type)(method) !== author) {
          errors.push({
            error: ASSIGN_ERROR.ALREADY_EXISTS_INCOMPATIBLE_LIB,
            meta: { author, otherAuthor: authors.get(type)(method), method, type, version }
          })
          continue
        }

        // if method is defined by the same eslib at an incompatible version, skip it
        if (!isCompatible(type)(method)(author)(version)) {
          errors.push({
            error: ASSIGN_ERROR.ALREADY_EXISTS_INCOMPATIBLE_VERSION,
            meta: { author, otherAuthor: authors.get(type)(method), method, type, version, otherVersion: versions.get(type)(method) }
          })
          continue
        }
      }
    }

    if (reserved.has(type)(method)) {
      errors.push({
        error: ASSIGN_ERROR.RESERVED_WORD,
        meta: { author, method, type, version }
      })
      continue
    }

    authors.set(type)(method)(author)
    versions.set(type)(method)(version)

    Object.defineProperty(type, method, {
      configurable: false,
      enumerable: false,
      writable: true, // allow overwriting in subsequent calls
      value: fn
    })

  }

  __errors = [...__errors, ...errors]

  return errors
}
