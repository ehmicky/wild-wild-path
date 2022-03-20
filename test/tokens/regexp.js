import test from 'ava'
import { each } from 'test-each'

import { listMethods } from '../helpers/list.js'

each(
  listMethods,
  [
    { target: { one: 1, two: 2, three: 3 }, query: '/t/', output: [2, 3] },
    { target: { one: 1, two: 2, three: 3 }, query: [/t/u], output: [2, 3] },
    { target: { one: 1, two: 2, three: 3 }, query: '/T/', output: [] },
    { target: { one: 1, two: 2, three: 3 }, query: '/T/i', output: [2, 3] },
    {
      target: { one: 1 },
      query: '/a/',
      output: [],
      opts: { missing: true, entries: true },
    },
    {
      target: [],
      query: '/a/',
      output: [],
      opts: { missing: true, entries: true },
    },
  ],
  ({ title }, list, { target, query, opts, output }) => {
    test(`list|iterate() output | ${title}`, (t) => {
      t.deepEqual(list(target, query, opts), output)
    })
  },
)
