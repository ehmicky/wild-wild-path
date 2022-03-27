import { testListIterate } from '../helpers/list.js'

testListIterate([
  { target: { one: 1, two: 2, three: 3 }, query: '/t/', output: [2, 3] },
  { target: { one: 1, two: 2, three: 3 }, query: [/t/u], output: [2, 3] },
  { target: { one: 1, two: 2, three: 3 }, query: '/T/', output: [] },
  { target: { one: 1, two: 2, three: 3 }, query: '/T/i', output: [2, 3] },
  {
    target: { one: 1 },
    query: '/a/',
    output: [],
    opts: { missing: true, entries: true },
  },
  {
    target: [],
    query: '/a/',
    output: [],
    opts: { missing: true, entries: true },
  },
])
