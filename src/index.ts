import * as _ from 'lodash'

const SOURCE = 'eslib'
const VERSION = '1.0.0'

const extensions: Record<string, string[]> = {
  Array: ['chunk', 'compact', 'difference', 'differenceBy', 'differenceWith', 'drop', 'dropRight', 'dropRightWhile', 'dropWhile', 'fill', 'findIndex', 'findLastIndex', 'flatten', 'flattenDeep', 'flattenDepth', 'fromPairs', 'head', 'initial', 'intersection', 'intersectionBy', 'intersectionWith', 'last', 'nth', 'pull', 'pullAll', 'pullAllBy', 'pullAllWith', 'pullAt', 'remove', 'sortedIndex', 'sortedIndexBy', 'sortedIndexOf', 'sortedLastIndex', 'sortedLastIndexBy', 'sortedLastIndexOf', 'sortedUniq', 'sortedUniqBy', 'tail', 'take', 'takeRight', 'takeRightWhile', 'takeWhile', 'union', 'unionBy', 'unionWith', 'uniq', 'uniqBy', 'uniqWith', 'unzip', 'unzipWith', 'without', 'xor', 'xorBy', 'xorWith', 'zip', 'zipObject', 'zipObjectDeep', 'zipWith']
}

const host = global || window

type Fn = {
  (...args: any[]): any
  source?: string
  version?: string
}

for (const A in extensions) {
  for (const method of extensions[A]) {

    const prototype: any = (host as any)[A].prototype
    const fn: Fn = function(this: any, ...args: any[]) {
      return (_ as any)[method](this, ...args)
    }
    fn.source = SOURCE
    fn.version = VERSION

    if (method in prototype && !isCompatible(prototype[method], fn)) {
      console.warn(`ESLib warning: skipping method "${method}" because an incompatible version is already defined on ${A}.prototype.`)
      continue
    }

    Object.defineProperty(prototype, method, {
      configurable: false,
      enumerable: false,
      writable: false,
      value: fn
    })
  }
}

/** TODO: Support semver */
function isCompatible(a: Fn, b: Fn) {
  return a.source !== undefined
      && b.source !== undefined
      && a.version !== undefined
      && b.version !== undefined
      && a.source === b.source
      && a.version === b.version
}
