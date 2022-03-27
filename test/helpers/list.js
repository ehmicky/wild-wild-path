import { list, iterate } from 'wild-wild-path'

import { testOutput } from './output.js'

export const testListIterate = function (inputs) {
  testOutput(listMethods, inputs)
}

// We repeat the same tests for both `list()` and `iterate()`
export const listMethods = [
  { name: 'list', method: list },
  {
    name: 'iterate',
    method(...inputs) {
      return [...iterate(...inputs)]
    },
  },
]
