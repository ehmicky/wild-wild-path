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
  const { opts: optsA, pathArray, queryArrays } = normalizeArgs(query, opts)

  if (pathArray === undefined) {
    yield* iterateQuery(target, queryArrays, optsA)
    return
  }

  const { entry, matches } = getPathValue(target, pathArray, optsA)

  if (matches) {
    yield entry
  }
}

// Same but returned as an array.
// We do not just use [...iterate(...)] to optimize for performance when
// `query` is a path.
export const list = (target, query, opts) => {
  const { opts: optsA, pathArray, queryArrays } = normalizeArgs(query, opts)

  if (pathArray === undefined) {
    return [...iterateQuery(target, queryArrays, optsA)]
  }

  const { entry, matches } = getPathValue(target, pathArray, optsA)
  return matches ? [entry] : []
}

// Same but only the first item.
// We do not just use iterate(...).next().value to optimize for performance when
// `query` is a path.
export const get = (target, query, opts) => {
  const { opts: optsA, queryArrays, pathArray } = normalizeArgs(query, opts)

  if (pathArray === undefined) {
    return iterateQuery(target, queryArrays, optsA).next().value
  }

  const { entry, matches } = getPathValue(target, pathArray, optsA)
  return matches ? entry : undefined
}

const normalizeArgs = (query, opts) => {
  const optsA = getOptions(opts)
  const { pathArray, queryArrays } = normalizePathOrQuery(query)
  return { opts: optsA, pathArray, queryArrays }
}

// Distinguish between queries that are paths or not
export const normalizePathOrQuery = (query) => {
  try {
    return { pathArray: normalizePath(query) }
  } catch {
    return { queryArrays: normalizeQuery(query) }
  }
}
