// eslint-disable-next-line ava/no-ignored-test-files
import test from 'ava'
import { each } from 'test-each'

// Test the output of a specific method based on its input
export const testOutput = (methods, inputs) => {
  each(methods, inputs, testOutputSingle)
}

const testOutputSingle = ({ title }, { name, method }, { input, output }) => {
  test(`${name}() output | ${title}`, (t) => {
    t.deepEqual(method(...input), output)
  })
}
