// eslint-disable-next-line ava/no-ignored-test-files
import test from 'ava'
import { each } from 'test-each'

// Test multiple inputs with the `mutate` option either `true` or `false`
export const testMutate = (methods, inputs) => {
  each([false, true], methods, inputs, testMutateSingle)
}

/* eslint-disable max-params */
const testMutateSingle = (
  { title },
  mutate,
  { name, method },
  { input, input: [target], opts, output },
) => {
  test(`${name}() output | ${title}`, (t) => {
    t.deepEqual(method(...input, { mutate, ...opts }), output)

    if (mutate && Array.isArray(target) === Array.isArray(output)) {
      t.deepEqual(target, output)
    }
  })
}
/* eslint-enable max-params */
