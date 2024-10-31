import { testOutput } from './output.test.js'
import { testValidation } from './validate.test.js'

import { iterate, list } from 'wild-wild-path'

// Repeat the same tests for both `list()` and `iterate()`
export const testListOutput = (inputs) => {
  testOutput(listMethods, inputs)
}

export const testListValidation = (inputs) => {
  testValidation(listMethods, inputs)
}

const listMethods = [
  { name: 'list', method: list },
  {
    name: 'iterate',
    method: (...inputs) => [...iterate(...inputs)],
  },
]
