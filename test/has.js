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
