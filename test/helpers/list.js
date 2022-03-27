import { list, iterate } from 'wild-wild-path'

import { testOutput } from './output.js'

export const testListIterate = function (inputs) {
  testOutput(listMethods, inputs)
}

// We repeat the same tests for both `list()` and `iterate()`
const iterateAll = function (target, query, opts) {
  return [...iterate(target, query, opts)]
}

export const listMethods = [
  { name: 'list', method: list },
  { name: 'iterate', method: iterateAll },
]
