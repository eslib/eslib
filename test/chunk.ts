import '../src'
import test from 'ava'

test('chunk', t => {
  t.deepEqual([1, 2, 3, 4].chunk(2), [[1, 2], [3, 4]])
})
