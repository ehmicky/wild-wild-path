import { list, iterate } from 'wild-wild-path'

import { testOutput } from './output.js'
import { testValidation } from './validate.js'

// Repeat the same tests for both `list()` and `iterate()`
export const testListOutput = function (inputs) {
  testOutput(listMethods, inputs)
}

export const testListValidation = function (inputs) {
  testValidation(listMethods, inputs)
}

const listMethods = [
  { name: 'list', method: list },
  {
    name: 'iterate',
    method(...inputs) {
      return [...iterate(...inputs)]
    },
  },
]
