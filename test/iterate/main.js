import test from 'ava'
import { each } from 'test-each'
import { list, iterate } from 'wild-wild-path'

import { listMethods, testListIterate } from '../helpers/list.js'

test('iterate() returns an iterator', (t) => {
  t.is(iterate(1, '.').next().value, 1)
})

test('list() returns an array', (t) => {
  t.deepEqual(list(1, '.'), [1])
})

testListIterate([
  // Root query
  { input: [1, '.'], output: [1] },
  { input: [1, []], output: [1] },
  { input: [1, [[]]], output: [1] },
  {
    input: [{}, '.', { entries: true }],
    output: [{ value: {}, path: [], missing: false }],
  },

  // Deep query
  { input: [{ one: { two: 1 } }, 'one.two'], output: [1] },
  { input: [{ one: { two: 1 } }, ['one', 'two']], output: [1] },

  // Unions
  { input: [{ one: 1, two: 2, three: 3 }, 'one two'], output: [1, 2] },
  { input: [{ one: 1, two: 2, three: 3 }, [['one'], ['two']]], output: [1, 2] },
  { input: [{ one: 1 }, 'one one'], output: [1] },
  { input: [{ one: { two: 2 } }, '*.two one.two'], output: [2] },
  {
    input: [{ one: { two: { three: 1 } } }, '*.two one.two.three'],
    output: [{ three: 1 }, 1],
  },

  // Forbidden properties
  { input: [{ __proto__: {} }, '__proto__'], output: [] },
  { input: [{ prototype: {} }, 'prototype'], output: [] },
  { input: [{ constructor() {} }, 'constructor'], output: [] },
])

each(
  listMethods,
  [
    [{}, '.', { inherited: true, classes: false }],
    [{}, '.', { missing: true, entries: false }],
    [{}, '.', { roots: true, leaves: true }],
    [{}, true],
    [{}, [[true]]],
    [{}, 'a\\b'],
    [{}, '/[/'],
  ],
  ({ title }, listFunc, input) => {
    test(`list|iterate() validates its input | ${title}`, (t) => {
      t.throws(listFunc.bind(undefined, ...input))
    })
  },
)
