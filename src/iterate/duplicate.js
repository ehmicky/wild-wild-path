import { isSameToken } from 'wild-wild-parser'

// Remove duplicate entries
export const removeDuplicates = (entries) =>
  entries.length === 1 ? entries : entries.filter(isNotDuplicate)

const isNotDuplicate = (entryA, index, entries) =>
  entries.every(
    (entryB, indexB) => index <= indexB || !isDuplicate(entryA, entryB),
  )

// `entryA.path` always equals `entryB.path` so we do not need to check
const isDuplicate = (
  { queryArray: queryArrayA, path: pathA },
  { queryArray: queryArrayB },
) =>
  queryArrayA.length === queryArrayB.length &&
  queryArrayA.every(
    (tokenA, index) =>
      index < pathA.length || isSameToken(tokenA, queryArrayB[index]),
  )
