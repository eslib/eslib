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

## Why you should use ESlib (aka. "This is blasphemy!")

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

Wait, wait - isn't extending the prototype in JavaScript unsafe? Well, yes. Extending the `prototype` is bad for a few reasons:

1. Libraries might extend the `prototype` in unexpected ways
2. Those extensions might conflict with one another
3. If two libraries add a method with the same name to a `prototype`, they might be incompatible

What's interesting is that these problems are mostly unique to dynamically typed languages. What's also interesting is that best practices depend on your language of choice: JavaScript people don't like prototype extensions, but Ruby people love them. If you haven't worked with statically typed languages before, you might be surprised to learn that static type systems can make prototype extensions *safe* - you'll know exactly how the prototype has been extended (you'll even get autocomplete for it), and you'll know at compile time (ie. when you write your code, *before* you run it) if there are any conflicting extensions.

ESLib takes advantage of this to give JavaScript the standard library it deserves, guilt-free.

## Why you should not use ESlib

- **If you're a functional programming purist**, this style of programming is Object Oriented, and is probably not for you
- **If you're writing performance critical code**, prototype extensions slow down scope lookups. Luckily, the sort of slowdown we're talking about won't be noticeable in 99.99% of applications (see [benchmarks](TODO) for more info)

## Install ESlib

```sh
npm install eslib
```

## Then install and import ESlib extensions

Install the desired ESlib extension package. For example, for the [Lodash](https://github.com/eslib/lodash) package, all you need to do is:

1. Install the extension:

  ```sh
  npm install @eslib/lodash -S
  ```

2. Import the extension with the following line to your index (entry) file:

  ```js
  import '@eslib/lodash'
  ```

## Usage (Authoring extensions)

ESlib provides a simple API for registering extensions. For example, I can use it to provide a `size` method for objects:

```js
import { assign } from 'eslib'

// define a size function
function size() {
  return Object.keys(this).length
}

// register it
assign(Object.prototype, { size }, '@bcherny', '1.0.0')

// use it
{ a: 1 }.size() // 1
```

Let's break down the 4 parameters I passed to `assign`:

- `Object` - The class whose prototype I want to extend
- `{ size }` - The method `"size"` should map to the function `size` we defined above
- `'@bcherny'` - The method's author (it can be any string), used by ESlib to check methods for compatability
- `'1.0.0'` - The method's version (a [semver](http://semver.org/) string), used by ESlib to check methods for compatability

## How it works

Extending built-in types is straight-forward (just add a method/object on it or its prototype), so all we need to do is ensure that the extension is done safely (i.e. it doesn't conflict with other extensions, or override native functionality in a backwards-incompatible way). There are a few approaches I could have taken to enforce API compatibility:

1. A static type system (TypeScript, Flow, or Closure annotations)
2. Semver, like what NPM does at the package level
3. Running unit tests from one extension against another extension's implementation (this relies on unit tests testing for the specific edge cases where the implementations differ, which is too optimistic)
4. Generating tests based on an extension's API and running those against another extension's implementation (too slow to do at runtime, and would introduce a mandatory build step)
5. Block level import scoping (too verbose to use in JavaScript)

Scala for example uses 1 and 5. I settled on 1 and 2. If you have an opinion on this, please file an issue!

## Tests

```sh
npm test
```

## License

MIT
