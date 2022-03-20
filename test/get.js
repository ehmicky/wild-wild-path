import test from 'ava'
import { each } from 'test-each'
import { get } from 'wild-wild-path'

import { getChild } from './helpers/inherited.js'

const child = getChild()

each(
  [
    // Main usage
    { target: { one: 1 }, query: 'one', output: 1 },
    { target: { one: 1, two: 2 }, query: '*', output: 1 },
    { target: { one: 1 }, query: 'two', output: undefined },
    { target: { one: undefined }, query: 'one', output: undefined },
    { target: { one: 1 }, query: [/one/u], output: 1 },

    // `entries` option
    {
      target: { one: 1 },
      query: 'two',
      opts: { entries: true },
      output: undefined,
    },
    {
      target: { one: 1 },
      query: 'one',
      opts: { entries: true },
      output: { value: 1, path: ['one'], missing: false },
    },

    // `childFirst`, `leaves` and `roots` options
    { target: { one: { two: 2 } }, query: 'one one.two', output: { two: 2 } },
    {
      target: { one: { two: 2 } },
      query: 'one one.two',
      opts: { childFirst: true },
      output: 2,
    },
    {
      target: { one: { two: 2 } },
      query: 'one one.two',
      opts: { leaves: true },
      output: 2,
    },
    {
      target: { one: { two: 2 } },
      query: 'one one.two',
      opts: { roots: true, childFirst: true },
      output: { two: 2 },
    },

    // `sort` option
    { target: { two: 2, one: 1 }, query: 'two one', output: 2 },
    {
      target: { two: 2, one: 1 },
      query: 'two one',
      opts: { sort: true },
      output: 1,
    },

    // `classes` and `inherited` options
    {
      target: child,
      query: 'ownEnum ownNonEnum inheritedEnum inheritedNonEnum',
      output: undefined,
    },
    {
      target: child,
      query: 'ownEnum',
      output: 'ownEnum',
      opts: { classes: true },
    },
    {
      target: child,
      query: 'ownNonEnum',
      output: 'ownNonEnum',
      opts: { classes: true },
    },
    {
      target: child,
      query: 'inheritedEnum',
      output: 'inheritedEnum',
      opts: { classes: true },
    },
    {
      target: child,
      query: 'inheritedNonEnum',
      output: 'inheritedNonEnum',
      opts: { classes: true },
    },
    {
      target: child,
      query: '/inherited/',
      output: undefined,
      opts: { classes: true },
    },
    {
      target: child,
      query: '/inherited/',
      output: 'inheritedEnum',
      opts: { classes: true, inherited: true },
    },
  ],
  ({ title }, { target, query, opts, output }) => {
    test(`get() output | ${title}`, (t) => {
      t.deepEqual(get(target, query, opts), output)
    })
  },
)

each([{ target: {}, query: [true] }], ({ title }, { target, query, opts }) => {
  test(`get() validates its input | ${title}`, (t) => {
    t.throws(get.bind(undefined, target, query, opts))
  })
})
