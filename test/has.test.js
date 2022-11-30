import { has } from 'wild-wild-path'

import { getChild } from './helpers/inherited.test.js'
import { testOutput } from './helpers/output.test.js'
import { testValidation } from './helpers/validate.test.js'

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

    // `shallowArrays` option
    { input: [[0], '*'], output: true },
    { input: [[0], '*', { shallowArrays: true }], output: false },

    // `classes` and `inherited` options
    { input: [child, 'ownEnum'], output: true },
    { input: [child, 'ownNonEnum'], output: true },
    { input: [child, 'inheritedEnum'], output: true },
    { input: [child, 'inheritedNonEnum'], output: true },
    { input: [child, '/ownEnum/'], output: false },
    { input: [child, '/ownNonEnum/'], output: false },
    { input: [child, '/inheritedEnum/'], output: false },
    { input: [child, '/inheritedNonEnum/'], output: false },
    { input: [child, '/ownEnum/', { classes: true }], output: true },
    { input: [child, '/ownNonEnum/', { classes: true }], output: false },
    { input: [child, '/inheritedEnum/', { classes: true }], output: false },
    { input: [child, '/inheritedNonEnum/', { classes: true }], output: false },
    {
      input: [child, '/inheritedEnum/', { classes: true, inherited: true }],
      output: true,
    },
    {
      input: [child, '/inheritedNonEnum/', { classes: true, inherited: true }],
      output: false,
    },
  ],
)

testValidation([{ name: 'has', method: has }], [[{}, [true]]])
