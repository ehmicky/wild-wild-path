import test from 'ava'
import { each } from 'test-each'

import { listMethods } from '../helpers/list.js'

each(
  listMethods,
  [
    { target: { one: 1 }, query: 'one', output: [1] },
    { target: { one: 1 }, query: ['one'], output: [1] },
  ],
  ({ title }, list, { target, query, opts, output }) => {
    test(`list() output | ${title}`, (t) => {
      t.deepEqual(list(target, query, opts), output)
    })
  },
)
