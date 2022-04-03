import moize from 'moize'
import { normalizePath, normalizeQuery } from 'wild-wild-parser'

import { getOptions } from './options.js'
import { getPathValue } from './path.js'
import { iterateQuery } from './query.js'

// Iterate over all values (and their associated path) matching a specific
// query for on specific target value.
// Uses an iterator:
//  - To allow consumers to return only the first matching entry quickly
//  - To keep memory consumption low even on big queries
export const iterate = function* (target, query, opts) {
  const optsA = getOptions(opts)
  const { pathArray, queryArrays } = mNormalizePathOrQuery(query)
  yield* pathArray === undefined
    ? iterateQuery(target, queryArrays, optsA)
    : iteratePath(target, pathArray, optsA)
}

// Same but returned as an array.
// We do not just use [...iterate(...)] to optimize for performance when
// `query` is a path.
export const list = function (target, query, opts) {
  const optsA = getOptions(opts)
  const { pathArray, queryArrays } = mNormalizePathOrQuery(query)
  return pathArray === undefined
    ? [...iterateQuery(target, queryArrays, optsA)]
    : listPath(target, pathArray, optsA)
}

// Same but only the first item.
// We do not just use iterate(...).next().value to optimize for performance when
// `query` is a path.
export const get = function (target, query, opts) {
  const optsA = getOptions(opts)
  const { pathArray, queryArrays } = mNormalizePathOrQuery(query)
  return pathArray === undefined
    ? iterateQuery(target, queryArrays, optsA).next().value
    : listPath(target, pathArray, optsA)[0]
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

const iteratePath = function* (target, pathArray, opts) {
  const { entry, matches } = getPathValue(target, pathArray, opts)

  if (matches) {
    yield entry
  }
}

const listPath = function (target, pathArray, opts) {
  const { entry, matches } = getPathValue(target, pathArray, opts)
  return matches ? [entry] : []
}
