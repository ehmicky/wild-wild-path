import { getChild } from '../helpers/inherited.js'
import { testListOutput } from '../helpers/list.js'

const child = getChild()

const functionObject = function () {}
// eslint-disable-next-line fp/no-mutation
functionObject.one = 1

testListOutput([
  {
    input: [child, 'ownEnum ownNonEnum inheritedEnum inheritedNonEnum'],
    output: [],
  },
  { input: [child, '/\\.*/'], output: [] },
  { input: [child, '*'], output: [] },
  {
    input: [
      child,
      'ownEnum ownNonEnum inheritedEnum inheritedNonEnum',
      { classes: true },
    ],
    output: ['ownEnum', 'ownNonEnum', 'inheritedEnum', 'inheritedNonEnum'],
  },
  { input: [child, '/\\.*/', { classes: true }], output: ['ownEnum'] },
  { input: [child, '*', { classes: true }], output: ['ownEnum'] },
  {
    input: [
      child,
      'ownEnum ownNonEnum inheritedEnum inheritedNonEnum',
      { classes: true, inherited: true },
    ],
    output: ['ownEnum', 'ownNonEnum', 'inheritedEnum', 'inheritedNonEnum'],
  },
  {
    input: [child, '/\\.*/', { classes: true, inherited: true }],
    output: ['ownEnum', 'inheritedEnum'],
  },
  {
    input: [child, '*', { classes: true, inherited: true }],
    output: ['ownEnum', 'inheritedEnum'],
  },
  { input: [functionObject, '*'], output: [] },
  { input: [functionObject, '*', { classes: true }], output: [1] },
])
