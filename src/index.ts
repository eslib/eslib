import * as _ from 'lodash'

const extensions: Record<string, string[]> = {
  Array: ['chunk', 'compact', 'difference', 'differenceBy', 'differenceWith', 'drop', 'dropRight', 'dropRightWhile', 'dropWhile', 'fill', 'findIndex', 'findLastIndex', 'flatten', 'flattenDeep', 'flattenDepth', 'fromPairs', 'head', 'initial', 'intersection', 'intersectionBy', 'intersectionWith', 'last', 'nth', 'pull', 'pullAll', 'pullAllBy', 'pullAllWith', 'pullAt', 'remove', 'sortedIndex', 'sortedIndexBy', 'sortedIndexOf', 'sortedLastIndex', 'sortedLastIndexBy', 'sortedLastIndexOf', 'sortedUniq', 'sortedUniqBy', 'tail', 'take', 'takeRight', 'takeRightWhile', 'takeWhile', 'union', 'unionBy', 'unionWith', 'uniq', 'uniqBy', 'uniqWith', 'unzip', 'unzipWith', 'without', 'xor', 'xorBy', 'xorWith', 'zip', 'zipObject', 'zipObjectDeep', 'zipWith']
}

const host = global || window

for (const A in extensions) {
  for (const method of extensions[A]) {

    const prototype: object = (host as any)[A].prototype

    if (method in prototype) {
      console.warn(`ESLib warning: skipping method "${method}" because it is already defined on ${A}.prototype.`)
      continue
    }

    Object.defineProperty(prototype, method, {
      configurable: false,
      enumerable: false,
      writable: false,
      value(...args: any[]) {
        return (_ as any)[method](this, ...args)
      }
    })
  }
}
