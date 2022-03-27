import { testListOutput } from '../helpers/list.js'
import { missingOpts } from '../helpers/options.js'

testListOutput([
  {
    input: [{ one: 1 }, 'one two', missingOpts],
    output: [
      { value: 1, path: ['one'], missing: false },
      { value: undefined, path: ['two'], missing: true },
    ],
  },
  {
    input: [{}, 'one', missingOpts],
    output: [{ value: undefined, path: ['one'], missing: true }],
  },
  { input: [{ one: undefined }, 'one'], output: [undefined] },
  {
    input: [{ one: undefined }, 'one', missingOpts],
    output: [{ value: undefined, path: ['one'], missing: false }],
  },
  {
    input: [[], 'one', missingOpts],
    output: [{ value: undefined, path: ['one'], missing: true }],
  },
])
