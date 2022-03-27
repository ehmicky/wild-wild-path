import { getChild } from '../helpers/inherited.js'
import { listMethods } from '../helpers/list.js'
import { testOutput } from '../helpers/output.js'

const child = getChild()

testOutput(listMethods, [
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
])
