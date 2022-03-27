import type { Query, PathArray } from 'wild-wild-parser'

export type Target = object | any[]
export type { Query }

export interface Options {
  readonly childFirst?: boolean
  readonly roots?: boolean
  readonly leaves?: boolean
  readonly sort?: boolean
  readonly missing?: boolean
  readonly entries?: boolean
  readonly classes?: boolean
  readonly inherited?: boolean
  readonly mutate?: boolean
}
type OptionsWithEntries = Options & { readonly entries: true }

type Value = any
export interface Entry {
  value: Value
  path: PathArray
  missing: boolean
}

export function has(target: Target, query: Query, options?: Options): boolean
export function get<T extends Options>(
  target: Target,
  query: Query,
  options?: T,
): (T extends OptionsWithEntries ? Entry : Value) | undefined
export function list<T extends Options>(
  target: Target,
  query: Query,
  options?: T,
): (T extends OptionsWithEntries ? Entry : Value)[]
export function iterate<T extends Options>(
  target: Target,
  query: Query,
  options?: T,
): Generator<T extends OptionsWithEntries ? Entry : Value>
export function remove(target: Target, query: Query, options?: Options): Target
export function set(
  target: Target,
  query: Query,
  value: Value,
  options?: Options,
): Target
