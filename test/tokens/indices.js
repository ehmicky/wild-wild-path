import test from 'ava'
import { each } from 'test-each'

import { listMethods } from '../helpers/list.js'

each(
  listMethods,
  [
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
      opts: { missing: true, entries: true },
    },
    {
      target: [],
      query: '-0',
      output: [{ value: undefined, path: [0], missing: true }],
      opts: { missing: true, entries: true },
    },
    { target: [undefined], query: '0', output: [undefined] },
    { target: { 0: 1 }, query: '0', output: [] },
  ],
  ({ title }, list, { target, query, opts, output }) => {
    test(`list|iterate() output | ${title}`, (t) => {
      t.deepEqual(list(target, query, opts), output)
    })
  },
)
