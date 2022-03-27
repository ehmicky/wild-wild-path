[![Codecov](https://img.shields.io/codecov/c/github/ehmicky/wild-wild-path.svg?label=tested&logo=codecov)](https://codecov.io/gh/ehmicky/wild-wild-path)
[![Build](https://github.com/ehmicky/wild-wild-path/workflows/Build/badge.svg)](https://github.com/ehmicky/wild-wild-path/actions)
[![Node](https://img.shields.io/node/v/wild-wild-path.svg?logo=node.js)](https://www.npmjs.com/package/wild-wild-path)
[![Twitter](https://img.shields.io/badge/%E2%80%8B-twitter-4cc61e.svg?logo=twitter)](https://twitter.com/intent/follow?screen_name=ehmicky)
[![Medium](https://img.shields.io/badge/%E2%80%8B-medium-4cc61e.svg?logo=medium)](https://medium.com/@ehmicky)

🤠 Object property paths with wildcards and regexps.

Get/set object properties using [dot-delimited paths](#deep-properties). Unlike
similar libraries, [wildcards](#wildcards), [regexps](#regexps),
[slices](#array-slices) and [unions](#unions) can be used.

# Examples

## get()

```js
const target = { settings: { colors: ['red', 'blue'] } }

get(target, 'settings.colors.0') // 'red'
get(target, ['settings', 'colors', 0]) // 'red'
```

## has()

```js
const target = { settings: { lastName: undefined, colors: ['red', 'blue'] } }

has(target, 'settings.firstName') // false
has(target, ['settings', 'firstName']) // false
has(target, 'settings.lastName') // true
```

## list()

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
list(target, 'userTwo.colors.*') // ['red', 'blue', 'yellow']
list(target, 'userTwo.colors.0:2') // ['red', 'blue']
list(target, 'userOne./Name/') // ['John', 'Doe']
list(target, ['userOne', /Name/]) // ['John', 'Doe']
list(target, '**.firstName') // ['John', 'Alice']
list(target, 'userOne.*', { entries: true })
// [
//   { value: 'John', path: ['userOne', 'firstName'], missing: false },
//   { value: 'Doe', path: ['userOne', 'lastName'], missing: false },
//   { value: 72, path: ['userOne', 'age'], missing: false },
// ]
```

## iterate()

<!-- eslint-disable fp/no-loops -->

```js
const target = { settings: { colors: ['red', 'blue'] } }

for (const color of iterate(target, 'settings.colors.*')) {
  console.log(color) // 'red', 'blue'
}
```

## set()

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

## remove()

<!-- eslint-disable require-unicode-regexp -->

```js
const target = { user: { firstName: 'John', lastName: 'Doe', age: 72 } }

remove(target, 'user.lastName') // { user: { firstName: 'John', age: 72 } }
remove(target, 'user./Name/') // { user: { age: 72 } }
remove(target, ['user', /Name/]) // { user: { age: 72 } }
```

<!--

# Demo

You can try this library:

- either directly [in your browser](https://repl.it/@ehmicky/wild-wild-path).
- or by executing the [`examples` files](examples/README.md) in a terminal.

-->

# Install

```bash
npm install wild-wild-path
```

This package is an ES module and must be loaded using
[an `import` or `import()` statement](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c),
not `require()`.

# API

## Methods

### get(target, query, options?)

`target`: [`Target`](#target)\
`query`: [`Query`](#queries)\
`options`: [`Options?`](#options)\
_Return value_: `any | undefined`

Return the first property matching the query.

### has(target, query, options?)

`target`: [`Target`](#target)\
`query`: [`Query`](#queries)\
`options`: [`Options?`](#options)\
_Return value_: `boolean`

Return whether the query matches any property.

### list(target, query, options?)

`target`: [`Target`](#target)\
`query`: [`Query`](#queries)\
`options`: [`Options?`](#options)\
_Return value_: `any[]`

Return all properties matching the query, as an array.

### iterate(target, query, options?)

`target`: [`Target`](#target)\
`query`: [`Query`](#queries)\
`options`: [`Options?`](#options)\
_Return value_: [`Iterable<any>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#examples_using_the_iteration_protocols)

Return all properties matching the query, as an
[iterable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#examples_using_the_iteration_protocols).
This is slower than [`list()`](#listtarget-query-options) but uses less memory.

### set(target, query, value, options?)

`target`: [`Target`](#target)\
`query`: [`Query`](#queries)\
`value`: `any`\
`options`: [`Options?`](#options)\
_Return value_: `Target`

Sets all properties matching the query. A deep clone is returned unless the
[mutate](#mutate) option is used.

### remove(target, query, options?)

`target`: [`Target`](#target)\
`query`: [`Query`](#queries)\
`options`: [`Options?`](#options)\
_Return value_: `Target`

Delete all properties matching the query. A deep clone is returned unless the
[mutate](#mutate) option is used.

## Functional utilities

[`wild-wild-utils`](https://github.com/ehmicky/wild-wild-utils) is a separate
library which provides with additional, higher-level methods: `merge()`,
`push()`, `map()`, `find()`, `pick()`, `include()`, `exclude()`.

## Target

The target value must be an object or an array.

### Undefined values

Object properties with a defined key but an `undefined` value are not ignored.
However, object properties without any defined key are ignored. The
[`has()`](#hastarget-query-options) method, [`missing`](#missing) option and
[`entries`](#entries) option are useful to distinguish those.

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
// { value: undefined, path: ['name'], missing: false }
```

### Symbols

Symbol properties are always ignored.

## Queries

There are two equivalent formats for queries: strings and arrays.

- Query [strings](#query-strings) are friendlier to CLI usage, more expressive,
  and easier to serialize.
- Query [arrays](#query-arrays) are friendlier to programmatic usage, and
  faster. Also, they do not require escaping, so they should be used when the
  input is dynamic or user-provided to prevent injection attacks.

[`wild-wild-parser`](https://github.com/ehmicky/wild-wild-parser) can be used to
convert between both formats, or to compare queries.

### Query strings

#### Deep properties

```bash
# Deep properties of objects or arrays.
# Dots are used for array indices, not brackets.
user.colors.0
```

#### Unions

```bash
# Unions ("or") of queries are space-delimited.
# The string must not be empty.
colors name age
```

#### Wildcards

```bash
# Shallow wildcards target all properties/items of a single object/array
user.*

# Deep wildcards target all properties/items of 0, 1 or many objects/arrays
user.**
**.colors
```

#### Regexps

```bash
# Regexps match property names
user./name/

# Flags can be used, e.g. to make it case-insensitive
user./name/i

# ^ $ must be used to match from the beginning or until the end
user./^name$/i
```

#### Arrays indices

```bash
# Array indices are integers
user.colors.0

# Array indices can be negative.
# -1 is the last item.
# -0 is the item after it, which can be used to append.
user.colors.-1
```

#### Array slices

```bash
# Array slices. Goes from the start (included) to the end index (excluded).
user.colors.0:2

# The start index defaults to 0, i.e. the beginning
user.colors.:2

# The end index defaults to -0, i.e. the end
user.colors.0:
user.colors.:
```

#### Escaping

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

#### Root and empty strings

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

#### Deep properties

<!-- prettier-ignore -->
```es6
// Deep properties of objects or arrays.
['user', 'colors', 0]
```

#### Unions

<!-- prettier-ignore -->
```es6
// Unions ("or") of queries are arrays of arrays.
// There must be at least one item.
[['colors'], ['name'], ['age']]
```

#### Wildcards

<!-- prettier-ignore -->
```es6
// Shallow wildcards target all properties/items of a single object/array
['user', { type: 'any' }]

// Deep wildcards target all properties/items of 0, 1 or many objects/arrays
['user', { type: 'anyDeep' }]
[{ type: 'anyDeep' }, 'colors']
```

#### Regexps

<!-- prettier-ignore -->
```es6
// Regexps match property names
['user', /name/]

// Flags can be used, e.g. to make it case-insensitive
['user', /name/i]

// ^ $ must be used to match from the beginning or until the end
['user', /^name$/i]
```

#### Arrays indices

<!-- prettier-ignore -->
```es6
// Array indices are integers, not strings
['user', 'colors', 0]

// Array indices can be negative.
// -1 is the last item.
// -0 is the item after it, which can be used to append.
['user', 'colors', -1]
```

#### Array slices

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

#### Escaping

<!-- prettier-ignore -->
```es6
// Escaping is not necessary with query arrays
['name with spaces']
['name.with.dots']
['name\\with\\backslashes']
['name', '0']
['name', '/not_a_regexp/']
```

#### Root and empty strings

<!-- prettier-ignore -->
```es6
// Root value
[]

// Empty string properties
['user', '', 'colors']
```

### Paths

A "path" is any [query](#queries) using only [property names](#deep-properties)
and positive [array indices](#arrays-indices). This excludes
[negative indices](#arrays-indices), [slices](#array-slices),
[wildcards](#wildcards), [regexps](#regexps) and [unions](#unions).

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

## Options

Options are optional plain objects.

### mutate

_Methods_: [`set()`](#settarget-query-value-options),
[`remove()`](#removetarget-query-options)\
_Type_: `boolean`\
_Default_: `false`

By default, the [target](#target) is deeply cloned.\
When `true`, it is directly mutated instead, which is faster but has side effects.

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

By default, only matching values are returned.\
When `true`, objects with the following properties are returned instead:

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

_Methods_: [`get()`](#gettarget-query-options),
[`list()`](#listtarget-query-options),
[`iterate()`](#iteratetarget-query-options),
[`set()`](#settarget-query-value-options)\
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

When using [unions](#unions) or [deep wildcards](#wildcards), a query might
match both a property and some of its children.

This option decides whether the returned properties should be sorted from
children to parents, or the reverse.

```js
const target = { user: { name: 'Alice' } }
list(target, 'user.**') // [{ name: 'Alice' }, 'Alice']
list(target, 'user.**', { childFirst: true }) // ['Alice', { name: 'Alice' }]
```

### leaves

_Methods_: [`get()`](#gettarget-query-options),
[`list()`](#listtarget-query-options),
[`iterate()`](#iteratetarget-query-options),
[`set()`](#settarget-query-value-options),
[`remove()`](#removetarget-query-options)\
_Type_: `boolean`\
_Default_: `false`

When using [unions](#unions) or [deep wildcards](#wildcards), a query might
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

When using [unions](#unions) or [deep wildcards](#wildcards), a query might
match both a property and some of its children.

When `true`, only roots are matched. In other words, a matching property is
ignored if one of its parents also matches.

```js
const target = { user: { name: 'Alice' } }
list(target, 'user.**') // [{ name: 'Alice' }, 'Alice']
list(target, 'user.**', { roots: true }) // [{ name: 'Alice' }]
```

### classes

_Methods_: [`get()`](#gettarget-query-options),
[`has()`](#hastarget-query-options), [`list()`](#listtarget-query-options),
[`iterate()`](#iteratetarget-query-options),
[`set()`](#settarget-query-value-options),
[`remove()`](#removetarget-query-options)\
_Type_: `boolean`\
_Default_: `false`

Unless `true`, child properties of objects that are not plain objects (like
class instances, errors or functions) are ignored.

```js
const target = { user: new User({ name: 'Alice' }) }
list(target, 'user.*') // []
list(target, 'user.*', { classes: true }) // ['Alice']
```

### inherited

_Methods_: [`get()`](#gettarget-query-options),
[`has()`](#hastarget-query-options), [`list()`](#listtarget-query-options),
[`iterate()`](#iteratetarget-query-options),
[`set()`](#settarget-query-value-options),
[`remove()`](#removetarget-query-options)\
_Type_: `boolean`\
_Default_: `false`

By default, [wildcards](#wildcards) and [regexps](#regexps) ignore properties
that are either inherited or not enumerable. Those can still be matched by using
their [property name](#deep-properties).

When `true`, inherited properties are not ignored, but not enumerable ones still
are.

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
<!-- prettier-ignore -->
<!--
<table><tr><td align="center"><a href="https://twitter.com/ehmicky"><img src="https://avatars2.githubusercontent.com/u/8136211?v=4" width="100px;" alt="ehmicky"/><br /><sub><b>ehmicky</b></sub></a><br /><a href="https://github.com/ehmicky/wild-wild-path/commits?author=ehmicky" title="Code">💻</a> <a href="#design-ehmicky" title="Design">🎨</a> <a href="#ideas-ehmicky" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/ehmicky/wild-wild-path/commits?author=ehmicky" title="Documentation">📖</a></td></tr></table>
 -->
<!-- ALL-CONTRIBUTORS-LIST:END -->
