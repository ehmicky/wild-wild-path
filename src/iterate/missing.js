import { getTokenType } from '../tokens/main.js'

import { isObject } from './object.js'

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
// The same applies to inherited properties if `inherited` is `false`
//  - This avoids unintentionally mutating deep properties shared by other
//    instances,
//  - While still allowing intentionally getting|settting them with `prop` names
//  - Also, even if they were ignored by the `prop` token type, the current
//    `set()` logic would set them anyway, since missing entries are set by
//    default
export const getMissingValue = function (value, prop, { missing, classes }) {
  return missing ? handleMissingValue(value, prop, classes).value : value
}

export const handleMissingValue = function (value, token, classes) {
  const tokenType = getTokenType(token)
  const { isPresent, getDefaultValue } = MISSING_HANDLERS[tokenType.valueType]
  const missing = !isPresent(value, classes)
  const valueA = missing ? getDefaultValue() : value
  return { tokenType, missing, value: valueA }
}

const MISSING_HANDLERS = {
  any: {
    isPresent(value, classes) {
      return isObject(value, classes) || Array.isArray(value)
    },
    // New values must always be returned since those might be mutated either
    // by the `mutate` option or by the consumer
    getDefaultValue() {
      return {}
    },
  },
  array: {
    isPresent: Array.isArray,
    getDefaultValue() {
      return []
    },
  },
  object: {
    isPresent(value, classes) {
      return isObject(value, classes)
    },
    getDefaultValue() {
      return {}
    },
  },
}
