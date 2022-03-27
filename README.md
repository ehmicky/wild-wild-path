[![Codecov](https://img.shields.io/codecov/c/github/ehmicky/wild-wild-path.svg?label=tested&logo=codecov)](https://codecov.io/gh/ehmicky/wild-wild-path)
[![Build](https://github.com/ehmicky/wild-wild-path/workflows/Build/badge.svg)](https://github.com/ehmicky/wild-wild-path/actions)
[![Node](https://img.shields.io/node/v/wild-wild-path.svg?logo=node.js)](https://www.npmjs.com/package/wild-wild-path)
[![Twitter](https://img.shields.io/badge/%E2%80%8B-twitter-4cc61e.svg?logo=twitter)](https://twitter.com/intent/follow?screen_name=ehmicky)
[![Medium](https://img.shields.io/badge/%E2%80%8B-medium-4cc61e.svg?logo=medium)](https://medium.com/@ehmicky)

🤠 Object property paths with wildcards and regexps.

Get/set object properties using dot-delimited paths. Unlike similar libraries,
wildcards and regexps can be used.

# Examples

## get()

```js
const target = { settings: { colors: ['red', 'blue'] } }

get(target, 'settings.colors.0') // 'red'
get(target, ['settings', 'colors', 0]) // 'red'
```

## has()

```js
const target = { settings: { colors: ['red', 'blue'] } }

has(target, 'settings.name') // false
has(target, ['settings', 'name']) // false
```

## list()

<!-- eslint-disable require-unicode-regexp -->

```js
const target = {
  userOne: { firstName: 'John', lastName: 'Doe', age: 72 },
  userTwo: { firstName: 'Alice', colors: ['red', 'blue', 'yellow'] },
}

list(target, 'userOne.firstName userName.colors.0') // ['John', 'red']
list(target, [
  ['userOne', 'firstName'],
  ['userName', 'colors', 0],
]) // ['John', 'red']
list(target, 'userTwo.colors.*') // ['red', 'blue', 'yellow']
list(target, 'userTwo.colors.0:2') // ['red', 'blue']
list(target, 'userOne./Name/') // ['John', 'Doe']
list(target, ['userOne', /Name/]) // ['John', 'Doe']
list(target, '**.firstName') // ['John', 'Alice']
list(target, 'userOne.*', { entries: true })
// [
//   { value: 'John', path: ['firstName'], missing: false },
//   { value: 'Doe', path: ['lastName'], missing: false },
//   { value: 72, path: ['age'], missing: false },
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

## get(target, query, options?)

`target`: [`Target`](#target)\
`query`: [`Query`](#queries)\
`options`: [`Options`](#options)\
_Return value_: `any | undefined`

Return the first property matching the query.

If none matches, `undefined` is returned. To distinguish this with matching
properties which value is `undefined`, the [`entries`](#entries) option or the
[`has()`](#hastarget-query-options) method can be used.

## has(target, query, options?)

`target`: [`Target`](#target)\
`query`: [`Query`](#queries)\
`options`: [`Options`](#options)\
_Return value_: `boolean`

Return whether the query matches any property.

## list(target, query, options?)

`target`: [`Target`](#target)\
`query`: [`Query`](#queries)\
`options`: [`Options`](#options)\
_Return value_: `any[]`

Return all properties matching the query, as an array.

## iterate(target, query, options?)

`target`: [`Target`](#target)\
`query`: [`Query`](#queries)\
`options`: [`Options`](#options)\
_Return value_: [`Iterable<any>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#examples_using_the_iteration_protocols)

Return all properties matching the query, as an
[iterable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#examples_using_the_iteration_protocols).

This is slower than [`list()`](#listtarget-query-options) but it uses less
memory. Also, it is faster when only the first matching property is needed.

## set(target, query, value, options?)

`target`: [`Target`](#target)\
`query`: [`Query`](#queries)\
`value`: `any`\
`options`: [`Options`](#options)\
_Return value_: `Target`

Sets all properties matching the query.

## remove(target, query, options?)

`target`: [`Target`](#target)\
`query`: [`Query`](#queries)\
`options`: [`Options`](#options)\
_Return value_: `Target`

Delete all properties matching the query.

# Functional utilities

[`wild-wild-utils`](https://github.com/ehmicky/wild-wild-utils) is a separate
library which provides with additional, higher-level methods: `merge()`,
`push()`, `map()`, `find()`, `pick()`, `include()`, `exclude()`.

# Target

The target value must be an object or an array.

Queries can match object properties with `undefined` values providing they have
a key. Symbol properties are never matched.

# Queries

There are two equivalent formats for queries: strings and arrays.

- Query [strings](#query-strings) are friendlier to CLI usage, more expressive
  and easier to serialize.
- Query [arrays](#query-arrays) are friendlier to programmatic usage, faster,
  and do not require escaping. They should be used when the input is dynamic or
  user-provided to prevent injection attacks.

[`wild-wild-parser`](https://github.com/ehmicky/wild-wild-parser) can be used to
convert between both formats, or to compare queries.

## Query strings

### Deep properties

```bash
# Deep properties of objects or arrays.
# Dots are used for array indices, not brackets.
user.colors.0
```

### Unions

```bash
# Unions ("or") of queries are space-delimited.
# There must be at least one query.
colors name age
```

### Wildcards

```bash
# Shallow wildcards target all properties/items of a single object/array
user.*

# Deep wildcards target all properties/items of 0, 1 or many objects/arrays
user.**
**.colors
```

### Regexps

```bash
# Regexps are matched against property names
user./name/

# Flags can be used, e.g. to make it case-insensitive
user./name/i

# ^ $ must be used to match from the beginning or until the end
user./^name$/i
```

### Arrays indices and slices

```bash
# Array indices can be negative.
# -1 is the last item.
# -0 is the item after it, which can be used to append.
user.colors.-1

# Array slices. Goes from the start (included) to the end index (excluded).
user.colors.0:2

# The start index defaults to 0, i.e. the beginning
user.colors.:2

# The end index defaults to -0, i.e. the end
user.colors.0:
user.colors.:
```

### Escaping

```bash
# Dots, spaces and backslashes must be escaped
name\\ with\\ spaces
name\\.with\\.dots
name\\\\with\\\\backslashes

# Property names which could be interpreted as tokens must be escaped by
# using a backslash at the beginning. This includes properties that:
#  - Are integers, but are not array elements
#  - Have multiple slashes and start with one
name.\\0
name.\\/not_a_regexp/
```

### Root and empty strings

```bash
# A leading dot can optionally be used. It is ignored.
user.colors
.user.colors

# Root value
.

# Empty string properties like { user: { "": { colors: [] } } }
user..colors
```

## Query arrays

## Paths

A "path" is any [query](#queries) using only property names and array positive
indices. This excludes negative indices, slices, wildcards and regexps.

Those are returned by the [`entries`](#entries) option.

```bash
# Path string
user.colors.0
```

<!-- prettier-ignore -->
```es6
// Path array
['user', 'colors', 0]
```

# Options

Options are plain objects.

## mutate

_Methods_: [`set()`](#settarget-query-value-options),
[`remove()`](#removetarget-query-options)\
_Type_: `boolean`\
_Default_: `false`

By default, the [target](#target) is deeply cloned.\
When `true`, it is directly mutated instead, which is faster.

## entries

_Methods_: [`get()`](#gettarget-query-options),
[`list()`](#listtarget-query-options),
[`iterate()`](#iteratetarget-query-options)\
_Methods_: _Type_: `boolean`\
_Default_: `false`

Instead of being only the matching value, the return value becomes an object
with the following properties:

- `value` `any`
- `path` [`Path`](#path): property path
- `missing` `boolean`: whether the property is defined in the [target](#target)

## missing

_Methods_: [`list()`](#listtarget-query-options),
[`iterate()`](#iteratetarget-query-options),
[`set()`](#settarget-query-value-options)\
_Methods_: _Type_: `boolean`\
_Default_: `false` with `list|iterate()`, `true` with `set()`

When `false`, properties not defined in the target are ignored.

Please note that a property with a key and an `undefined` value is always
considered defined, i.e. it is never ignored nor considered missing.

## sort

_Methods_: [`get()`](#gettarget-query-options),
[`list()`](#listtarget-query-options),
[`iterate()`](#iteratetarget-query-options)\
_Methods_: _Type_: `boolean`\
_Default_: `false`

When returning sibling object properties, sort them in lexigographic order.

## childFirst

_Methods_: [`get()`](#gettarget-query-options),
[`list()`](#listtarget-query-options),
[`iterate()`](#iteratetarget-query-options)\
_Methods_: _Type_: `boolean`\
_Default_: `false`

When using [unions](#unions) or [deep wildcards](#wildcards), a query might
match both a property and some of its children.

This option decides whether the returned properties should be sorted from
children to parents, or the reverse.

## leaves

_Methods_: [`get()`](#gettarget-query-options),
[`list()`](#listtarget-query-options),
[`iterate()`](#iteratetarget-query-options),
[`set()`](#settarget-query-value-options),
[`remove()`](#removetarget-query-options)\
_Methods_: _Type_: `boolean`\
_Default_: `false`

When using [unions](#unions) or [deep wildcards](#wildcards), a query might
match both a property and some of its children.

When `true`, only leaves are used. In other words, a property is ignored if it
matches but one of its children also matches.

## roots

_Methods_: [`get()`](#gettarget-query-options),
[`list()`](#listtarget-query-options),
[`iterate()`](#iteratetarget-query-options)\
_Methods_: _Type_: `boolean`\
_Default_: `false`

When using [unions](#unions) or [deep wildcards](#wildcards), a query might
match both a property and some of its children.

When `true`, only roots are used. In other words, a property is ignored if it
matches but one of its parents also matches.

## classes

_Methods_: [`get()`](#gettarget-query-options),
[`has()`](#hastarget-query-options), [`list()`](#listtarget-query-options),
[`iterate()`](#iteratetarget-query-options),
[`set()`](#settarget-query-value-options),
[`remove()`](#removetarget-query-options)\
_Methods_: _Type_: `boolean`\
_Default_: `false`

By default, only arrays and plain objects can be parent properties.\
When `true`, any object can be a parent property, including class instances, `Error`,
functions, etc.

## inherited

_Methods_: [`get()`](#gettarget-query-options),
[`has()`](#hastarget-query-options), [`list()`](#listtarget-query-options),
[`iterate()`](#iteratetarget-query-options),
[`set()`](#settarget-query-value-options),
[`remove()`](#removetarget-query-options)\
_Type_: `boolean`\
_Default_: `false`

By default (`false`), [wildcards](#wildcards) and [regexps](#regexps) ignore
properties that are either non-enumerable or inherited. Those can still be
matched by using their property name.

When `true`, inherited properties are not ignored, but non-enumerable still are.

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
