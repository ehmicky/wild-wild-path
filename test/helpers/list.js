// eslint-disable-next-line ava/no-ignored-test-files
import test from 'ava'
import { each } from 'test-each'
import { list, iterate } from 'wild-wild-path'

export const testListIterate = function (inputs) {
  each(listMethods, inputs, testListIterateOutput)
}

// Test `list()` and `iterate()` return value
const testListIterateOutput = function (
  { title },
  { name, method },
  { input, output },
) {
  test(`${name}() output | ${title}`, (t) => {
    t.deepEqual(method(...input), output)
  })
}

// We repeat the same tests for both `list()` and `iterate()`
const iterateAll = function (target, query, opts) {
  return [...iterate(target, query, opts)]
}

export const listMethods = [
  { name: 'list', method: list },
  { name: 'iterate', method: iterateAll },
]
