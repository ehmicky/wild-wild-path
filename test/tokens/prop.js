import { testListIterate } from '../helpers/list.js'

testListIterate([
  { input: [{ one: 1 }, 'one'], output: [1] },
  { input: [{ one: 1 }, ['one']], output: [1] },
])
