import test from 'ava'
import { assign, ASSIGN_ERROR } from '../src'

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
  let errors = assign(Array.prototype, { indexOf: () => 2 }, 'bar', '1.2.3')
  t.is(errors[0].error, ASSIGN_ERROR.ALREADY_EXISTS_NATIVE)
  t.is(Array.prototype.indexOf, indexOf)
})

test('it rejects when some other property is already defined', t => {
  let f = { foo: 1 }
  Array.prototype.f = f
  let errors = assign(Array.prototype, { f: () => { } }, 'bar', '1.2.3')
  t.is(errors[0].error, ASSIGN_ERROR.ALREADY_EXISTS_EXTERNAL)
  t.is(Array.prototype.f, f)
})

test('it rejects when it was already installed by another source', t => {
  let a = () => 1
  let b = () => 1
  let errors1 = assign(Array.prototype, { b: a }, 'foo', '1.2.3')
  let errors2 = assign(Array.prototype, { b }, 'bar', '1.2.3')
  t.is(errors1.length, 0)
  t.is(errors2[0].error, ASSIGN_ERROR.ALREADY_EXISTS_INCOMPATIBLE_LIB)
  t.is(Array.prototype.b, a)
})

test('it rejects when it is incompatible with an already installed version', t => {
  let a = () => 1
  let b = () => 1
  let errors1 = assign(Array.prototype, { c: a }, 'foo', '1.0.0')
  let errors2 = assign(Array.prototype, { c: b }, 'foo', '2.0.0')
  t.is(errors1.length, 0)
  t.is(errors2[0].error, ASSIGN_ERROR.ALREADY_EXISTS_INCOMPATIBLE_VERSION)
  t.is(Array.prototype.c, a)
})

test('it rejects when it is older than an already installed version', t => {
  let a = () => 1
  let b = () => 1
  let errors1 = assign(Array.prototype, { d: a }, 'foo', '1.0.1')
  let errors2 = assign(Array.prototype, { d: b }, 'foo', '1.0.0')
  t.is(errors1.length, 0)
  t.is(errors2[0].error, ASSIGN_ERROR.ALREADY_EXISTS_INCOMPATIBLE_VERSION)
  t.is(Array.prototype.d, a)
})

test('it accepts when it is newer than and compatible with an already installed version', t => {
  let a = () => 1
  let b = () => 1
  let errors1 = assign(Array.prototype, { e: a }, 'foo', '1.0.0')
  t.is(Array.prototype.e, a)
  let errors2 = assign(Array.prototype, { e: b }, 'foo', '1.0.1')
  t.is(Array.prototype.e, b)
  t.is(errors1.length, 0)
  t.is(errors2.length, 0)
})

test('it rejects when it is a reserved word', t => {
  let errors = assign(Object.prototype as any, { get: () => {} }, 'foo', '1.0.1')
  t.is((Array.prototype as any).get, undefined)
  t.is(errors[0].error, ASSIGN_ERROR.RESERVED_WORD)
})
