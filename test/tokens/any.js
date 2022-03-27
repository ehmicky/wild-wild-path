import { testListIterate } from '../helpers/list.js'
import { missingOpts } from '../helpers/options.js'

testListIterate([
  {
    target: { one: 1, two: 2 },
    query: '*',
    output: [
      { value: 1, path: ['one'], missing: false },
      { value: 2, path: ['two'], missing: false },
    ],
    opts: { entries: true },
  },
  {
    target: { one: 1, two: 2 },
    query: [{ type: 'any' }],
    output: [1, 2],
  },
  {
    target: [1, 2],
    query: '*',
    output: [
      { value: 1, path: [0], missing: false },
      { value: 2, path: [1], missing: false },
    ],
    opts: { entries: true },
  },
  { target: {}, query: '*', output: [], opts: missingOpts },
  { target: [], query: '*', output: [], opts: missingOpts },
])
