import test from 'ava'
import { each } from 'test-each'
import { list } from 'wild-wild-path'

each(
  [{ target: { one: { two: 1 } }, query: 'one.two', output: [1] }],
  ({ title }, { target, query, opts, output }) => {
    test(`list() output | ${title}`, (t) => {
      t.deepEqual(list(target, query, opts), output)
    })
  },
)
