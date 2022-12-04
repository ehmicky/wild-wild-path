import { testInherited } from './helpers/inherited.test.js'
import { testMutate } from './helpers/mutate.test.js'
import { testValidation } from './helpers/validate.test.js'

import { remove } from 'wild-wild-path'

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

  // `shallowArrays` option
  { input: [[0], '*'], output: [] },
  { input: [[0], '*', { shallowArrays: true }], output: [0] },
])

testInherited(methods, [
  // `classes` and `inherited` options
  { input: ['*'], output: {} },
  {
    input: ['*', { classes: true, mutate: true }],
    output: { ownEnum: undefined },
  },
  {
    input: ['*', { classes: true, inherited: true, mutate: true }],
    output: { ownEnum: undefined, inheritedEnum: undefined },
  },
])

testValidation(methods, [
  [{}, '.', { classes: true }],
  [{}, [true]],
])
