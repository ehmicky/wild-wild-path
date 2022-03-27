import type { Query } from 'wild-wild-parser'

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
}

export function has(target: Target, query: Query, options?: Options): boolean
export function get(
  target: Target,
  query: Query,
  options?: Options,
): any | undefined
