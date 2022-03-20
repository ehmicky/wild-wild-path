import test from 'ava'
import { each } from 'test-each'
import { set } from 'wild-wild-path'

each(
  [true, false],
  [
    { target: { one: 1 }, query: 'one', value: 2, output: { one: 2 } },
    { target: { one: 1 }, query: 'two', value: 2, output: { one: 1, two: 2 } },
    {
      target: { one: 1 },
      query: 'two three',
      value: 2,
      output: { one: 1, two: 2, three: 2 },
    },
    {
      target: { one: {} },
      query: 'one.two',
      value: 2,
      output: { one: { two: 2 } },
    },
  ],
  ({ title }, mutate, { target, query, value, opts, output }) => {
    test(`set() output | ${title}`, (t) => {
      t.deepEqual(set(target, query, value, { mutate, ...opts }), output)

      if (mutate) {
        t.deepEqual(target, output)
      }
    })
  },
)

each(
  [{ target: {}, query: '.', opts: { classes: true } }],
  ({ title }, { target, query, value, opts }) => {
    test(`set() validates its input | ${title}`, (t) => {
      t.throws(set.bind(undefined, target, query, value, opts))
    })
  },
)
