import { has } from 'wild-wild-path'

import { getChild } from './helpers/inherited.js'
import { testOutput } from './helpers/output.js'
import { testValidation } from './helpers/validate.js'

const child = getChild()

testOutput(
  [{ name: 'has', method: has }],
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
)

testValidation([{ name: 'has', method: has }], [[{}, [true]]])
