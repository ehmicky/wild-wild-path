// eslint-disable-next-line ava/no-ignored-test-files
import test from 'ava'
import { list, iterate } from 'wild-wild-path'

// Test `list()` and `iterate()` return value
export const testListIterateOutput = function (
  { title },
  listFunc,
  { target, query, opts, output },
) {
  test(`list|iterate() output | ${title}`, (t) => {
    t.deepEqual(listFunc(target, query, opts), output)
  })
}

// We repeat the same tests for both `list()` and `iterate()`
const iterateAll = function (target, query, opts) {
  return [...iterate(target, query, opts)]
}

export const listMethods = [list, iterateAll]
