import { testListOutput } from '../helpers/list.test.js'

testListOutput([
  { input: [{ one: 1 }, 'one'], output: [1] },
  { input: [{ one: 1 }, ['one']], output: [1] },
  { input: [[1], ['0']], output: [1] },
])
