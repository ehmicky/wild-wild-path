import test from 'ava'
import { each } from 'test-each'
import { set } from 'wild-wild-path'

import { getChild, testChildProps } from './helpers/inherited.js'
import { testMutate } from './helpers/mutate.js'
import { testValidation } from './helpers/validate.js'

testMutate('set()', set, [
  // Main usage
  { input: [{ one: 1 }, 'one', 2], output: { one: 2 } },
  { input: [{ one: 1 }, 'two', 2], output: { one: 1, two: 2 } },
  {
    input: [{ one: 1 }, 'two three', 2],
    output: { one: 1, two: 2, three: 2 },
  },
  { input: [{ one: {} }, 'one.two', 2], output: { one: { two: 2 } } },
  { input: [[1, 2], '-0', 3], output: [1, 2, 3] },
  { input: [[1, 2], '3', 3], output: [1, 2, undefined, 3] },
  { input: [[], [0], 1], output: [1] },

  // No changes
  { input: [[], '0', undefined], output: [undefined] },
  { input: [[], '0', 1], output: [1] },
  { input: [[undefined], '0', undefined], output: [undefined] },
  { input: [[1], '0', 1], output: [1] },
  { input: [{}, 'one', undefined], output: { one: undefined } },
  { input: [{}, 'one', 1], output: { one: 1 } },
  { input: [{ one: undefined }, 'one', undefined], output: { one: undefined } },
  { input: [{ one: 1 }, 'one', 1], output: { one: 1 } },

  // `missing` option
  { input: [{}, 'one', 1], output: { one: 1 } },
  {
    input: [{ two: 2 }, 'one two', 1],
    opts: { missing: false },
    output: { two: 1 },
  },
  { input: [{}, 'one.two', 1], output: { one: { two: 1 } } },
  { input: [[], '0.0', 1], output: [[1]] },
  { input: [{}, '0', 1], output: [1] },
  { input: [{ one: {} }, 'one.0', 1], output: { one: [1] } },
  { input: [[], 'two', 1], output: { two: 1 } },
  { input: [{ one: [] }, 'one.two', 1], output: { one: { two: 1 } } },

  // `leaves` option
  { input: [{ one: { two: 1 } }, 'one one.two', 2], output: { one: 2 } },
  {
    input: [{ one: { two: 1 } }, 'one one.two', 2],
    opts: { leaves: true },
    output: { one: { two: 2 } },
  },
])

each(
  [
    // `classes` and `inherited` options
    { input: [getChild(), '*', 2], output: {} },
    {
      input: [getChild(), '*', 2, { classes: true, mutate: true }],
      output: { ownEnum: 2 },
    },
    {
      input: [
        getChild(),
        '*',
        2,
        { classes: true, inherited: true, mutate: true },
      ],
      output: { ownEnum: 2, inheritedEnum: 2 },
    },
  ],
  ({ title }, { input, output }) => {
    test(`set() output | ${title}`, (t) => {
      testChildProps(t, set(...input), output)
    })
  },
)

testValidation(
  'set()',
  [set],
  [
    [{}, '.', undefined, { classes: true }],
    [{}, [true]],
  ],
)
