import test from 'ava'
import { each } from 'test-each'
import { list } from 'wild-wild-path'

const selfObject = { one: 1, two: { three: 3 } }
// eslint-disable-next-line fp/no-mutation
selfObject.two.self = selfObject

each(
  [
    { target: 1, query: '.', output: [1] },
    { target: { one: 1 }, query: 'one', output: [1] },
    { target: { one: { two: 1 } }, query: 'one.two', output: [1] },
    { target: { one: 1, two: 2, three: 3 }, query: 'one two', output: [1, 2] },
    { target: { one: 1 }, query: 'one one', output: [1] },
    { target: { one: { two: 2 } }, query: '*.two one.two', output: [2] },
    {
      target: { one: { two: { three: 1 } } },
      query: '*.two one.two.three',
      output: [{ three: 1 }, 1],
    },
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
    {
      target: {},
      query: '.',
      output: [{ value: {}, path: [], missing: false }],
      opts: { entries: true },
    },
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
  ],
  ({ title }, { target, query, opts, output }) => {
    test(`list() output | ${title}`, (t) => {
      t.deepEqual(list(target, query, opts), output)
    })
  },
)

each(
  [
    { target: {}, query: '.', opts: { inherited: true, classes: false } },
    { target: {}, query: '.', opts: { missing: true, entries: false } },
    { target: {}, query: '.', opts: { roots: true, leaves: true } },
    { target: {}, query: true },
    { target: {}, query: [[true]] },
    { target: {}, query: 'a\\b' },
  ],
  ({ title }, { target, query, opts }) => {
    test(`list() validates its input | ${title}`, (t) => {
      t.throws(list.bind(undefined, target, query, opts))
    })
  },
)
