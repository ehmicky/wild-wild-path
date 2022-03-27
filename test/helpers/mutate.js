// eslint-disable-next-line ava/no-ignored-test-files
import test from 'ava'
import { each } from 'test-each'

// Test multiple inputs with the `mutate` option either `true` or `false`
export const testMutate = function (testName, setFunc, inputs) {
  each(
    [false, true],
    inputs,
    ({ title }, mutate, { target, query, value, opts, output }) =>
      testMutateInput({
        title,
        mutate,
        target,
        query,
        value,
        opts,
        output,
        setFunc,
        testName,
      }),
  )
}

const testMutateInput = function ({
  title,
  mutate,
  target,
  query,
  value,
  opts,
  output,
  setFunc,
  testName,
}) {
  test(`${testName} output | ${title}`, (t) => {
    t.deepEqual(
      setFunc({ target, query, value, opts: { mutate, ...opts } }),
      output,
    )

    if (mutate && Array.isArray(target) === Array.isArray(output)) {
      t.deepEqual(target, output)
    }
  })
}
