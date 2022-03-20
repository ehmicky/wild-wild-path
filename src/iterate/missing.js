import isPlainObj from 'is-plain-obj'

import { getTokenType } from '../tokens/main.js'

// When the value does not exist, we set it deeply with `set()` but not with
// `list|get|has()`.
// We filter out between those two cases using a `missing` property.
// We distinguish between missing properties that are:
//  - known, i.e. returned: prop|index|slice tokens
//  - unknown, i.e. not returned: any|regexp tokens
// Tokens like wildcards cannot do this since there is known property to add.
// Non-enumerable properties:
//  - Are not listed by token types returning multiple entries like *
//  - But are handled by the other ones
// Inherited properties are ignored by all token types if `inherited` is `false`
//  - This avoids potentially mutating deep properties shared by other instances
export const getMissingValue = function (value, prop, { missing, classes }) {
  return missing ? handleMissingValue(value, prop, classes).value : value
}

export const handleMissingValue = function (value, token, classes) {
  const tokenType = getTokenType(token)
  const { isPresent, defaultValue } = MISSING_HANDLERS[tokenType.valueType]
  const missing = !isPresent(value, classes)
  const valueA = missing ? defaultValue : value
  return { tokenType, missing, value: valueA }
}

const MISSING_HANDLERS = {
  any: {
    isPresent(value, classes) {
      return isRecurseObject(value, classes) || Array.isArray(value)
    },
    defaultValue: {},
  },
  array: {
    isPresent: Array.isArray,
    defaultValue: [],
  },
  object: {
    isPresent(value, classes) {
      return isRecurseObject(value, classes)
    },
    defaultValue: {},
  },
}

// Whether a property is considered an object that can:
//  - Be recursed over
//  - Be cloned with `{...}`
//     - Therefore we do not allow class instances
// Values that are not recursed are considered atomic, like simple types, i.e.:
//  - Properties, even if they exist, will be considered missing
//     - With tokens like *, no entries will be returned
//  - Setting will override the value, not merge it
// This must return `false` for arrays.
// By default, we only consider plain objects
//  - Excluding:
//     - Class instances, including native ones (RegExp, Error, etc.)
//     - `Object.create({})`
//     - `import * as object from ...` (`Module` instance)
//  - This is because only plain objects are clonable, i.e. do not require
//    `mutate` to be `true`
const isRecurseObject = function (value, classes) {
  return classes
    ? typeof value === 'object' && value !== null
    : isPlainObj(value)
}
