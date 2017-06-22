<img src="logo.png" alt="ESlib" width="254px" />

[![Build Status][build]](https://circleci.com/gh/bcherny/eslib) [![npm]](https://www.npmjs.com/package/eslib) [![mit]](https://opensource.org/licenses/MIT)

[build]: https://img.shields.io/circleci/project/bcherny/eslib.svg?branch=master&style=flat-square
[npm]: https://img.shields.io/npm/v/eslib.svg?style=flat-square
[mit]: https://img.shields.io/npm/l/eslib.svg?style=flat-square

> Safe, extended standard library for TypeScript and JavaScript

**Work in progress.**

## Example

```ts
import 'eslib'

[1, 2, 3, 4]
  .chunk(2)
  .map(arr => arr.head()) // [1, 3]
```

## Rationale (aka. "This is blasphemy!")

If you've ever written production JavaScript before, you've at some point needed to install a utility library to do what JavaScript can't do out of the box. Or worse, you've rolled your own utility functions. Because of JS's limited standard library, for most projects you need tools like Lodash, Underscore, Ramda, or JQuery to provide those missing utility functions.

Here's an example (I've written code like this more times than I care to admit):

```js
import { fromPairs, mapValues } from 'lodash'

let data = [1, 2, 3, 4]
let array = mapValues(fromPairs(
  data
    .filter(i => i > 2)
    .map((item, index) => [item, index])
), i => i * 2)
```

The problem with this code is that it mixes abstractions. I can rewrite it to only use only functions (which I am told are all the rage):

```js
import { filter, fromPairs, mapValues, zipWith } from 'lodash'

let data = [1, 2, 3, 4]
let array = mapValues(
  fromPairs(
    zipWith(
      filter(data, i => i > 2),
      (item, index) => index
    )
  ),
  i => i * 2
)
```

Or, I can use Lodash's `chain` utility to write it in an Object Oriented style instead:

```js
import { chain } from 'lodash'

let data = [1, 2, 3, 4]
let array = chain(data)
  .filter(i => i > 2)
  .zipWith((item, index) => index)
  .fromPairs()
  .mapValues(i => i * 2)
  .value()
```

But what if I'm not using Lodash? And what if I don't dig the extra verbosity that explicitly using Lodash brings? In languages like Scala, you can add scoped implicit methods to prototypes (or, Scala's equivalent). What would it look like to do the same thing in JavaScript?

```js
let data = [1, 2, 3, 4]
let array = data
  .filter(i => i > 2)
  .zipWithIndex()
  .fromPairs()
  .mapValues(i => i * 2)
```

But wait, isn't extending the prototype in JavaScript unsafe? Yes and no. Extending the `prototype` is usually bad for a couple of reasons:

1. Libraries might extend the `prototype` in unexpected ways
2. Those extensions might conflict with one another
3. If two libraries add the same method to a `prototype`, those methods aren't necessarily compatible

What's interesting is that these problems are mostly unique to dynamically typed languages. What's also interesting is that best practices depend on your language of choice: JavaScript people don't like prototype extensions, but Ruby people love them. If you haven't worked with statically typed languages before, you might be surprised to learn that static type systems can make prototype extensions *safe* - you'll know exactly how the prototype has been extended (you'll even get autocomplete for it), and you'll know at compile time (ie. when you write your code, *before* you run it) if there are any conflicting extensions.

ESLib takes advantage of this to give JavaScript the standard library it deserves, guilt-free.

**If you're a pragmatist.**

## Why you should not use TSlib

- **If you're a functional programming purist**, this style of programming is Object Oriented, and is probably not for you
- **If you're writing performance critical code**, prototype extensions slow down scope lookups. Luckily, the sort of slowdown we're talking about won't be noticeable in 99.99% of applications (see [benchmarks](TODO) for more info)

## Tests

```sh
npm test
```

## License

MIT