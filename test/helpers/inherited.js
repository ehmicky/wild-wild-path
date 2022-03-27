// eslint-disable-next-line ava/no-ignored-test-files
import test from 'ava'
import { each } from 'test-each'

// Retrieve objects with both:
//  - Enumerated and non-enumerated properties
//  - Own and inherited properties
export const getChild = function () {
  return new Child()
}

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

// Test those properties
export const testInherited = function (methods, inputs) {
  each(methods, inputs, testInheritedSingle)
}

const testInheritedSingle = function (
  { title },
  { name, method },
  { input, output },
) {
  test(`${name}() output | ${title}`, (t) => {
    testChildProps(t, method(...input), output)
  })
}

const testChildProps = function (
  t,
  { ownEnum, ownNonEnum, inheritedEnum, inheritedNonEnum },
  output,
) {
  t.deepEqual(
    { ownEnum, ownNonEnum, inheritedEnum, inheritedNonEnum },
    {
      ownEnum: 'ownEnum',
      ownNonEnum: 'ownNonEnum',
      inheritedEnum: 'inheritedEnum',
      inheritedNonEnum: 'inheritedNonEnum',
      ...output,
    },
  )
}
