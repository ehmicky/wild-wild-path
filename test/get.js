import { get } from 'wild-wild-path'

import { getChild } from './helpers/inherited.js'
import { testOutput } from './helpers/output.js'
import { testValidation } from './helpers/validate.js'

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
