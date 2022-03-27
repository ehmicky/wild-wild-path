import { testListIterate } from '../helpers/list.js'

testListIterate([
  {
    target: { one: 1 },
    query: 'one two',
    output: [
      { value: 1, path: ['one'], missing: false },
      { value: undefined, path: ['two'], missing: true },
    ],
    opts: { missing: true, entries: true },
  },
  {
    target: {},
    query: 'one',
    output: [{ value: undefined, path: ['one'], missing: true }],
    opts: { missing: true, entries: true },
  },
  { target: { one: undefined }, query: 'one', output: [undefined] },
  {
    target: { one: undefined },
    query: 'one',
    output: [{ value: undefined, path: ['one'], missing: false }],
    opts: { missing: true, entries: true },
  },
  {
    target: [],
    query: 'one',
    output: [{ value: undefined, path: ['one'], missing: true }],
    opts: { missing: true, entries: true },
  },
])
