import { isSameToken } from 'wild-wild-parser'

// Remove duplicate entries
export const removeDuplicates = function (entries) {
  return entries.length === 1 ? entries : entries.filter(isNotDuplicate)
}

const isNotDuplicate = function (entryA, index, entries) {
  return entries.every(
    (entryB, indexB) => index <= indexB || !isDuplicate(entryA, entryB),
  )
}

// `entryA.path` always equals `entryB.path` so we do not need to check
const isDuplicate = function (
  { queryArray: queryArrayA, path: pathA },
  { queryArray: queryArrayB },
) {
  return (
    queryArrayA.length === queryArrayB.length &&
    queryArrayA.every(
      (tokenA, index) =>
        index < pathA.length || isSameToken(tokenA, queryArrayB[index]),
    )
  )
}
