import { each } from 'test-each'

import { listMethods, testListIterateOutput } from '../helpers/list.js'

each(
  listMethods,
  [
    { target: { one: 1 }, query: 'one', output: [1] },
    { target: { one: 1 }, query: ['one'], output: [1] },
  ],
  testListIterateOutput,
)
