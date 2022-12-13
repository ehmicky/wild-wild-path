import isPlainObj from 'is-plain-obj'

// Just like non-enumerable and inherited properties, properties of objects that
// are not plain objects are ignored by token types returning multiple entries
// (like *) unless opted in with `classes` `true`.
// This is because:
//  - Recursing over them might be unexpected, especially with **
//  - Only plain objects are clonable, i.e. do not require `mutate` to be `true`
// This does not apply to other token types, notably props and indices.
//  - Those carry a stronger indication that user intends to retrieve those
//    specific properties
// Objects that are not object objects include:
//  - Class instances, including native ones (RegExp, Error, etc.)
//  - Function objects
//  - Arrays used as objects
//  - `Object.create({})`
//  - `import * as object from ...` (`Module` instance)
// This is exported, but undocumented, for any consumers which might want to
// recurse on the input|output and still be consistent with the `classes`
// option.
export const isObject = (value, classes) =>
  classes ? isWeakObject(value) : isPlainObj(value)

export const isWeakObject = (value) => {
  const typeofValue = typeof value
  return (
    (typeofValue === 'object' || typeofValue === 'function') && value !== null
  )
}
