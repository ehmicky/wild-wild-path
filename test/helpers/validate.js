// eslint-disable-next-line ava/no-ignored-test-files
import test from 'ava'
import { each } from 'test-each'

// Test that a given method throws on invalid input
export const testValidation = function (testName, methods, inputs) {
  each(methods, inputs, ({ title }, method, input) =>
    testValidationInput({ testName, method, title, input }),
  )
}

const testValidationInput = function ({ testName, method, title, input }) {
  test(`${testName} validates its input | ${title}`, (t) => {
    t.throws(method.bind(undefined, ...input))
  })
}
