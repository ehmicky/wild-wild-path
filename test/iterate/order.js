import test from 'ava'
import { each } from 'test-each'

import { listMethods } from '../helpers/list.js'

each(
  listMethods,
  [
    // `childFirst` option
    {
      target: { one: 1 },
      query: 'one .',
      output: [{ one: 1 }, 1],
      opts: { childFirst: false },
    },
    {
      target: { one: 1 },
      query: '. one',
      output: [1, { one: 1 }],
      opts: { childFirst: true },
    },
    {
      target: { one: { two: { three: 1 } } },
      query: 'one.two *.two.three',
      output: [1, { three: 1 }],
      opts: { childFirst: true },
    },

    // `leaves` option
    {
      target: { one: { two: 1 } },
      query: 'one . one.two',
      output: [1],
      opts: { leaves: true },
    },
    {
      target: { one: { two: 1 } },
      query: '. one one.two',
      output: [1],
      opts: { leaves: true, childFirst: true },
    },
    { target: {}, query: '. *', output: [{}], opts: { leaves: true } },

    // `roots` option
    {
      target: { one: 1 },
      query: '. one',
      output: [{ one: 1 }],
      opts: { roots: true },
    },

    // `sort` option
    { target: { two: 2, one: 1 }, query: '*', output: [2, 1] },
    {
      target: { two: 2, one: 1 },
      query: '*',
      output: [1, 2],
      opts: { sort: true },
    },
  ],
  ({ title }, list, { target, query, opts, output }) => {
    test(`list|iterate() output | ${title}`, (t) => {
      t.deepEqual(list(target, query, opts), output)
    })
  },
)
