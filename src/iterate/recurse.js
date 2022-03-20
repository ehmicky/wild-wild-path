import { getTokenType } from '../tokens/main.js'

// Some tokens are recursive. Those are expanded iteratively at each level.
export const expandRecursiveTokens = function (entries, index) {
  return entries.flatMap((entry) => expandRecursiveToken(entry, index))
}

const expandRecursiveToken = function (entry, index) {
  const token = entry.queryArray[index]

  if (token === undefined) {
    return entry
  }

  const tokenType = getTokenType(token)

  if (tokenType.recurse === undefined) {
    return entry
  }

  const queryArrays = tokenType.recurse(entry.queryArray, index)
  return queryArrays.map((queryArray) => ({ ...entry, queryArray }))
}
