import test from 'ava'
import { each } from 'test-each'
import { get } from 'wild-wild-path'

import { getChild } from './helpers/inherited.js'
import { testValidation } from './helpers/validate.js'

const child = getChild()

each(
  [
    // Main usage
    { input: [{ one: 1 }, 'one'], output: 1 },
    { input: [{ one: 1, two: 2 }, '*'], output: 1 },
    { input: [{ one: 1 }, 'two'], output: undefined },
    { input: [{ one: undefined }, 'one'], output: undefined },
    { input: [{ one: 1 }, [/one/u]], output: 1 },

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

    // `classes` and `inherited` options
    {
      input: [child, 'ownEnum ownNonEnum inheritedEnum inheritedNonEnum'],
      output: undefined,
    },
    { input: [child, 'ownEnum', { classes: true }], output: 'ownEnum' },
    { input: [child, 'ownNonEnum', { classes: true }], output: 'ownNonEnum' },
    {
      input: [child, 'inheritedEnum', { classes: true }],
      output: 'inheritedEnum',
    },
    {
      input: [child, 'inheritedNonEnum', { classes: true }],
      output: 'inheritedNonEnum',
    },
    { input: [child, '/inherited/', { classes: true }], output: undefined },
    {
      input: [child, '/inherited/', { classes: true, inherited: true }],
      output: 'inheritedEnum',
    },
  ],
  ({ title }, { input, output }) => {
    test(`get() output | ${title}`, (t) => {
      t.deepEqual(get(...input), output)
    })
  },
)

testValidation('get()', [get], [[{}, [true]]])
