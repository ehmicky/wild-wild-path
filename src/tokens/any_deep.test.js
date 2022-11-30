import { testListOutput } from '../helpers/list.test.js'

const selfObject = { one: 1, two: { three: 3 } }
// eslint-disable-next-line fp/no-mutation
selfObject.two.self = selfObject

testListOutput([
  { input: [selfObject, '**', { leaves: true }], output: [1, 3] },
  {
    input: [
      { one: 1, two: { three: 3, four: [2, { five: 0 }] } },
      '**',
      { leaves: true },
    ],
    output: [1, 3, 2, 0],
  },
  {
    input: [{ one: { two: 1 } }, '**'],
    output: [{ one: { two: 1 } }, { two: 1 }, 1],
  },
  { input: [{ one: { two: 1 } }, '**.*'], output: [{ two: 1 }, 1] },
  { input: [{ one: { two: 1 } }, '*.**'], output: [{ two: 1 }, 1] },
  {
    input: [{ one: { two: 2 }, three: { two: 3 } }, 'one.**', { leaves: true }],
    output: [2],
  },
  {
    input: [
      { one: { two: 1 }, three: { two: 3 } },
      ['one', { type: 'anyDeep' }],
      { leaves: true },
    ],
    output: [1],
  },
  {
    input: [{ one: { two: 2 }, three: { two: 3 } }, '**.two', { leaves: true }],
    output: [2, 3],
  },
  {
    input: [
      { one: { two: { four: 2 } }, three: { two: { four: 3 } } },
      '**.two.**',
      { leaves: true },
    ],
    output: [2, 3],
  },
  {
    input: [{ one: { one: 2 }, two: { one: 3 } }, '**.one.**'],
    output: [{ one: 2 }, 2, 3],
  },
  { input: [{}, '**'], output: [{}] },
  {
    input: [{ one: { two: 2 }, three: { four: 3 } }, '**.**', { leaves: true }],
    output: [2, 3],
  },
  {
    input: [{ one: [{ two: 2 }] }, '**', { shallowArrays: true, leaves: true }],
    output: [[{ two: 2 }]],
  },
  {
    input: [
      { one: [{ two: 2 }] },
      '**.0.two',
      { shallowArrays: true, leaves: true },
    ],
    output: [2],
  },
])
