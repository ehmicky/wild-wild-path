import { testListIterate } from '../helpers/list.js'
import { missingOpts } from '../helpers/options.js'

testListIterate([
  { target: [1, 2, 3], query: '0', output: [1] },
  { target: [1, 2, 3], query: [0], output: [1] },
  { target: [1, 2, 3], query: '1', output: [2] },
  { target: [1, 2, 3], query: '3', output: [] },
  { target: [1, 2, 3], query: '-0', output: [] },
  { target: [1, 2, 3], query: '-1', output: [3] },
  { target: [1, 2, 3], query: '-3', output: [1] },
  {
    target: [],
    query: '0',
    output: [{ value: undefined, path: [0], missing: true }],
    opts: missingOpts,
  },
  {
    target: [],
    query: '-0',
    output: [{ value: undefined, path: [0], missing: true }],
    opts: missingOpts,
  },
  { target: [undefined], query: '0', output: [undefined] },
  { target: { 0: 1 }, query: '0', output: [] },
])
