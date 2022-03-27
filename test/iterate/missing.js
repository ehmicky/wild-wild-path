import { testListIterate } from '../helpers/list.js'
import { missingOpts } from '../helpers/options.js'

testListIterate([
  {
    target: { one: 1 },
    query: 'one two',
    output: [
      { value: 1, path: ['one'], missing: false },
      { value: undefined, path: ['two'], missing: true },
    ],
    opts: missingOpts,
  },
  {
    target: {},
    query: 'one',
    output: [{ value: undefined, path: ['one'], missing: true }],
    opts: missingOpts,
  },
  { target: { one: undefined }, query: 'one', output: [undefined] },
  {
    target: { one: undefined },
    query: 'one',
    output: [{ value: undefined, path: ['one'], missing: false }],
    opts: missingOpts,
  },
  {
    target: [],
    query: 'one',
    output: [{ value: undefined, path: ['one'], missing: true }],
    opts: missingOpts,
  },
])
