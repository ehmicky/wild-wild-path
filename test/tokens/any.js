import { each } from 'test-each'

import { listMethods, testListIterateOutput } from '../helpers/list.js'

each(
  listMethods,
  [
    {
      target: { one: 1, two: 2 },
      query: '*',
      output: [
        { value: 1, path: ['one'], missing: false },
        { value: 2, path: ['two'], missing: false },
      ],
      opts: { entries: true },
    },
    {
      target: { one: 1, two: 2 },
      query: [{ type: 'any' }],
      output: [
        { value: 1, path: ['one'], missing: false },
        { value: 2, path: ['two'], missing: false },
      ],
      opts: { entries: true },
    },
    {
      target: [1, 2],
      query: '*',
      output: [
        { value: 1, path: [0], missing: false },
        { value: 2, path: [1], missing: false },
      ],
      opts: { entries: true },
    },
    {
      target: {},
      query: '*',
      output: [],
      opts: { missing: true, entries: true },
    },
    {
      target: [],
      query: '*',
      output: [],
      opts: { missing: true, entries: true },
    },
  ],
  testListIterateOutput,
)
