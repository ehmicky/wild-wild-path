import { getTokenType as getTokenTypeName } from 'wild-wild-parser'

// Handle ** recursion.
// It matches 0, 1 or more levels.
//  - It can match 0 levels, i.e. the current object
// It is the same as the union of . * *.* *.*.* and so on.
// Using both * and ** can express minimum depth, e.g. *.** or *.*.**
const recurse = function (queryArray, index) {
  const parentQuery = queryArray.slice(0, index)
  const lastIndex = getLastIndex(queryArray, index)
  return [
    [...parentQuery, ...queryArray.slice(lastIndex + 1)],
    [...parentQuery, { type: 'any' }, ...queryArray.slice(lastIndex)],
  ]
}

// Squash consecutive ** into a single one
const getLastIndex = function (queryArray, index) {
  return index <= queryArray.length - 1 &&
    getTokenTypeName(queryArray[index]) === 'anyDeep'
    ? getLastIndex(queryArray, index + 1)
    : index - 1
}

export const ANY_DEEP_TOKEN = {
  name: 'anyDeep',
  array: false,
  recurse,
}
