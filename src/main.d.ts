import type { PathArray, Query } from 'wild-wild-parser'

export type Target = object | unknown[]
export type { Query }

export interface Options {
  /**
   * When using unions or deep wildcards, a query might match both a property
   * and some of its children.
   * This option decides whether the returned properties should be sorted from
   * children to parents, or the reverse.
   *
   * @default false
   *
   * @example
   * ```js
   * const target = { user: { name: 'Alice' } }
   * list(target, 'user.**') // [{ name: 'Alice' }, 'Alice']
   * list(target, 'user.**', { childFirst: true }) // ['Alice', { name: 'Alice' }]
   * ```
   */
  readonly childFirst?: boolean

  /**
   * When using unions or deep wildcards, a query might match both a property
   * and some of its children.
   * When `true`, only roots are matched. In other words, a matching property is
   * ignored if one of its parents also matches.
   *
   * @default false
   *
   * @example
   * ```js
   * const target = { user: { name: 'Alice' } }
   * list(target, 'user.**') // [{ name: 'Alice' }, 'Alice']
   * list(target, 'user.**', { roots: true }) // [{ name: 'Alice' }]
   * ```
   */
  readonly roots?: boolean

  /**
   * When using unions or deep wildcards, a query might match both a property
   * and some of its children.
   * When `true`, only leaves are matched. In other words, a matching property
   * is ignored if one of its children also matches.
   *
   * @default false
   *
   * @example
   * ```js
   * const target = { user: { name: 'Alice' } }
   * list(target, 'user.**') // [{ name: 'Alice' }, 'Alice']
   * list(target, 'user.**', { leaves: true }) // ['Alice']
   * ```
   */
  readonly leaves?: boolean

  /**
   * When returning sibling object properties, sort them by the lexigographic
   * order of their names (not values).
   *
   * @default false
   *
   * @example
   * ```js
   * const target = { lastName: 'Doe', firstName: 'John' }
   * list(target, '*') // ['Doe', 'John']
   * list(target, '*', { sort: true }) // ['John', 'Doe']
   * ```
   */
  readonly sort?: boolean

  /**
   * When `false`, properties not defined in the target are ignored.
   *
   * @default `false` with `list|iterate()`, `true` with `set()`
   *
   * @example
   * ```js
   * const target = {}
   *
   * set(target, 'name', 'Alice') // { name: 'Alice' }
   * set(target, 'name', 'Alice', { missing: false }) // {}
   *
   * list(target, 'name') // []
   * list(target, 'name', { missing: true, entries: true })
   * // [{ value: undefined, path: ['name'], missing: true }]
   * ```
   */
  readonly missing?: boolean

  /**
   * By default, properties' values are returned.
   * When `true`, objects with the following shape are returned instead:
   *  - `value` `any`: property's value
   *  - `path` `Path`: property's full path
   *  - `missing` `boolean`: whether the property is missing from the target
   *
   * @default false
   *
   * @example
   * ```js
   * const target = { firstName: 'Alice', lastName: 'Smith' }
   * list(target, '*') // ['Alice', 'Smith']
   * list(target, '*', { entries: true })
   * // [
   * //   { value: 'Alice', path: ['firstName'], missing: false },
   * //   { value: 'Smith', path: ['lastName'], missing: false },
   * // ]
   * ```
   */
  readonly entries?: boolean

  /**
   * If `true`, wildcards do not recurse on arrays.
   * Array items can still be matched by using indices or slices.
   *
   * @default false
   *
   * @example
   * ```js
   * const target = [{ name: 'Alice' }, { name: 'Bob' }]
   * list(target, '**')
   * // [
   * //   [{ name: 'Alice' }, { name: 'Bob' }],
   * //   { name: 'Alice' },
   * //   'Alice',
   * //   { name: 'Bob' },
   * //   'Bob',
   * // ]
   * list(target, '**', { shallowArrays: true })
   * // [
   * //   [{ name: 'Alice' }, { name: 'Bob' }],
   * // ]
   * ```
   */
  readonly shallowArrays?: boolean

  /**
   * Unless `true`, wildcards and regexps ignore properties of objects that are
   * not plain objects (like class instances, errors or functions).
   * Those can still be matched by using their property name.
   *
   * @default false
   *
   * @example
   * ```js
   * const target = { user: new User({ name: 'Alice' }) }
   * list(target, 'user.*') // []
   * list(target, 'user.*', { classes: true }) // ['Alice']
   * ```
   */
  readonly classes?: boolean

  /**
   * By default, wildcards and regexps ignore properties that are either
   * inherited or not enumerable. Those can still be matched by using their
   * property name.
   * When `true`, inherited properties are not ignored, but not enumerable ones
   * still are.
   *
   * @default false
   */
  readonly inherited?: boolean

