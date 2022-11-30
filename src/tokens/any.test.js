import { testListOutput } from '../helpers/list.test.js'

testListOutput([
  {
    input: [{ one: 1, two: 2 }, '*', { entries: true }],
    output: [
      { value: 1, path: ['one'], missing: false },
      { value: 2, path: ['two'], missing: false },
    ],
  },
  { input: [{ one: 1, two: 2 }, [{ type: 'any' }]], output: [1, 2] },
  {
    input: [[1, 2], '*', { entries: true }],
    output: [
      { value: 1, path: [0], missing: false },
      { value: 2, path: [1], missing: false },
    ],
  },
  { input: [[1, 2], '*', { shallowArrays: true }], output: [] },
  { input: [[1, 2], '*.0', { shallowArrays: true }], output: [] },
  { input: [{}, '*', { missing: true, entries: true }], output: [] },
  { input: [[], '*', { missing: true, entries: true }], output: [] },
])
