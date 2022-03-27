import { testListOutput } from '../helpers/list.js'

testListOutput([
  { input: [{ one: 1 }, 'one'], output: [1] },
  { input: [{ one: 1 }, ['one']], output: [1] },
])
