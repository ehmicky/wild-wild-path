// eslint-disable-next-line ava/no-ignored-test-files
import test from 'ava'
import { each } from 'test-each'

// Test that a given method throws on invalid input
export const testValidation = function (methods, inputs) {
  each(methods, inputs, testValidationSingle)
}

const testValidationSingle = function ({ title }, { name, method }, input) {
  test(`${name}() validates its input | ${title}`, (t) => {
    t.throws(method.bind(undefined, ...input))
  })
}
