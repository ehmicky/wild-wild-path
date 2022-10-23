import { testListOutput } from '../helpers/list.js'

testListOutput([
  { input: [[1, 2, 3], '0'], output: [1] },
  { input: [[1, 2, 3], [0]], output: [1] },
  { input: [[1, 2, 3], '1'], output: [2] },
  { input: [[1, 2, 3], '3'], output: [] },
  { input: [[1, 2, 3], '-0'], output: [] },
  { input: [[1, 2, 3], '-1'], output: [3] },
  { input: [[1, 2, 3], '-3'], output: [1] },
  {
    input: [[], '0', { missing: true, entries: true }],
    output: [{ value: undefined, path: [0], missing: true }],
  },
  {
    input: [[], '-0', { entries: true, missing: true }],
    output: [{ value: undefined, path: [0], missing: true }],
  },
  { input: [[undefined], '0'], output: [undefined] },
  { input: [{ 0: 1 }, '0'], output: [] },
  { input: [[1, 2, 3], '0', { shallowArrays: true }], output: [1] },
])
