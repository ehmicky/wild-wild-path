import { isSamePath, isSameToken } from 'wild-wild-parser'

// Remove duplicate entries
export const removeDuplicates = function (entries) {
  return entries.length === 1 ? entries : entries.filter(isNotDuplicate)
}

const isNotDuplicate = function (entryA, index, entries) {
  return entries.every(
    (entryB, indexB) => index <= indexB || !isDuplicate(entryA, entryB),
  )
}

const isDuplicate = function (
  { path: pathA, queryArray: queryArrayA },
  { path: pathB, queryArray: queryArrayB },
) {
  return (
    isSamePath(pathA, pathB) &&
    queryArrayA.length === queryArrayB.length &&
    queryArrayA.every(
      (tokenA, index) =>
        index < pathA.length || isSameToken(tokenA, queryArrayB[index]),
    )
  )
}
