import isPlainObj from 'is-plain-obj'

// Whether a property is considered an object that can be returned by token
// types returning multiple entries like *
//  - Similarly to how enumerable and inherited properties are handled
//  - This ensures using property names still works, since users would expect it
// Values that are not recursed are considered atomic, like simple types, i.e.:
//  - Properties, even if they exist, will not be returned
// Unless `classes` is `true`, we only consider plain objects:
//  - Excluding:
//     - Class instances, including native ones (RegExp, Error, etc.)
//     - Function objects
//     - Arrays used as objects
//     - `Object.create({})`
//     - `import * as object from ...` (`Module` instance)
//  - This is because only plain objects are clonable, i.e. do not require
//    `mutate` to be `true`
// This is exported, but undocumented, for any consumers which might want to
// recurse on the input|output and still be consistent with the `classes`
// option.
export const isObject = function (value, classes) {
  return classes ? isWeakObject(value) : isPlainObj(value)
}

export const isWeakObject = function (value) {
  const typeofValue = typeof value
  return (
    (typeofValue === 'object' || typeofValue === 'function') && value !== null
  )
}
