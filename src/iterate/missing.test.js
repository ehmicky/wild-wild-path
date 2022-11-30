import { testListOutput } from '../helpers/list.test.js'

testListOutput([
  {
    input: [{ one: 1 }, 'one two', { missing: true, entries: true }],
    output: [
      { value: 1, path: ['one'], missing: false },
      { value: undefined, path: ['two'], missing: true },
    ],
  },
  {
    input: [{}, 'one', { missing: true, entries: true }],
    output: [{ value: undefined, path: ['one'], missing: true }],
  },
  { input: [{ one: undefined }, 'one'], output: [undefined] },
  {
    input: [{ one: undefined }, 'one', { missing: true, entries: true }],
    output: [{ value: undefined, path: ['one'], missing: false }],
  },
  {
    input: [[], 'two', { missing: true, entries: true }],
    output: [{ value: undefined, path: ['two'], missing: true }],
  },
])
