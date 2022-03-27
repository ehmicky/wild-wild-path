import { getChild } from '../helpers/inherited.js'
import { testListIterate } from '../helpers/list.js'

const child = getChild()

testListIterate([
  {
    target: child,
    query: 'ownEnum ownNonEnum inheritedEnum inheritedNonEnum',
    output: [],
  },
  { target: child, query: '/\\.*/', output: [] },
  { target: child, query: '*', output: [] },
  {
    target: child,
    query: 'ownEnum ownNonEnum inheritedEnum inheritedNonEnum',
    output: ['ownEnum', 'ownNonEnum', 'inheritedEnum', 'inheritedNonEnum'],
    opts: { classes: true },
  },
  {
    target: child,
    query: '/\\.*/',
    output: ['ownEnum'],
    opts: { classes: true },
  },
  {
    target: child,
    query: '*',
    output: ['ownEnum'],
    opts: { classes: true },
  },
  {
    target: child,
    query: 'ownEnum ownNonEnum inheritedEnum inheritedNonEnum',
    output: ['ownEnum', 'ownNonEnum', 'inheritedEnum', 'inheritedNonEnum'],
    opts: { classes: true, inherited: true },
  },
  {
    target: child,
    query: '/\\.*/',
    output: ['ownEnum', 'inheritedEnum'],
    opts: { classes: true, inherited: true },
  },
  {
    target: child,
    query: '*',
    output: ['ownEnum', 'inheritedEnum'],
    opts: { classes: true, inherited: true },
  },
])
