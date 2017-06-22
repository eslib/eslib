import test from 'ava'
import { assign, Extension } from '../src'

declare global {
  interface Array<T> {
    a: Extension<number>
    b: Extension<number>
    c: Extension<number>
    d: Extension<number>
    e: Extension<number>
    f: object
  }
}

test('it assigns', t => {
  let count = 0
  let fn = () => ++count
  assign(Array, { a: fn }, 'bar', '1.2.3')
  t.is([].a(), 1)
  t.is(count, 1)
  t.is([].a.author, 'bar')
  t.is([].a.version, '1.2.3')
})

test('it rejects when a native method is already defined', t => {
  let { indexOf } = Array.prototype
  assign(Array, { indexOf: () => 2 }, 'bar', '1.2.3')
  t.is(Array.prototype.indexOf, indexOf)
})

test('it rejects when some other property is already defined', t => {
  let f = { foo: 1 }
  Array.prototype.f = f
  assign(Array, { f: () => { } }, 'bar', '1.2.3')
  t.is(Array.prototype.f, f)
})

test('it rejects when it was already installed by another source', t => {
  let a = () => 1
  let b = () => 1
  assign(Array, { b: a }, 'foo', '1.2.3')
  assign(Array, { b }, 'bar', '1.2.3')
  t.is(Array.prototype.b.originalFunction, a)
})

test('it rejects when it is incompatible with an already installed version', t => {
  let a = () => 1
  let b = () => 1
  assign(Array, { c: a }, 'foo', '1.0.0')
  assign(Array, { c: b }, 'foo', '2.0.0')
  t.is(Array.prototype.c.originalFunction, a)
})

test('it rejects when it is older than an already installed version', t => {
  let a = () => 1
  let b = () => 1
  assign(Array, { d: a }, 'foo', '1.0.1')
  assign(Array, { d: b }, 'foo', '1.0.0')
  t.is(Array.prototype.d.originalFunction, a)
})

test('it accepts when it is newer than and compatible with an already installed version', t => {
  let a = () => 1
  let b = () => 1
  assign(Array, { e: a }, 'foo', '1.0.0')
  t.is(Array.prototype.e.originalFunction, a)
  assign(Array, { e: b }, 'foo', '1.0.1')
  t.is(Array.prototype.e.originalFunction, b)
})
