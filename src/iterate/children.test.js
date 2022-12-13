import { getChild } from '../helpers/inherited.test.js'
import { testListOutput } from '../helpers/list.test.js'

const child = getChild()

const functionObject = () => {}
// eslint-disable-next-line fp/no-mutation
functionObject.one = 1

const nullObject = Object.create(null)
// eslint-disable-next-line fp/no-mutation
nullObject.one = 1

const arrayObject = []
// eslint-disable-next-line fp/no-mutation
arrayObject.one = 1

testListOutput([
  {
    input: [child, 'ownEnum ownNonEnum inheritedEnum inheritedNonEnum'],
    output: ['ownEnum', 'ownNonEnum', 'inheritedEnum', 'inheritedNonEnum'],
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
  { input: [nullObject, '*'], output: [1] },
  { input: [nullObject, '*', { classes: true }], output: [1] },
  { input: [arrayObject, '/one/'], output: [] },
  { input: [arrayObject, '/one/', { classes: true }], output: [1] },
])
