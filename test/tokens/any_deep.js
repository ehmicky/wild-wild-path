import test from 'ava'
import { each } from 'test-each'

import { listMethods } from '../helpers/list.js'

const selfObject = { one: 1, two: { three: 3 } }
// eslint-disable-next-line fp/no-mutation
selfObject.two.self = selfObject

each(
  listMethods,
  [
    { target: selfObject, query: '**', output: [1, 3], opts: { leaves: true } },
    {
      target: { one: 1, two: { three: 3, four: [2, { five: 0 }] } },
      query: '**',
      output: [1, 3, 2, 0],
      opts: { leaves: true },
    },
    {
      target: { one: { two: 1 } },
      query: '**',
      output: [{ one: { two: 1 } }, { two: 1 }, 1],
    },
    {
      target: { one: { two: 1 } },
      query: '**.*',
      output: [{ two: 1 }, 1],
    },
    {
      target: { one: { two: 1 } },
      query: '*.**',
      output: [{ two: 1 }, 1],
    },
    {
      target: { one: { two: 2 }, three: { two: 3 } },
      query: 'one.**',
      output: [2],
      opts: { leaves: true },
    },
    {
      target: { one: { two: 2 }, three: { two: 3 } },
      query: ['one', { type: 'anyDeep' }],
      output: [2],
      opts: { leaves: true },
    },
    {
      target: { one: { two: 2 }, three: { two: 3 } },
      query: '**.two',
      output: [2, 3],
      opts: { leaves: true },
    },
    {
      target: { one: { two: { four: 2 } }, three: { two: { four: 3 } } },
      query: '**.two.**',
      output: [2, 3],
      opts: { leaves: true },
    },
    {
      target: { one: { one: 2 }, two: { one: 3 } },
      query: '**.one.**',
      output: [{ one: 2 }, 2, 3],
    },
    { target: {}, query: '**', output: [{}] },
    {
      target: { one: { two: 2 }, three: { four: 3 } },
      query: '**.**',
      output: [2, 3],
      opts: { leaves: true },
    },
  ],
  ({ title }, list, { target, query, opts, output }) => {
    test(`list|iterate() output | ${title}`, (t) => {
      t.deepEqual(list(target, query, opts), output)
    })
  },
)
