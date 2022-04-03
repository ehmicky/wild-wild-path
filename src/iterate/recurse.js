import { getTokenType } from '../tokens/main.js'

// Some tokens are recursive. Those are expanded iteratively at each level.
export const expandRecursiveTokens = function (entries, index) {
  const recurseFuncs = entries.map((entry) => getRecurseFunc(entry, index))
  return recurseFuncs.some(Boolean)
    ? entries.flatMap((entry, entryIndex) =>
        expandRecursiveToken(entry, recurseFuncs[entryIndex], index),
      )
    : entries
}

const getRecurseFunc = function (entry, index) {
  const token = entry.queryArray[index]
  return token === undefined ? undefined : getTokenType(token).recurse
}

const expandRecursiveToken = function (entry, recurseFunc, index) {
  if (recurseFunc === undefined) {
    return entry
  }

  const queryArrays = recurseFunc(entry.queryArray, index)
  return queryArrays.map((queryArray) => ({ ...entry, queryArray }))
}
