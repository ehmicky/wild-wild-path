import test from 'ava'
import { each } from 'test-each'
import { get } from 'wild-wild-path'

each(
  [
    { target: { one: 1 }, query: 'one', output: 1 },
    { target: { one: 1, two: 2 }, query: '*', output: 1 },
    { target: { one: 1 }, query: 'two', output: undefined },

    // `entries` option
    {
      target: { one: 1 },
      query: 'two',
      opts: { entries: true },
      output: undefined,
    },
    {
      target: { one: 1 },
      query: 'one',
      opts: { entries: true },
      output: { value: 1, path: ['one'], missing: false },
    },

    // `childFirst`, `leaves` and `roots` options
    { target: { one: { two: 2 } }, query: 'one one.two', output: { two: 2 } },
    {
      target: { one: { two: 2 } },
      query: 'one one.two',
      opts: { childFirst: true },
      output: 2,
    },
    {
      target: { one: { two: 2 } },
      query: 'one one.two',
      opts: { leaves: true },
      output: 2,
    },
    {
      target: { one: { two: 2 } },
      query: 'one one.two',
      opts: { roots: true, childFirst: true },
      output: { two: 2 },
    },

    // `sort` option
    { target: { two: 2, one: 1 }, query: 'two one', output: 2 },
    {
      target: { two: 2, one: 1 },
      query: 'two one',
      opts: { sort: true },
      output: 1,
    },
  ],
  ({ title }, { target, query, opts, output }) => {
    test(`get() output | ${title}`, (t) => {
      t.deepEqual(get(target, query, opts), output)
    })
  },
)
