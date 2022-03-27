import { listMethods } from '../helpers/list.js'
import { testOutput } from '../helpers/output.js'

testOutput(listMethods, [
  { input: [{ one: 1 }, 'one'], output: [1] },
  { input: [{ one: 1 }, ['one']], output: [1] },
])
