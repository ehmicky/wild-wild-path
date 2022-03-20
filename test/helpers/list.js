import { list, iterate } from 'wild-wild-path'

// We repeat the same tests for both `list()` and `iterate()`
const iterateAll = function (target, query, opts) {
  return [...iterate(target, query, opts)]
}

export const listMethods = [list, iterateAll]
