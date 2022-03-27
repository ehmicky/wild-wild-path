import isPlainObj from 'is-plain-obj'

// Whether a property is considered an object that can:
//  - Be recursed over
//  - Be cloned with `{...}`
//     - Therefore we do not allow class instances
// Values that are not recursed are considered atomic, like simple types, i.e.:
//  - Properties, even if they exist, will be considered missing
//     - With tokens like *, no entries will be returned
//  - Setting will override the value, not merge it
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
  return classes ? isAnyObj(value) : isPlainObj(value)
}

const isAnyObj = function (value) {
  const typeofValue = typeof value
  return (
    (typeofValue === 'object' || typeofValue === 'function') && value !== null
  )
}
