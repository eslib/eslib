import '../src'
import test from 'ava'

// ['chunk', 'compact', 'difference', 'differenceBy', 'differenceWith', 'drop', 'dropRight', 'dropRightWhile', 'dropWhile', 'fill', 'findIndex', 'findLastIndex', 'flatten', 'flattenDeep', 'flattenDepth', 'fromPairs', 'head', 'initial', 'intersection', 'intersectionBy', 'intersectionWith', 'last', 'nth', 'pull', 'pullAll', 'pullAllBy', 'pullAllWith', 'pullAt', 'remove', 'sortedIndex', 'sortedIndexBy', 'sortedIndexOf', 'sortedLastIndex', 'sortedLastIndexBy', 'sortedLastIndexOf', 'sortedUniq', 'sortedUniqBy', 'tail', 'take', 'takeRight', 'takeRightWhile', 'takeWhile', 'union', 'unionBy', 'unionWith', 'uniq', 'uniqBy', 'uniqWith', 'unzip', 'unzipWith', 'without', 'xor', 'xorBy', 'xorWith', 'zip', 'zipObject', 'zipObjectDeep', 'zipWith']

test('chunk', t => t.deepEqual([1, 2, 3, 4].chunk(2), [[1, 2], [3, 4]]))
test('compact', t => t.deepEqual([1, false, 0, NaN, ''].compact(), [1]))
test('difference', t => t.deepEqual([1, 2].difference([2, 3]), [1]))
test('differenceBy', t => t.deepEqual([1, 2].differenceBy([2, 3], _ => _), [1]))
test('drop', t => t.deepEqual([1, 2].drop(1), [2]))
test('dropRight', t => t.deepEqual([1, 2].dropRight(1), [1]))
test('dropRightWhile', t => t.deepEqual([1, 2].dropRightWhile(_ => _ > 1), [1]))
