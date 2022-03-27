[![Codecov](https://img.shields.io/codecov/c/github/ehmicky/wild-wild-path.svg?label=tested&logo=codecov)](https://codecov.io/gh/ehmicky/wild-wild-path)
[![Build](https://github.com/ehmicky/wild-wild-path/workflows/Build/badge.svg)](https://github.com/ehmicky/wild-wild-path/actions)
[![Node](https://img.shields.io/node/v/wild-wild-path.svg?logo=node.js)](https://www.npmjs.com/package/wild-wild-path)
[![Twitter](https://img.shields.io/badge/%E2%80%8B-twitter-4cc61e.svg?logo=twitter)](https://twitter.com/intent/follow?screen_name=ehmicky)
[![Medium](https://img.shields.io/badge/%E2%80%8B-medium-4cc61e.svg?logo=medium)](https://medium.com/@ehmicky)

🤠 Object property paths with wildcards and regexps.

Get/set object properties using dot-delimited paths. Unlike similar libraries,
wildcards and regular expressions can be used.

# Examples

## get()

```js
get({ settings: { colors: ['red', 'blue'] } }, 'settings.colors.0')
// 'red'
```

## has()

```js
has({ settings: { colors: ['red', 'blue'] } }, 'settings.name')
// false
```

## list()

```js
list({ user: { name: 'John' }, color: 'red' }, 'user.name color')
// ['John', 'red']

list({ colors: ['red', 'blue'] }, 'colors.*')
// ['red', 'blue']

list({ colors: ['red', 'blue', 'yellow'] }, 'colors.0:2')
// ['red', 'blue']

list({ user: { firstName: 'John', lastName: 'Doe', age: 72 } }, 'user./Name/')
// ['John', 'Doe']

list({ userOne: { name: 'John' }, userTwo: { name: 'Alice' } }, '**.name')
// ['John', 'Alice']

list({ firstName: 'John', lastName: 'Doe', age: 72 }, 'user.*', {
  entries: true,
})
// [
//   { value: 'John', path: ['firstName'], missing: false },
//   { value: 'Doe', path: ['lastName'], missing: false },
//   { value: 72, path: ['age'], missing: false },
// ]
```

## set()

```js
set({ colors: ['red', 'blue'] }, 'colors.0', 'yellow')
// ['yellow', 'blue']

set({ colors: ['red', 'blue'] }, 'colors.-1', 'yellow')
// ['red', 'yellow']

set({ colors: ['red', 'blue'] }, 'colors.-0', 'yellow')
// ['red', 'blue', 'yellow']

set({ colors: ['red', 'blue'] }, 'colors.*', 'yellow')
// ['yellow', 'yellow']

set({}, 'user.0.color', 'red')
// { user: [{ color: 'red' }] }

set({}, 'user.0.color', 'red', { missing: false })
// {}
```

## remove()

```js
remove({ user: { firstName: 'John', lastName: 'Doe' } }, 'user.lastName')
// { user: { firstName: 'John' } }

remove({ user: { firstName: 'John', lastName: 'Doe', age: 72 } }, 'user./Name/')
// { user: { age: 72 } }
```

## iterate()

<!-- eslint-disable fp/no-loops -->

```js
for (const color of iterate({ settings: { colors: ['red', 'blue'] } })) {
  console.log(color)
}
// 'red', 'blue'
```

# Demo

You can try this library:

- either directly [in your browser](https://repl.it/@ehmicky/wild-wild-path).
- or by executing the [`examples` files](examples/README.md) in a terminal.

# Install

```bash
npm install wild-wild-path
```

This package is an ES module and must be loaded using
[an `import` or `import()` statement](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c),
not `require()`.

# Queries

Queries have two available formats: [string](#query-strings) or
[array](#query-arrays).

## Query strings

Query strings are more expressive and easier to serialize than
[query arrays](#query-arrays).

```bash
# Deep properties of objects or arrays.
# Dots are used for array indices, not brackets.
user.colors.0

# Unions ("or") of queries are space-delimited
colors name age

# Shallow wildcards target all properties/items of a single object/array
user.*
# Deep wildcards target all properties/items of 0, 1 or many objects/arrays
user.**
**.name

# Regular expressions are matched against property names
user./name/
# Flags can be used, e.g. to make it case-insensitive
user./name/i
# ^ $ must be used to match from the beginning and end
user./^name$/i

# Indices can be negative.
# -1 is the last item.
# -0 is the item after it, which can be used to append.
colors.-1
# Array slices. Goes from the start (included) to the end index (excluded).
user.colors.0:2
# The start index defaults to 0, i.e. the beginning.
user.colors.:2
# The end index defaults to -0, i.e. the end.
user.colors.0:
user.colors.:

# Dots, spaces and backslashes must be escaped
name\\ with\\ spaces
name\\.with\\.dots
name\\\\with\\\\backslashes
# Property names which could be interpreted as tokens must be escaped by
# using a backslashes at the beginning. This includes:
#  - Properties that are integers, but are not array elements
name.\\0
#  - Properties that have multiple slashes and start with one
name.\\/not_a_regexp/

# A leading dot can optionally be used
name
.name
# Root value
.
# Empty string properties like { user: { "": { settings: {} } } }
user..settings
```

## Query arrays

Query arrays are friendlier to programmatic usage than
[query strings](#query-strings). Also, they do not require escaping. They should
be used when the input is dynamic or user-provided to prevent injection attacks.

Query strings and arrays are otherwise equivalent to each other.

```js

```

## Paths

A "path" is any [query](#queries) using only property names and array positive
indices. This excludes negative indices, slices, wildcards and regular
expressions.

# Usage

```js

```

# API

## exampleMethod

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
