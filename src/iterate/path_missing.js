import { getTokenType } from '../tokens/main.js'

import { isWeakObject } from './object.js'

export const handleMissingValue = function (value, token, classes) {
  const tokenType = getTokenType(token)
  const { isPresent, getDefaultValue } = MISSING_HANDLERS[tokenType.valueType]
  const missing = !isPresent(value, classes)
  const valueA = missing ? getDefaultValue() : value
  return { missing, value: valueA }
}

const getDefaultObject = function () {
  return {}
}

const getDefaultArray = function () {
  return []
}

const MISSING_HANDLERS = {
  array: {
    isPresent: Array.isArray,
    getDefaultValue: getDefaultArray,
  },
  weakObject: {
    isPresent: isWeakObject,
    getDefaultValue: getDefaultObject,
  },
}
