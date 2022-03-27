import { getChild } from '../helpers/inherited.js'
import { testListIterate } from '../helpers/list.js'

const child = getChild()

testListIterate([
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
