import test from 'ava'
import { get, list, iterate } from 'wild-wild-path'

import { getChild } from '../helpers/inherited.test.js'
import { testListOutput, testListValidation } from '../helpers/list.test.js'
import { testOutput } from '../helpers/output.test.js'
import { testValidation } from '../helpers/validate.test.js'

test('iterate() returns an iterator', (t) => {
  t.is(iterate(1, '.').next().value, 1)
})

test('list() returns an array', (t) => {
  t.deepEqual(list(1, '.'), [1])
})

testListOutput([
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

testListValidation([
  [{}, '.', { inherited: true, classes: false }],
  [{}, '.', { missing: true, entries: false }],
  [{}, '.', { roots: true, leaves: true }],
  [{}, true],
  [{}, [[true]]],
  [{}, 'a\\b'],
  [{}, '/[/'],
])

const child = getChild()

testOutput(
  [{ name: 'get', method: get }],
  [
    // Main usage
    { input: [{ one: 1 }, 'one'], output: 1 },
    { input: [{ one: 1, two: 2 }, '*'], output: 1 },
    { input: [{ one: 1 }, 'two'], output: undefined },
    { input: [{ one: undefined }, 'one'], output: undefined },
    { input: [{ one: 1 }, [/one/u]], output: 1 },

    // `missing` option
    { input: [{}, 'one'], output: undefined },
    { input: [{}, 'one', { entries: true }], output: undefined },
    {
      input: [{}, 'one', { missing: true, entries: true }],
      output: { value: undefined, path: ['one'], missing: true },
    },
    { input: [{ one: undefined }, 'one'], output: undefined },
    {
      input: [{ one: undefined }, 'one', { missing: true, entries: true }],
      output: { value: undefined, path: ['one'], missing: false },
    },
    {
      input: [[], 'two', { missing: true, entries: true }],
      output: { value: undefined, path: ['two'], missing: true },
    },

    // `entries` option
    { input: [{ one: 1 }, 'two', { entries: true }], output: undefined },
    {
      input: [{ one: 1 }, 'one', { entries: true }],
      output: { value: 1, path: ['one'], missing: false },
    },

    // `childFirst`, `leaves` and `roots` options
    { input: [{ one: { two: 2 } }, 'one one.two'], output: { two: 2 } },
    {
      input: [{ one: { two: 2 } }, 'one one.two', { childFirst: true }],
      output: 2,
    },
    {
      input: [{ one: { two: 2 } }, 'one one.two', { leaves: true }],
      output: 2,
    },
    {
      input: [
        { one: { two: 2 } },
        'one one.two',
        { roots: true, childFirst: true },
      ],
      output: { two: 2 },
    },

    // `sort` option
    { input: [{ two: 2, one: 1 }, 'two one'], output: 2 },
    { input: [{ two: 2, one: 1 }, 'two one', { sort: true }], output: 1 },

    // `shallowArrays` option
    { input: [[0], '*'], output: 0 },
    { input: [[0], '*', { shallowArrays: true }], output: undefined },

    // `classes` and `inherited` options
    { input: [child, 'ownEnum'], output: 'ownEnum' },
    { input: [child, 'ownNonEnum'], output: 'ownNonEnum' },
    { input: [child, 'inheritedEnum'], output: 'inheritedEnum' },
    { input: [child, 'inheritedNonEnum'], output: 'inheritedNonEnum' },
    {
      input: [
        child,
        '/ownEnum/ /ownNonEnum/ /inheritedEnum/ /inheritedNonEnum/',
      ],
      output: undefined,
    },
    { input: [child, '/ownEnum/', { classes: true }], output: 'ownEnum' },
    { input: [child, '/ownNonEnum/', { classes: true }], output: undefined },
    { input: [child, '/inheritedEnum/', { classes: true }], output: undefined },
    {
      input: [child, '/inheritedNonEnum/', { classes: true }],
      output: undefined,
    },
    {
      input: [child, '/inheritedEnum/', { classes: true, inherited: true }],
      output: 'inheritedEnum',
    },
    {
      input: [child, '/inheritedNonEnum/', { classes: true, inherited: true }],
      output: undefined,
    },
  ],
)

testValidation([{ name: 'get', method: get }], [[{}, [true]]])
