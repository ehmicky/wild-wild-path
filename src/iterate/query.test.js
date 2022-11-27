import { testListOutput } from '../helpers/list.test.js'

testListOutput([
  // `childFirst` option
  {
    input: [{ one: 1 }, 'one .', { childFirst: false }],
    output: [{ one: 1 }, 1],
  },
  {
    input: [{ one: 1 }, '. one', { childFirst: true }],
    output: [1, { one: 1 }],
  },
  {
    input: [
      { one: { two: { three: 1 } } },
      'one.two *.two.three',
      { childFirst: true },
    ],
    output: [1, { three: 1 }],
  },

  // `leaves` option
  {
    input: [{ one: { two: 1 } }, 'one . one.two', { leaves: true }],
    output: [1],
  },
  {
    input: [
      { one: { two: 1 } },
      '. one one.two',
      { leaves: true, childFirst: true },
    ],
    output: [1],
  },
  { input: [{}, '. *', { leaves: true }], output: [{}] },

  // `roots` option
  { input: [{ one: 1 }, '. one', { roots: true }], output: [{ one: 1 }] },

  // `sort` option
  { input: [{ two: 2, one: 1 }, '*'], output: [2, 1] },
  { input: [{ two: 2, one: 1 }, '*', { sort: true }], output: [1, 2] },
])