  /**
   * By default, the target is deeply cloned. When `true`, it is directly
   * mutated instead, which is faster but has side effects.
   *
   * @default false
   *
   * @example
   * ```js
   * const target = {}
   * console.log(set(target, 'name', 'Alice')) // { name: 'Alice' }
   * console.log(target) // {}
   * console.log(set(target, 'name', 'Alice', { mutate: true })) // { name: 'Alice' }
   * console.log(target) // { name: 'Alice' }
   * ```
   */
  readonly mutate?: boolean
}
type OptionsWithEntries = Options & { readonly entries: true }

type Value = unknown

/**
 * Property entry
 */
export interface Entry {
  /**
   * Property's value
   */
  value: Value
  /**
   * Property's full path
   */
  path: PathArray
  /**
   * Whether the property is missing from the target
   */
  missing: boolean
}

/**
 * Return whether the `query` matches any property.
 *
 * @example
 * ```js
 * const target = { settings: { lastName: undefined, colors: ['red', 'blue'] } }
 *
 * has(target, 'settings.firstName') // false
 * has(target, ['settings', 'firstName']) // false
 * has(target, 'settings.lastName') // true
 * ```
 */
export function has(target: Target, query: Query, options?: Options): boolean

/**
 * Return the first property matching the `query`.
 *
 * @example
 * ```js
 * const target = { settings: { colors: ['red', 'blue'] } }
 * get(target, 'settings.colors.0') // 'red'
 * get(target, ['settings', 'colors', 0]) // 'red'
 * ```
 */
export function get<T extends Options>(
  target: Target,
  query: Query,
  options?: T,
): (T extends OptionsWithEntries ? Entry : Value) | undefined

/**
 * Return all properties matching the `query`, as an array.
 *
 * @example
 * ```js
 * const target = {
 *   userOne: { firstName: 'John', lastName: 'Doe', age: 72 },
 *   userTwo: { firstName: 'Alice', colors: ['red', 'blue', 'yellow'] },
 * }
 *
 * list(target, 'userOne.firstName userTwo.colors.0') // ['John', 'red']
 * list(target, [
 *   ['userOne', 'firstName'],
 *   ['userTwo', 'colors', 0],
 * ]) // ['John', 'red']
 *
 * list(target, 'userOne./Name/') // ['John', 'Doe']
 * list(target, ['userOne', /Name/]) // ['John', 'Doe']
 *
 * list(target, 'userTwo.colors.*') // ['red', 'blue', 'yellow']
 * list(target, 'userTwo.colors.0:2') // ['red', 'blue']
 * list(target, '**.firstName') // ['John', 'Alice']
 * list(target, 'userOne.*', { entries: true })
 * // [
 * //   { value: 'John', path: ['userOne', 'firstName'], missing: false },
 * //   { value: 'Doe', path: ['userOne', 'lastName'], missing: false },
 * //   { value: 72, path: ['userOne', 'age'], missing: false },
 * // ]
 * ```
 */
export function list<T extends Options>(
  target: Target,
  query: Query,
  options?: T,
): (T extends OptionsWithEntries ? Entry : Value)[]

/**
 * Return all properties matching the `query`, as an iterable.
 * This is slower than `list()` but uses less memory.
 *
 * @example
 * ```js
 * const target = { settings: { colors: ['red', 'blue'] } }
 *
 * for (const color of iterate(target, 'settings.colors.*')) {
 *   console.log(color) // 'red', 'blue'
 * }
 * ```
 */
export function iterate<T extends Options>(
  target: Target,
  query: Query,
  options?: T,
): Generator<T extends OptionsWithEntries ? Entry : Value>

/**
 * Delete all properties matching the `query`. The return value is a deep clone
 * unless the `mutate` option is `true`.
 *
 * @example
 * ```js
 * const target = { user: { firstName: 'John', lastName: 'Doe', age: 72 } }
 *
 * remove(target, 'user.lastName') // { user: { firstName: 'John', age: 72 } }
 * remove(target, 'user./Name/') // { user: { age: 72 } }
 * remove(target, ['user', /Name/]) // { user: { age: 72 } }
 * ```
 */
export function remove(target: Target, query: Query, options?: Options): Target

/**
 * Sets all properties matching the `query`. The return value is a deep clone
 * unless the `mutate` option is `true`.
 *
 * @example
 * ```js
 * const target = { colors: ['red', 'blue'] }
 *
 * set(target, 'colors.0', 'yellow') // ['yellow', 'blue']
 * set(target, ['colors', 0], 'yellow') // ['yellow', 'blue']
 * set(target, 'colors.-1', 'yellow') // ['red', 'yellow']
 * set(target, 'colors.-0', 'yellow') // ['red', 'blue', 'yellow']
 * set(target, 'colors.*', 'yellow') // ['yellow', 'yellow']
 * set({}, 'user.0.color', 'red') // { user: [{ color: 'red' }] }
 * set({}, 'user.0.color', 'red', { missing: false }) // {}
 * ```
 */
// eslint-disable-next-line @typescript-eslint/max-params
export function set(
  target: Target,
  query: Query,
  value: Value,
  options?: Options,
): Target

export function isObject(value: unknown, classes: boolean): boolean
