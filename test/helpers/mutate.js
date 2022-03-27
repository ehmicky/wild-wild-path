// eslint-disable-next-line ava/no-ignored-test-files
import test from 'ava'
import { each } from 'test-each'

// Test multiple inputs with the `mutate` option either `true` or `false`
export const testMutate = function (methods, inputs) {
  each(
    [false, true],
    methods,
    inputs,
    // eslint-disable-next-line max-params
    ({ title }, mutate, { name, method }, { input, opts, output }) =>
      testMutateInput({ title, mutate, input, opts, output, name, method }),
  )
}

const testMutateInput = function ({
  title,
  mutate,
  input,
  input: [target],
  opts,
  output,
  name,
  method,
}) {
  test(`${name}() output | ${title}`, (t) => {
    t.deepEqual(method(...input, { mutate, ...opts }), output)

    if (mutate && Array.isArray(target) === Array.isArray(output)) {
      t.deepEqual(target, output)
    }
  })
}
