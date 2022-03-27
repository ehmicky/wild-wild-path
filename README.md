[![Codecov](https://img.shields.io/codecov/c/github/ehmicky/wild-wild-path.svg?label=tested&logo=codecov)](https://codecov.io/gh/ehmicky/wild-wild-path)
[![Build](https://github.com/ehmicky/wild-wild-path/workflows/Build/badge.svg)](https://github.com/ehmicky/wild-wild-path/actions)
[![Node](https://img.shields.io/node/v/wild-wild-path.svg?logo=node.js)](https://www.npmjs.com/package/wild-wild-path)
[![Twitter](https://img.shields.io/badge/%E2%80%8B-twitter-4cc61e.svg?logo=twitter)](https://twitter.com/intent/follow?screen_name=ehmicky)
[![Medium](https://img.shields.io/badge/%E2%80%8B-medium-4cc61e.svg?logo=medium)](https://medium.com/@ehmicky)

🤠 Object property paths with wildcards and regexps.

Get/set object properties using dot-delimited paths. Unlike similar libraries,
wildcards and regular expressions can be used.

# Examples

<!-- eslint-disable fp/no-loops -->

```js
import { get, set, remove, has, list, iterate } from 'wild-wild-path'

get({ settings: { colors: ['red', 'blue'] } }, 'settings.colors.0')
// 'red'
has({ settings: { colors: ['red', 'blue'] } }, 'settings.name')
// false

list({ colors: ['red', 'blue'] }, 'colors.*')
// ['red', 'blue']
list({ colors: ['red', 'blue', 'yellow'] }, 'colors.0:2')
// ['red', 'blue']
list({ user: { name: 'John' }, color: 'red' }, '**', { leaves: true })
// ['John', 'red']
list({ user: { name: 'John' }, color: 'red' }, 'user.**')
// [{ name: 'John' }, 'John']
list({ user: { name: 'John' }, color: 'red' }, 'user.**', { childFirst: true })
// ['John', { name: 'John' }]
list({ user: { name: 'John' }, color: 'red' }, 'user.**', { roots: true })
// [{ name: 'John' }]
list({ user: { firstName: 'John', lastName: 'Doe', age: 72 } }, 'user./Name/')
// ['John', 'Doe']

set({ colors: ['red', 'blue'] }, 'colors.0', 'yellow')
// ['yellow', 'blue']
set({ colors: ['red', 'blue'] }, 'colors.-1', 'yellow')
// ['red', 'yellow']
set({ colors: ['red', 'blue'] }, 'colors.-0', 'yellow')
// ['red', 'blue', 'yellow']
set({ colors: ['red', 'blue'] }, 'colors.*', 'yellow')
// ['yellow', 'yellow']
remove({ user: { firstName: 'John', lastName: 'Doe' } }, 'user.lastName')
// { user: { firstName: 'John' } }
remove({ user: { firstName: 'John', lastName: 'Doe', age: 72 } }, 'user./Name/')
// { user: { age: 72 } }

for (const color of iterate({ settings: { colors: ['red', 'blue'] } })) {
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
<!-- prettier-ignopermissionsre -->
<!--
<table><tr><td align="center"><a href="https://twitter.com/ehmicky"><img src="https://avatars2.githubusercontent.com/u/8136211?v=4" width="100px;" alt="ehmicky"/><br /><sub><b>ehmicky</b></sub></a><br /><a href="https://github.com/ehmicky/wild-wild-path/commits?author=ehmicky" title="Code">💻</a> <a href="#design-ehmicky" title="Design">🎨</a> <a href="#ideas-ehmicky" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/ehmicky/wild-wild-path/commits?author=ehmicky" title="Documentation">📖</a></td></tr></table>
 -->
<!-- ALL-CONTRIBUTORS-LIST:END -->
