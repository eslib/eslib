import { authors, versions } from './'
import { satisfies } from 'semver'

export let isCompatible = <T extends object, K extends keyof T>(type: T) =>
  (name: K) => (author: string) => (version: string) =>
    authors.get(type)(name) === author
      && satisfies(version, '^' + versions.get(type)(name))

export let isNative = (a: any) =>
  String(a).indexOf('[native code]') > -1
