import test from 'ava'
import { each } from 'test-each'
import { remove } from 'wild-wild-path'

import { getChild, testChildProps } from './helpers/inherited.js'
import { testMutate } from './helpers/mutate.js'
import { testValidation } from './helpers/validate.js'

const methods = [{ name: 'remove', method: remove }]

testMutate(methods, [
  // Main usage
  { input: [{ one: 1 }, 'one'], output: {} },
  { input: [{ one: 1 }, 'two'], output: { one: 1 } },
  {
    input: [{ one: 1, two: 2, three: 3 }, 'two three'],
    output: { one: 1 },
  },
  { input: [{ one: { two: 1 } }, 'one one.two'], output: {} },
  { input: [[], '.'], output: undefined },
  { input: [[1], [0]], output: [] },

  // No changes
  { input: [[], '0'], output: [] },
  { input: [[], '100'], output: [] },
  { input: [[undefined], '0'], output: [undefined] },
  { input: [[1], '0'], output: [] },
  { input: [[1, 2], '0'], output: [undefined, 2] },
  { input: [[1, undefined], '0'], output: [] },
  { input: [{}, 'one'], output: {} },
  { input: [{ one: undefined }, 'one'], output: {} },
  { input: [{ one: 1 }, 'one'], output: {} },

  // Missing values
  { input: [{}, '0'], output: {} },
  { input: [{ one: {} }, 'one.0'], output: { one: {} } },
  { input: [[], 'two'], output: [] },
  { input: [{ one: [] }, 'one.two'], output: { one: [] } },

  // `leaves` option
  { input: [{ one: { two: 1 } }, 'one one.two'], output: {} },
  {
    input: [{ one: { two: 1 } }, 'one one.two'],
    opts: { leaves: true },
    output: { one: {} },
  },
])

each(
  [
    // `classes` and `inherited` options
    { input: [getChild(), '*'], output: {} },
    {
      input: [getChild(), '*', { classes: true, mutate: true }],
      output: { ownEnum: undefined },
    },
    {
      input: [
        getChild(),
        '*',
        { classes: true, inherited: true, mutate: true },
      ],
      output: { ownEnum: undefined, inheritedEnum: undefined },
    },
  ],
  ({ title }, { input, output }) => {
    test(`remove() output | ${title}`, (t) => {
      testChildProps(t, remove(...input), output)
    })
  },
)

testValidation(methods, [
  [{}, '.', { classes: true }],
  [{}, [true]],
])
