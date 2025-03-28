<img alt="wild-wild-path logo" src="https://raw.githubusercontent.com/ehmicky/design/main/wild-wild-path/wild-wild-path.svg?sanitize=true" width="700"/>

[![Node](https://img.shields.io/badge/-Node.js-808080?logo=node.js&colorA=404040&logoColor=66cc33)](https://www.npmjs.com/package/wild-wild-path)
[![Browsers](https://img.shields.io/badge/-Browsers-808080?logo=firefox&colorA=404040)](https://unpkg.com/wild-wild-path?module)
[![TypeScript](https://img.shields.io/badge/-Typed-808080?logo=typescript&colorA=404040&logoColor=0096ff)](/src/main.d.ts)
[![Codecov](https://img.shields.io/badge/-Tested%20100%25-808080?logo=codecov&colorA=404040)](https://codecov.io/gh/ehmicky/wild-wild-path)
[![Minified size](https://img.shields.io/bundlephobia/minzip/wild-wild-path?label&colorA=404040&colorB=808080&logo=webpack)](https://bundlephobia.com/package/wild-wild-path)
[![Mastodon](https://img.shields.io/badge/-Mastodon-808080.svg?logo=mastodon&colorA=404040&logoColor=9590F9)](https://fosstodon.org/@ehmicky)
[![Medium](https://img.shields.io/badge/-Medium-808080.svg?logo=medium&colorA=404040)](https://medium.com/@ehmicky)

🤠 Object property paths with wildcards and regexps. 🌵

Get/set object properties using:

- ⛏️ [Dot-delimited paths](#%EF%B8%8F-deep-properties): `foo.bar.0.baz`
- ⭐ [Wildcards](#-wildcards): `foo.*`, `**.bar`
- 🗺️ [Regexps](#%EF%B8%8F-regexps): `foo./ba?/`
- 🏜️ [Slices](#%EF%B8%8F-array-slices): `foo.0:2`
- 🚂 [Unions](#-unions): `foo bar baz`

# Install

```bash
npm install wild-wild-path
```

This package works in both Node.js >=18.18.0 and
[browsers](https://raw.githubusercontent.com/ehmicky/dev-tasks/main/src/browserslist).

This is an ES module. It must be loaded using
[an `import` or `import()` statement](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c),
not `require()`. If TypeScript is used, it must be configured to
[output ES modules](https://www.typescriptlang.org/docs/handbook/esm-node.html),
not CommonJS.

# API

## Methods

### get(target, query, options?)

`target`: [`Target`](#target)\
`query`: [`Query`](#queries)\
`options`: [`Options?`](#options)\
_Return value_: `any | undefined`

Return the first property matching the `query`.

```js
const target = { settings: { colors: ['red', 'blue'] } }

get(target, 'settings.colors.0') // 'red'
get(target, ['settings', 'colors', 0]) // 'red'
```

### has(target, query, options?)

`target`: [`Target`](#target)\
`query`: [`Query`](#queries)\
`options`: [`Options?`](#options)\
_Return value_: `boolean`

Return whether the `query` matches any property.

```js
const target = { settings: { lastName: undefined, colors: ['red', 'blue'] } }

has(target, 'settings.firstName') // false
has(target, ['settings', 'firstName']) // false
has(target, 'settings.lastName') // true
```

### list(target, query, options?)

`target`: [`Target`](#target)\
`query`: [`Query`](#queries)\
`options`: [`Options?`](#options)\
_Return value_: `any[]`

Return all properties matching the `query`, as an array.

<!-- eslint-disable require-unicode-regexp -->

```js
const target = {
  userOne: { firstName: 'John', lastName: 'Doe', age: 72 },
  userTwo: { firstName: 'Alice', colors: ['red', 'blue', 'yellow'] },
}

list(target, 'userOne.firstName userTwo.colors.0') // ['John', 'red']
list(target, [
  ['userOne', 'firstName'],
  ['userTwo', 'colors', 0],
]) // ['John', 'red']

list(target, 'userOne./Name/') // ['John', 'Doe']
list(target, ['userOne', /Name/]) // ['John', 'Doe']

list(target, 'userTwo.colors.*') // ['red', 'blue', 'yellow']
list(target, 'userTwo.colors.0:2') // ['red', 'blue']
list(target, '**.firstName') // ['John', 'Alice']
list(target, 'userOne.*', { entries: true })
// [
//   { value: 'John', path: ['userOne', 'firstName'], missing: false },
//   { value: 'Doe', path: ['userOne', 'lastName'], missing: false },
//   { value: 72, path: ['userOne', 'age'], missing: false },
// ]
```

### iterate(target, query, options?)

`target`: [`Target`](#target)\
`query`: [`Query`](#queries)\
`options`: [`Options?`](#options)\
_Return value_:
[`Iterable<any>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#examples_using_the_iteration_protocols)

Return all properties matching the `query`, as an
[iterable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#examples_using_the_iteration_protocols).
This is slower than [`list()`](#listtarget-query-options) but uses less memory.

<!-- eslint-disable fp/no-loops -->

```js
const target = { settings: { colors: ['red', 'blue'] } }

for (const color of iterate(target, 'settings.colors.*')) {
  console.log(color) // 'red', 'blue'
}
```

### set(target, query, value, options?)

`target`: [`Target`](#target)\
`query`: [`Query`](#queries)\
`value`: `any`\
`options`: [`Options?`](#options)\
_Return value_: `Target`

Sets all properties matching the `query`. The return value is a deep clone
unless the [`mutate`](#mutate) option is `true`.

```js
const target = { colors: ['red', 'blue'] }

set(target, 'colors.0', 'yellow') // ['yellow', 'blue']
set(target, ['colors', 0], 'yellow') // ['yellow', 'blue']
set(target, 'colors.-1', 'yellow') // ['red', 'yellow']
set(target, 'colors.-0', 'yellow') // ['red', 'blue', 'yellow']
set(target, 'colors.*', 'yellow') // ['yellow', 'yellow']
set({}, 'user.0.color', 'red') // { user: [{ color: 'red' }] }
set({}, 'user.0.color', 'red', { missing: false }) // {}
```

### remove(target, query, options?)

`target`: [`Target`](#target)\
`query`: [`Query`](#queries)\
`options`: [`Options?`](#options)\
_Return value_: `Target`

Delete all properties matching the `query`. The return value is a deep clone
unless the [`mutate`](#mutate) option is `true`.

<!-- eslint-disable require-unicode-regexp -->

```js
const target = { user: { firstName: 'John', lastName: 'Doe', age: 72 } }

remove(target, 'user.lastName') // { user: { firstName: 'John', age: 72 } }
remove(target, 'user./Name/') // { user: { age: 72 } }
remove(target, ['user', /Name/]) // { user: { age: 72 } }
```

## Functional utilities

[`wild-wild-utils`](https://github.com/ehmicky/wild-wild-utils) is a separate
library which provides with additional, higher-level methods:
[`map()`](https://github.com/ehmicky/wild-wild-utils#maptarget-query-mapfunction-options),
[`merge()`](https://github.com/ehmicky/wild-wild-utils#mergetarget-query-value-options),
[`push()`](https://github.com/ehmicky/wild-wild-utils#pushtarget-query-values-options),
[`unshift()`](https://github.com/ehmicky/wild-wild-utils#unshifttarget-query-values-options),
[`find()`](https://github.com/ehmicky/wild-wild-utils#findtarget-query-testfunction-options),
[`pick()`](https://github.com/ehmicky/wild-wild-utils#picktarget-query-options),
[`include()`](https://github.com/ehmicky/wild-wild-utils#includetarget-query-testfunction-options),
[`exclude()`](https://github.com/ehmicky/wild-wild-utils#excludetarget-query-testfunction-options),
[`flatten()`](https://github.com/ehmicky/wild-wild-utils#flattentarget-options).

## Target

The target value must be an object or an array.

## Queries

There are two equivalent formats for queries: strings and arrays.

- Query [strings](#query-strings) are friendlier to CLI usage, more expressive,
  and easier to serialize.
- Query [arrays](#query-arrays) are friendlier to programmatic usage, and
  faster. Also, they do not require escaping, so they should be used when the
  input is dynamic or user-provided to prevent injection attacks.

### Query strings

#### ⛏️ Deep properties

```bash
# Deep properties of objects or arrays.
# Dots are used for array indices, not brackets.
# Symbol properties are always ignored.
user.colors.0
```

#### 🚂 Unions

```bash
# Unions ("or") of queries are space-delimited.
# The string must not be empty.
colors name age
```

#### ⭐ Wildcards

```bash
# Shallow wildcards target all properties/items of a single object/array
user.*

# Deep wildcards target all properties/items of 0, 1 or many objects/arrays
user.**
**.colors
```

#### 🗺️ Regexps

```bash
# Regexps match property names
user./name/

# Flags can be used, e.g. to make it case-insensitive
user./name/i

# ^ $ must be used to match from the beginning or until the end
user./^name$/i
```

#### 🌵 Arrays indices

```bash
# Array indices are integers
user.colors.0

# Array indices can be negative.
# -1 is the last item.
# -0 is the item after it, which can be used to append.
user.colors.-1
```

#### 🏜️ Array slices

```bash
# Array slices. Goes from the start (included) to the end index (excluded).
user.colors.0:2

# The start index defaults to 0, i.e. the beginning
user.colors.:2

# The end index defaults to -0, i.e. the end
user.colors.0:
user.colors.:
```

#### 🪨 Escaping

```bash
# Dots, spaces and backslashes in property names must be escaped
name\\ with\\ spaces
name\\.with\\.dots
name\\\\with\\\\backslashes

# Ambiguous property names must be escaped with a backslash at the beginning.
# This includes properties that:
#  - Are integers but are not array elements
#  - Have multiple slashes and start with one
name.\\0
name.\\/not_a_regexp/
```

#### 🏨 Root and empty strings

```bash
# A leading dot can optionally be used. It is ignored.
user.colors
.user.colors

# Root value
.

# Empty string properties
user..colors
```

### Query arrays

#### ⛏️ Deep properties

<!-- prettier-ignore -->
```es6
// Deep properties of objects or arrays.
// Symbol properties are always ignored.
['user', 'colors', 0]
```

#### 🚂 Unions

<!-- prettier-ignore -->
```es6
// Unions ("or") of queries are arrays of arrays.
// There must be at least one item.
[['colors'], ['name'], ['age']]
```

#### ⭐ Wildcards

<!-- prettier-ignore -->
```es6
// Shallow wildcards target all properties/items of a single object/array
['user', { type: 'any' }]

// Deep wildcards target all properties/items of 0, 1 or many objects/arrays
['user', { type: 'anyDeep' }]
[{ type: 'anyDeep' }, 'colors']
```

#### 🤠 Regexps

<!-- prettier-ignore -->
```es6
// Regexps match property names
['user', /name/]

// Flags can be used, e.g. to make it case-insensitive
['user', /name/i]

// ^ $ must be used to match from the beginning or until the end
['user', /^name$/i]
```

#### 🌵 Arrays indices

<!-- prettier-ignore -->
```es6
// Array indices are integers, not strings
['user', 'colors', 0]

// Array indices can be negative.
// -1 is the last item.
// -0 is the item after it, which can be used to append.
['user', 'colors', -1]
```

#### 🏜️ Array slices

<!-- prettier-ignore -->
```es6
// Array slices. Goes from the start (included) to the end index (excluded).
['user', 'colors', { type: 'slice', from: 0, to: 2 }]

// The start index defaults to 0, i.e. the beginning
['user', 'colors', { type: 'slice', to: 2 }]

// The end index defaults to -0, i.e. the end
['user', 'colors', { type: 'slice', from: 0 }]
['user', 'colors', { type: 'slice' }]
```

#### 🪨 Escaping

<!-- prettier-ignore -->
```es6
// Escaping is not necessary with query arrays
['name with spaces']
['name.with.dots']
['name\\with\\backslashes']
['name', '0']
['name', '/not_a_regexp/']
```

#### 🏨 Root and empty strings

<!-- prettier-ignore -->
```es6
// Root value
[]

// Empty string properties
['user', '', 'colors']
```

### Paths

A "path" is any [query](#queries) using only
[property names](#%EF%B8%8F-deep-properties) and positive
[array indices](#-arrays-indices). This excludes
[negative indices](#-arrays-indices), [slices](#%EF%B8%8F-array-slices),
[wildcards](#-wildcards), [regexps](#%EF%B8%8F-regexps) and [unions](#-unions).

Paths are returned by the [`entries`](#entries) option.

```bash
# Path string
user.colors.0
```

<!-- prettier-ignore -->
```es6
// Path array
['user', 'colors', 0]
```

### Conversions and comparisons

[`wild-wild-parser`](https://github.com/ehmicky/wild-wild-parser) can be used to
convert between both formats, or to compare queries.

### Undefined values

Object properties with a defined key but an `undefined` value are not ignored.
However, object properties without any defined key are ignored. The
[`has()`](#hastarget-query-options) method, [`missing`](#missing) option and
[`entries`](#entries) option can be used to distinguish those.

```js
const target = { name: undefined }

has(target, 'name') // true
has(target, 'colors') // false

get(target, 'name') // undefined
get(target, 'colors') // undefined
get(target, 'name', { entries: true, missing: true })
// { value: undefined, path: ['name'], missing: false }
get(target, 'colors', { entries: true, missing: true })
// { value: undefined, path: ['colors'], missing: true }

list(target, '*') // [undefined]
list(target, '*', { entries: true })
// [{ value: undefined, path: ['name'], missing: false }]
```

## Options

Options are optional plain objects.

### mutate

_Methods_: [`set()`](#settarget-query-value-options),
[`remove()`](#removetarget-query-options)\
_Type_: `boolean`\
_Default_: `false`

By default, the [target](#target) is deeply cloned.\
When `true`, it is directly mutated instead, which is faster but has side
effects.

```js
const target = {}
console.log(set(target, 'name', 'Alice')) // { name: 'Alice' }
console.log(target) // {}
console.log(set(target, 'name', 'Alice', { mutate: true })) // { name: 'Alice' }
console.log(target) // { name: 'Alice' }
```

### entries

_Methods_: [`get()`](#gettarget-query-options),
[`list()`](#listtarget-query-options),
[`iterate()`](#iteratetarget-query-options)\
_Type_: `boolean`\
_Default_: `false`

By default, properties' values are returned.\
When `true`, objects with the following shape are returned instead:

- `value` `any`: property's value
- `path` [`Path`](#paths): property's full path
- `missing` `boolean`: whether the property is [missing](#missing) from the
  [target](#target)

```js
const target = { firstName: 'Alice', lastName: 'Smith' }
list(target, '*') // ['Alice', 'Smith']
list(target, '*', { entries: true })
// [
//   { value: 'Alice', path: ['firstName'], missing: false },
//   { value: 'Smith', path: ['lastName'], missing: false },
// ]
```

### missing

_Methods_: all except [`has()`](#hastarget-query-options) and
[`remove()`](#removetarget-query-options)\
_Type_: `boolean`\
_Default_: `false` with `list|iterate()`, `true` with `set()`

When `false`, properties [not defined in the target](#undefined-values) are
ignored.

```js
const target = {}

set(target, 'name', 'Alice') // { name: 'Alice' }
set(target, 'name', 'Alice', { missing: false }) // {}

list(target, 'name') // []
list(target, 'name', { missing: true, entries: true })
// [{ value: undefined, path: ['name'], missing: true }]
```

### sort

_Methods_: [`get()`](#gettarget-query-options),
[`list()`](#listtarget-query-options),
[`iterate()`](#iteratetarget-query-options)\
_Type_: `boolean`\
_Default_: `false`

When returning sibling object properties, sort them by the lexigographic order
of their names (not values).

```js
const target = { lastName: 'Doe', firstName: 'John' }
list(target, '*') // ['Doe', 'John']
list(target, '*', { sort: true }) // ['John', 'Doe']
```

### childFirst

_Methods_: [`get()`](#gettarget-query-options),
[`list()`](#listtarget-query-options),
[`iterate()`](#iteratetarget-query-options)\
_Type_: `boolean`\
_Default_: `false`

When using [unions](#-unions) or [deep wildcards](#-wildcards), a query might
match both a property and some of its children.

This option decides whether the returned properties should be sorted from
children to parents, or the reverse.

```js
const target = { user: { name: 'Alice' } }
list(target, 'user.**') // [{ name: 'Alice' }, 'Alice']
list(target, 'user.**', { childFirst: true }) // ['Alice', { name: 'Alice' }]
```

### leaves

_Methods_: all except [`has()`](#hastarget-query-options)\
_Type_: `boolean`\
_Default_: `false`

When using [unions](#-unions) or [deep wildcards](#-wildcards), a query might
match both a property and some of its children.

When `true`, only leaves are matched. In other words, a matching property is
ignored if one of its children also matches.

```js
const target = { user: { name: 'Alice' } }
list(target, 'user.**') // [{ name: 'Alice' }, 'Alice']
list(target, 'user.**', { leaves: true }) // ['Alice']
```

### roots

_Methods_: [`get()`](#gettarget-query-options),
[`list()`](#listtarget-query-options),
[`iterate()`](#iteratetarget-query-options)\
_Type_: `boolean`\
_Default_: `false`

When using [unions](#-unions) or [deep wildcards](#-wildcards), a query might
match both a property and some of its children.

When `true`, only roots are matched. In other words, a matching property is
ignored if one of its parents also matches.

```js
const target = { user: { name: 'Alice' } }
list(target, 'user.**') // [{ name: 'Alice' }, 'Alice']
list(target, 'user.**', { roots: true }) // [{ name: 'Alice' }]
```

### shallowArrays

_Methods_: all\
_Type_: `boolean`\
_Default_: `false`

If `true`, [wildcards](#-wildcards) do not recurse on arrays. Array items can
still be matched by using [indices](#-arrays-indices) or
[slices](#%EF%B8%8F-array-slices).

```js
const target = [{ name: 'Alice' }, { name: 'Bob' }]
list(target, '**')
// [
//   [{ name: 'Alice' }, { name: 'Bob' }],
//   { name: 'Alice' },
//   'Alice',
//   { name: 'Bob' },
//   'Bob',
// ]
list(target, '**', { shallowArrays: true })
// [
//   [{ name: 'Alice' }, { name: 'Bob' }],
// ]
```

### classes

_Methods_: all\
_Type_: `boolean`\
_Default_: `false`

Unless `true`, [wildcards](#-wildcards) and [regexps](#%EF%B8%8F-regexps) ignore
properties of objects that are not plain objects (like class instances, errors
or functions). Those can still be matched by using their
[property name](#%EF%B8%8F-deep-properties).

```js
const target = { user: new User({ name: 'Alice' }) }
list(target, 'user.*') // []
list(target, 'user.*', { classes: true }) // ['Alice']
```

### inherited

_Methods_: all\
_Type_: `boolean`\
_Default_: `false`

By default, [wildcards](#-wildcards) and [regexps](#%EF%B8%8F-regexps) ignore
properties that are either
[inherited](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)
or
[not enumerable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Enumerability_and_ownership_of_properties).
Those can still be matched by using their
[property name](#%EF%B8%8F-deep-properties).

When `true`, inherited properties are not ignored, but not enumerable ones still
are.

# Related projects

- [`wild-wild-utils`](https://github.com/ehmicky/wild-wild-utils): functional
  utilities using `wild-wild-path`'s object property paths
- [`wild-wild-parser`](https://github.com/ehmicky/wild-wild-parser): parser for
  `wild-wild-path`'s object property paths

# Support

For any question, _don't hesitate_ to [submit an issue on GitHub](../../issues).

Everyone is welcome regardless of personal background. We enforce a
[Code of conduct](CODE_OF_CONDUCT.md) in order to promote a positive and
inclusive environment.

# Contributing

This project was made with ❤️. The simplest way to give back is by starring and
sharing it online.

If the documentation is unclear or has a typo, please click on the page's `Edit`
button (pencil icon) and suggest a correction.

If you would like to help us fix a bug or add a new feature, please check our
[guidelines](CONTRIBUTING.md). Pull requests are welcome!

<!-- Thanks go to our wonderful contributors: -->

<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center"><a href="https://fosstodon.org/@ehmicky"><img src="https://avatars2.githubusercontent.com/u/8136211?v=4?s=100" width="100px;" alt="ehmicky"/><br /><sub><b>ehmicky</b></sub></a><br /><a href="https://github.com/ehmicky/wild-wild-path/commits?author=ehmicky" title="Code">💻</a> <a href="#design-ehmicky" title="Design">🎨</a> <a href="#ideas-ehmicky" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/ehmicky/wild-wild-path/commits?author=ehmicky" title="Documentation">📖</a></td>
      <td align="center"><a href="https://sylvainsimao.fr"><img src="https://avatars.githubusercontent.com/u/4679377?v=4?s=100" width="100px;" alt="Sylvain"/><br /><sub><b>Sylvain</b></sub></a><br /><a href="#ideas-maoosi" title="Ideas, Planning, & Feedback">🤔</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
