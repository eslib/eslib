import { chunk as _chunk } from 'lodash'

declare global {
  interface Array<T> {

    /**
     * Creates an array of elements split into groups the length of `size`. If array can't be split evenly, the final chunk will be the remaining elements.
     *
     * @param size {number} The length of each chunk
     */
    chunk(this: T[], size?: number): T[][]
  }
}

Object.defineProperty(Array.prototype, 'chunk', {
  configurable: false,
  enumerable: false,
  writable: false,
  value: function chunk<T>(this: T[], size?: number) {
    return _chunk<T>(this, size)
  }
})
