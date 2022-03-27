import test from 'ava'
import { each } from 'test-each'
import { has } from 'wild-wild-path'

import { getChild } from './helpers/inherited.js'

const child = getChild()

each(
  [
    // Main usage
    { input: [{ one: 1 }, 'one'], output: true },
    { input: [{ one: 1, two: 2 }, '*'], output: true },
    { input: [{ one: 1 }, 'two'], output: false },
    { input: [{ one: undefined }, 'one'], output: true },
    { input: [{ one: 1 }, [/one/u]], output: true },

    // `classes` and `inherited` options
    {
      input: [child, 'ownEnum ownNonEnum inheritedEnum inheritedNonEnum'],
      output: false,
    },
    { input: [child, 'ownEnum', { classes: true }], output: true },
    { input: [child, 'ownNonEnum', { classes: true }], output: true },
    { input: [child, 'inheritedEnum', { classes: true }], output: true },
    { input: [child, 'inheritedNonEnum', { classes: true }], output: true },
    { input: [child, '/inherited/', { classes: true }], output: false },
    {
      input: [child, '/inherited/', { classes: true, inherited: true }],
      output: true,
    },
  ],
  ({ title }, { input, output }) => {
    test(`has() output | ${title}`, (t) => {
      t.deepEqual(has(...input), output)
    })
  },
)

each([[{}, [true]]], ({ title }, input) => {
  test(`has() validates its input | ${title}`, (t) => {
    t.throws(has.bind(undefined, ...input))
  })
})
