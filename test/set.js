/* eslint-disable max-lines */
import test from 'ava'
import { each } from 'test-each'
import { set } from 'wild-wild-path'

import { getChild } from './helpers/inherited.js'

each(
  [true, false],
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

    // `missing` option
    { target: {}, query: 'one', value: 1, output: { one: 1 } },
    {
      target: {},
      query: 'one',
      value: 1,
      opts: { missing: false },
      output: {},
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
  ({ title }, mutate, { target, query, value, opts, output }) => {
    test(`set() output | ${title}`, (t) => {
      t.deepEqual(set(target, query, value, { mutate, ...opts }), output)

      if (mutate && Array.isArray(target) === Array.isArray(output)) {
        t.deepEqual(target, output)
      }
    })
  },
)

each(
  [
    // `classes` and `inherited` options
    {
      target: getChild(),
      query: '*',
      value: 2,
      output: {
        ownEnum: 'ownEnum',
        ownNonEnum: 'ownNonEnum',
        inheritedEnum: 'inheritedEnum',
        inheritedNonEnum: 'inheritedNonEnum',
      },
    },
    {
      target: getChild(),
      query: '*',
      value: 2,
      opts: { classes: true, mutate: true },
      output: {
        ownEnum: 2,
        ownNonEnum: 'ownNonEnum',
        inheritedEnum: 'inheritedEnum',
        inheritedNonEnum: 'inheritedNonEnum',
      },
    },
    {
      target: getChild(),
      query: '*',
      value: 2,
      opts: { classes: true, inherited: true, mutate: true },
      output: {
        ownEnum: 2,
        ownNonEnum: 'ownNonEnum',
        inheritedEnum: 2,
        inheritedNonEnum: 'inheritedNonEnum',
      },
    },
  ],
  ({ title }, { target, query, value, opts, output }) => {
    test(`set() output | ${title}`, (t) => {
      const { ownEnum, ownNonEnum, inheritedEnum, inheritedNonEnum } = set(
        target,
        query,
        value,
        opts,
      )
      t.deepEqual(
        { ownEnum, ownNonEnum, inheritedEnum, inheritedNonEnum },
        output,
      )
    })
  },
)

each(
  [{ target: {}, query: '.', opts: { classes: true } }],
  ({ title }, { target, query, value, opts }) => {
    test(`set() validates its input | ${title}`, (t) => {
      t.throws(set.bind(undefined, target, query, value, opts))
    })
  },
)
/* eslint-enable max-lines */
