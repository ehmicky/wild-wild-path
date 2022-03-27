// eslint-disable-next-line ava/no-ignored-test-files
import test from 'ava'
import { each } from 'test-each'

// Test that a given method throws on invalid input
export const testValidation = function (methods, inputs) {
  each(methods, inputs, ({ title }, { name, method }, input) =>
    testValidationInput({ name, method, title, input }),
  )
}

const testValidationInput = function ({ name, method, title, input }) {
  test(`${name}() validates its input | ${title}`, (t) => {
    t.throws(method.bind(undefined, ...input))
  })
}
