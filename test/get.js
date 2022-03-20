import test from 'ava'
import { each } from 'test-each'
import { get } from 'wild-wild-path'

each(
  [{ target: { one: 1 }, query: 'one', output: 1 }],
  ({ title }, { target, query, opts, output }) => {
    test(`get() output | ${title}`, (t) => {
      t.deepEqual(get(target, query, opts), output)
    })
  },
)
