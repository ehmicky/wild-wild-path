import test from 'ava'
import { each } from 'test-each'

import { listMethods } from '../helpers/list.js'

each(
  listMethods,
  [
    // Root query
    { target: 1, query: '.', output: [1] },
    { target: 1, query: [], output: [1] },
    { target: 1, query: [[]], output: [1] },
    {
      target: {},
      query: '.',
      output: [{ value: {}, path: [], missing: false }],
      opts: { entries: true },
    },

    // Deep query
    { target: { one: { two: 1 } }, query: 'one.two', output: [1] },
    { target: { one: { two: 1 } }, query: ['one', 'two'], output: [1] },

    // Unions
    { target: { one: 1, two: 2, three: 3 }, query: 'one two', output: [1, 2] },
    {
      target: { one: 1, two: 2, three: 3 },
      query: [['one'], ['two']],
      output: [1, 2],
    },
    { target: { one: 1 }, query: 'one one', output: [1] },
    { target: { one: { two: 2 } }, query: '*.two one.two', output: [2] },
    {
      target: { one: { two: { three: 1 } } },
      query: '*.two one.two.three',
      output: [{ three: 1 }, 1],
    },

    // Forbidden properties
    { target: { __proto__: {} }, query: '__proto__', output: [] },
    { target: { prototype: {} }, query: 'prototype', output: [] },
    { target: { constructor() {} }, query: 'constructor', output: [] },
  ],
  ({ title }, list, { target, query, opts, output }) => {
    test(`list() output | ${title}`, (t) => {
      t.deepEqual(list(target, query, opts), output)
    })
  },
)

each(
  listMethods,
  [
    { target: {}, query: '.', opts: { inherited: true, classes: false } },
    { target: {}, query: '.', opts: { missing: true, entries: false } },
    { target: {}, query: '.', opts: { roots: true, leaves: true } },
    { target: {}, query: true },
    { target: {}, query: [[true]] },
    { target: {}, query: 'a\\b' },
    { target: {}, query: '/[/' },
  ],
  ({ title }, list, { target, query, opts }) => {
    test(`list() validates its input | ${title}`, (t) => {
      t.throws(list.bind(undefined, target, query, opts))
    })
  },
)
