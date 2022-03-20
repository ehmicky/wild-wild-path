import test from 'ava'
import { each } from 'test-each'

import { listMethods } from '../helpers/list.js'

/* eslint-disable fp/no-class, fp/no-this, fp/no-mutation,
   fp/no-mutating-methods */
class Parent {}

Parent.prototype.inheritedEnum = 'inheritedEnum'
Object.defineProperty(Parent.prototype, 'inheritedNonEnum', {
  value: 'inheritedNonEnum',
})

class Child extends Parent {
  constructor() {
    super()
    this.ownEnum = 'ownEnum'
    Object.defineProperty(this, 'ownNonEnum', { value: 'ownNonEnum' })
  }
}
/* eslint-enable fp/no-class, fp/no-this, fp/no-mutation,
   fp/no-mutating-methods */

const child = new Child()

each(
  listMethods,
  [
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
      output: ['ownEnum', 'ownNonEnum'],
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
  ],
  ({ title }, list, { target, query, opts, output }) => {
    test(`list|iterate() output | ${title}`, (t) => {
      t.deepEqual(list(target, query, opts), output)
    })
  },
)
