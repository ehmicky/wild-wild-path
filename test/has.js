import test from 'ava'
import { each } from 'test-each'
import { has } from 'wild-wild-path'

import { getChild } from './helpers/inherited.js'

const child = getChild()

each(
  [
    // Main usage
    { target: { one: 1 }, query: 'one', output: true },
    { target: { one: 1, two: 2 }, query: '*', output: true },
    { target: { one: 1 }, query: 'two', output: false },
    { target: { one: undefined }, query: 'one', output: true },

    // `classes` and `inherited` options
    {
      target: child,
      query: 'ownEnum ownNonEnum inheritedEnum inheritedNonEnum',
      output: false,
    },
    {
      target: child,
      query: 'inheritedEnum inheritedNonEnum',
      output: false,
      opts: { classes: true },
    },
    { target: child, query: 'ownEnum', output: true, opts: { classes: true } },
    {
      target: child,
      query: 'ownNonEnum',
      output: true,
      opts: { classes: true },
    },
    {
      target: child,
      query: 'ownEnum',
      output: true,
      opts: { classes: true, inherited: true },
    },
    {
      target: child,
      query: 'ownNonEnum',
      output: true,
      opts: { classes: true, inherited: true },
    },
    {
      target: child,
      query: 'inheritedEnum',
      output: true,
      opts: { classes: true, inherited: true },
    },
    {
      target: child,
      query: 'inheritedNonEnum',
      output: true,
      opts: { classes: true, inherited: true },
    },
  ],
  ({ title }, { target, query, opts, output }) => {
    test(`has() output | ${title}`, (t) => {
      t.deepEqual(has(target, query, opts), output)
    })
  },
)
