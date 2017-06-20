import * as _ from 'lodash'
import { List } from 'lodash'

/// extensions

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

/// types

declare global {
  interface Array<T> {

    /**
     * Creates an array of elements split into groups the length of size. If collection can’t be split evenly, the
     * final chunk will be the remaining elements.
     *
     * @param this The array to process.
     * @param size The length of each chunk.
     * @return Returns the new array containing chunks.
     */
    chunk(this: List<T>, size?: number): T[][]

    /**
     * Creates an array with all falsey values removed. The values false, null, 0, "", undefined, and NaN are
     * falsey.
     *
     * @param this The array to compact.
     * @return (Array) Returns the new array of filtered values.
     */
    compact<T>(this: List<T | null | undefined | false | 0 | ''>): T[]

    /**
     * Creates an array of unique array values not included in the other provided arrays using SameValueZero for
     * equality comparisons.
     *
     * @param this The array to inspect.
     * @param values The arrays of values to exclude.
     * @return Returns the new array of filtered values.
     */
    difference<T>(
      this: List<T>,
      ...values: Array<List<T>>
    ): T[]

    /**
     * This method is like _.difference except that it accepts iteratee which is invoked for each element of array
     * and values to generate the criterion by which uniqueness is computed. The iteratee is invoked with one
     * argument: (value).
     *
     * @param this The array to inspect.
     * @param values The values to exclude.
     * @param iteratee The iteratee invoked per element.
     * @returns Returns the new array of filtered values.
     */
    differenceBy<T>(
      this: List<T>,
      values?: List<T>,
      iteratee?: ((value: T) => any)|string
    ): T[]

    /**
     * @see _.differenceBy
     */
    differenceBy<T, W extends Object>(
        this: List<T>,
        values?: List<T>,
        iteratee?: W
    ): T[]

    /**
     * @see _.differenceBy
     */
    differenceBy<T>(
        this: List<T>,
        values1?: List<T>,
        values2?: List<T>,
        iteratee?: ((value: T) => any)|string
    ): T[]

    /**
     * @see _.differenceBy
     */
    differenceBy<T, W extends Object>(
        this: List<T>,
        values1?: List<T>,
        values2?: List<T>,
        iteratee?: W
    ): T[]

    /**
     * @see _.differenceBy
     */
    differenceBy<T>(
        this: List<T>,
        values1?: List<T>,
        values2?: List<T>,
        values3?: List<T>,
        iteratee?: ((value: T) => any)|string
    ): T[]

    /**
     * @see _.differenceBy
     */
    differenceBy<T, W extends Object>(
        this: List<T>,
        values1?: List<T>,
        values2?: List<T>,
        values3?: List<T>,
        iteratee?: W
    ): T[]

    /**
     * @see _.differenceBy
     */
    differenceBy<T, W extends Object>(
        this: List<T>,
        values1?: List<T>,
        values2?: List<T>,
        values3?: List<T>,
        values4?: List<T>,
        iteratee?: W
    ): T[]

    /**
     * @see _.differenceBy
     */
    differenceBy<T>(
        this: List<T>,
        values1?: List<T>,
        values2?: List<T>,
        values3?: List<T>,
        values4?: List<T>,
        iteratee?: ((value: T) => any)|string
    ): T[]

    /**
     * @see _.differenceBy
     */
    differenceBy<T>(
        this: List<T>,
        values1?: List<T>,
        values2?: List<T>,
        values3?: List<T>,
        values4?: List<T>,
        values5?: List<T>,
        iteratee?: ((value: T) => any)|string
    ): T[]

    /**
     * @see _.differenceBy
     */
    differenceBy<T, W extends Object>(
        this: List<T>,
        values1?: List<T>,
        values2?: List<T>,
        values3?: List<T>,
        values4?: List<T>,
        values5?: List<T>,
        iteratee?: W
    ): T[]

    /**
     * @see _.differenceBy
     */
    differenceBy<T>(
        this: List<T>,
        ...values: any[]
    ): T[]
  }
}
