import '../src'
import test from 'ava'

// ['chunk', 'compact', 'difference', 'differenceBy', 'differenceWith', 'drop', 'dropRight', 'dropRightWhile', 'dropWhile', 'fill', 'findIndex', 'findLastIndex', 'flatten', 'flattenDeep', 'flattenDepth', 'fromPairs', 'head', 'initial', 'intersection', 'intersectionBy', 'intersectionWith', 'last', 'nth', 'pull', 'pullAll', 'pullAllBy', 'pullAllWith', 'pullAt', 'remove', 'sortedIndex', 'sortedIndexBy', 'sortedIndexOf', 'sortedLastIndex', 'sortedLastIndexBy', 'sortedLastIndexOf', 'sortedUniq', 'sortedUniqBy', 'tail', 'take', 'takeRight', 'takeRightWhile', 'takeWhile', 'union', 'unionBy', 'unionWith', 'uniq', 'uniqBy', 'uniqWith', 'unzip', 'unzipWith', 'without', 'xor', 'xorBy', 'xorWith', 'zip', 'zipObject', 'zipObjectDeep', 'zipWith']

test('chunk', t => t.deepEqual([1, 2, 3, 4].chunk(2), [[1, 2], [3, 4]]))
test('compact', t => t.deepEqual([1, false, 0, NaN, ''].compact(), [1]))
test('difference', t => t.deepEqual([1, 2].difference([2, 3]), [1]))
test('differenceBy', t => t.deepEqual([1, 2].differenceBy([2, 3], _ => _), [1]))
test('differenceWith', t => t.deepEqual([1, 2].differenceWith([2, 3]), [1]))
test('drop', t => t.deepEqual([1, 2].drop(1), [2]))
test('dropRight', t => t.deepEqual([1, 2].dropRight(1), [1]))
test('dropRightWhile', t => t.deepEqual([1, 2].dropRightWhile(_ => _ > 1), [1]))
test('dropWhile', t => t.deepEqual([1, 2].dropWhile(_ => _ < 2), [2]))
test('fill', t => t.deepEqual(['a'].fill('b', 0, 4), ['b']))
test('findIndex', t => t.is([1, 2, 3].findIndex(_ => _ === 3), 2))
test('findLastIndex', t => t.is([1, 1, 1].findLastIndex(_ => _ === 1), 2))
test('flatten', t => t.deepEqual([1, [2, 3, [4]]].flatten(), [1, 2, 3, [4]]))
test('flattenDeep', t => t.deepEqual([1, [2, 3, [4]]].flattenDeep(), [1, 2, 3, 4]))
test('flattenDepth', t => t.deepEqual([1, [2, 3, [4]]].flattenDepth(1), [1, 2, 3, [4]]))
test('fromPairs', t => t.deepEqual([[1, 2], [3, 4]].fromPairs(), { 1: 2, 3: 4 }))
test('head', t => t.is([1, 2, 3].head(), 1))
test('initial', t => t.deepEqual([1, 2, 3].initial(), [1, 2]))
test('intersection', t => t.deepEqual([1, 2, 3].intersection([1, 2]), [1, 2]))
test('intersectionWith', t => t.deepEqual([1, 2, 3].intersectionWith([1, 2], (a: number, b: number) => a + 1 === b), [1]))
test('last', t => t.deepEqual([1, 2, 3].last(), 3))
test('nth', t => t.deepEqual([1, 2, 3].nth(1), 2))
test('pull', t => t.deepEqual([1, 2, 3].pull(2, 3), [1]))
