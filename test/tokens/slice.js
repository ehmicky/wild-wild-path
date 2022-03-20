import test from 'ava'
import { each } from 'test-each'

import { listMethods } from '../helpers/list.js'

each(
  listMethods,
  [
    { target: [0, 1, 2, 3], query: '1:3', output: [1, 2] },
    {
      target: [0, 1, 2, 3],
      query: [{ type: 'slice', from: 1, to: 3 }],
      output: [1, 2],
    },
    { target: [0, 1, 2, 3], query: '1:-1', output: [1, 2] },
    { target: [0, 1, 2, 3], query: '-3:3', output: [1, 2] },
    { target: [0, 1, 2, 3], query: '-5:3', output: [0, 1, 2] },
    {
      target: [0, 1, 2, 3],
      query: '-6:-5',
      output: [],
      opts: { missing: true, entries: true },
    },
    { target: [0, 1, 2, 3], query: '1:5', output: [1, 2, 3] },
    { target: [0, 1, 2, 3], query: '1:-0', output: [1, 2, 3] },
    {
      target: [0, 1, 2, 3],
      query: '5:6',
      output: [],
      opts: { missing: true, entries: true },
    },
    { target: [0, 1, 2, 3], query: '1:', output: [1, 2, 3] },
    { target: [0, 1, 2, 3], query: ':3', output: [0, 1, 2] },
    { target: [0, 1, 2, 3], query: ':', output: [0, 1, 2, 3] },
    { target: [], query: '0:5', output: [] },
    {
      target: {},
      query: ':',
      output: [],
      opts: { missing: true, entries: true },
    },
  ],
  ({ title }, list, { target, query, opts, output }) => {
    test(`list() output | ${title}`, (t) => {
      t.deepEqual(list(target, query, opts), output)
    })
  },
)
