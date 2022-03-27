import { testListIterate } from '../helpers/list.js'

testListIterate([
  { target: { one: 1 }, query: 'one', output: [1] },
  { target: { one: 1 }, query: ['one'], output: [1] },
])
