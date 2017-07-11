import test from 'ava'
import { assign } from '../src'

declare global {
  interface Array<T> {
    a(): number
    b(): number
    c(): number
    d(): number
    e(): number
    f: object
  }
}

test('it assigns', t => {
  let count = 0
  let fn = () => ++count
  assign(Array.prototype, { a: fn }, 'bar', '1.2.3')
  t.is([].a(), 1)
  t.is(count, 1)
})

test('it rejects when a native method is already defined', t => {
  let { indexOf } = Array.prototype
  assign(Array.prototype, { indexOf: () => 2 }, 'bar', '1.2.3')
  t.is(Array.prototype.indexOf, indexOf)
})

test('it rejects when some other property is already defined', t => {
  let f = { foo: 1 }
  Array.prototype.f = f
  assign(Array.prototype, { f: () => { } }, 'bar', '1.2.3')
  t.is(Array.prototype.f, f)
})

test('it rejects when it was already installed by another source', t => {
  let a = () => 1
  let b = () => 1
  assign(Array.prototype, { b: a }, 'foo', '1.2.3')
  assign(Array.prototype, { b }, 'bar', '1.2.3')
  t.is(Array.prototype.b, a)
})

test('it rejects when it is incompatible with an already installed version', t => {
  let a = () => 1
  let b = () => 1
  assign(Array.prototype, { c: a }, 'foo', '1.0.0')
  assign(Array.prototype, { c: b }, 'foo', '2.0.0')
  t.is(Array.prototype.c, a)
})

test('it rejects when it is older than an already installed version', t => {
  let a = () => 1
  let b = () => 1
  assign(Array.prototype, { d: a }, 'foo', '1.0.1')
  assign(Array.prototype, { d: b }, 'foo', '1.0.0')
  t.is(Array.prototype.d, a)
})

test('it accepts when it is newer than and compatible with an already installed version', t => {
  let a = () => 1
  let b = () => 1
  assign(Array.prototype, { e: a }, 'foo', '1.0.0')
  t.is(Array.prototype.e, a)
  assign(Array.prototype, { e: b }, 'foo', '1.0.1')
  t.is(Array.prototype.e, b)
})

test('it rejects when it is a reserved word', t => {
  assign(Object.prototype as any, { get: () => {} }, 'foo', '1.0.1')
  t.is((Array.prototype as any).get, undefined)
})
