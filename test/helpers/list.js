import { list, iterate } from 'wild-wild-path'

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
