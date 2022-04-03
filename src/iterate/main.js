import moize from 'moize'
import { normalizePath, normalizeQuery } from 'wild-wild-parser'

import { getOptions } from './options.js'
import { iteratePath } from './path.js'
import { iterateQuery } from './query.js'

// Iterate over all values (and their associated path) matching a specific
// query for on specific target value.
// Uses an iterator:
//  - To allow consumers to return only the first matching entry quickly
//  - To keep memory consumption low even on big queries
export const iterate = function* (target, query, opts) {
  const optsA = getOptions(opts)
  const { queryArrays, pathArray } = mNormalizePathOrQuery(query)
  yield* pathArray === undefined
    ? iterateQuery(target, queryArrays, optsA)
    : iteratePath(target, pathArray, optsA)
}

// Distinguish between queries that are paths or not
const normalizePathOrQuery = function (query) {
  try {
    return { pathArray: normalizePath(query) }
  } catch {
    return { queryArrays: normalizeQuery(query) }
  }
}

// Due to memoization, `entry.path[*]` items should not be mutated by consumers
const mNormalizePathOrQuery = moize(normalizePathOrQuery, { maxSize: 1e3 })
