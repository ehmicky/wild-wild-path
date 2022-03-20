import { getArrayIndex } from './array.js'

// Use the token to list entries against a target value.
const iterate = function (value, { from, to }) {
  const fromIndex = getBoundedIndex(value, from)
  const toIndex = Math.max(getBoundedIndex(value, to), fromIndex)
  return new Array(toIndex - fromIndex).fill().map((_, index) => ({
    value: value[index + fromIndex],
    prop: index + fromIndex,
    missing: false,
  }))
}

// Unlike the array token, indices are max-bounded to the end of the array:
//  - This prevents maliciously creating big arrays to crash the process
//  - Appending values is less useful in the context of a slice
const getBoundedIndex = function (value, edge) {
  const index = getArrayIndex(value, edge)
  return Math.min(index, value.length)
}

export const SLICE_TOKEN = {
  name: 'slice',
  valueType: 'array',
  iterate,
}
