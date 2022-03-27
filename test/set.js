/* eslint-disable max-lines */
import test from 'ava'
import { each } from 'test-each'
import { set } from 'wild-wild-path'

import { getChild, childProps, testChildProps } from './helpers/inherited.js'
import { testMutate } from './helpers/mutate.js'

testMutate(
  'set()',
  ({ target, query, value, opts }) => set(target, query, value, opts),
  [
    // Main usage
    { target: { one: 1 }, query: 'one', value: 2, output: { one: 2 } },
    { target: { one: 1 }, query: 'two', value: 2, output: { one: 1, two: 2 } },
    {
      target: { one: 1 },
      query: 'two three',
      value: 2,
      output: { one: 1, two: 2, three: 2 },
    },
    {
      target: { one: {} },
      query: 'one.two',
      value: 2,
      output: { one: { two: 2 } },
    },
    { target: [1, 2], query: '-0', value: 3, output: [1, 2, 3] },
    { target: [1, 2], query: '3', value: 3, output: [1, 2, undefined, 3] },
    { target: [], query: [0], value: 1, output: [1] },

    // No changes
    { target: [], query: '0', value: undefined, output: [undefined] },
    { target: [], query: '0', value: 1, output: [1] },
    { target: [undefined], query: '0', value: undefined, output: [undefined] },
    { target: [1], query: '0', value: 1, output: [1] },
    { target: {}, query: 'one', value: undefined, output: { one: undefined } },
    { target: {}, query: 'one', value: 1, output: { one: 1 } },
    {
      target: { one: undefined },
      query: 'one',
      value: undefined,
      output: { one: undefined },
    },
    { target: { one: 1 }, query: 'one', value: 1, output: { one: 1 } },

    // `missing` option
    { target: {}, query: 'one', value: 1, output: { one: 1 } },
    {
      target: { two: 2 },
      query: 'one two',
      value: 1,
      opts: { missing: false },
      output: { two: 1 },
    },
    { target: {}, query: 'one.two', value: 1, output: { one: { two: 1 } } },
    { target: [], query: '0.0', value: 1, output: [[1]] },
    { target: {}, query: '0', value: 1, output: [1] },
    { target: { one: {} }, query: 'one.0', value: 1, output: { one: [1] } },
    {
      target: [],
      query: 'two',
      value: 1,
      output: { two: 1 },
    },
    {
      target: { one: [] },
      query: 'one.two',
      value: 1,
      output: { one: { two: 1 } },
    },

    // `leaves` option
    {
      target: { one: { two: 1 } },
      query: 'one one.two',
      value: 2,
      output: { one: 2 },
    },
    {
      target: { one: { two: 1 } },
      query: 'one one.two',
      value: 2,
      opts: { leaves: true },
      output: { one: { two: 2 } },
    },
  ],
)

each(
  [
    // `classes` and `inherited` options
    { target: getChild(), query: '*', value: 2, output: childProps },
    {
      target: getChild(),
      query: '*',
      value: 2,
      opts: { classes: true, mutate: true },
      output: { ...childProps, ownEnum: 2 },
    },
    {
      target: getChild(),
      query: '*',
      value: 2,
      opts: { classes: true, inherited: true, mutate: true },
      output: { ...childProps, ownEnum: 2, inheritedEnum: 2 },
    },
  ],
  ({ title }, { target, query, value, opts, output }) => {
    test(`set() output | ${title}`, (t) => {
      testChildProps(t, set(target, query, value, opts), output)
    })
  },
)

each(
  [
    { target: {}, query: '.', opts: { classes: true } },
    { target: {}, query: [true] },
  ],
  ({ title }, { target, query, value, opts }) => {
    test(`set() validates its input | ${title}`, (t) => {
      t.throws(set.bind(undefined, target, query, value, opts))
    })
  },
)
/* eslint-enable max-lines */
