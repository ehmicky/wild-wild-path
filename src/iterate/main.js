import { normalizeQuery } from 'wild-wild-parser'

import { iterateChildEntries } from './children.js'
import { removeDuplicates } from './duplicate.js'
import { getOptions } from './options.js'
import { expandRecursiveTokens } from './recurse.js'

// Iterate over all values (and their associated path) matching a specific
// query for on specific target value.
// Uses an iterator:
//  - To allow consumers to return only the first matching entry quickly
//  - To keep memory consumption low even on big queries
export const iterate = function* (target, query, opts) {
  const optsA = getOptions(opts)
  const parents = new Set([])
  const entries = getRootEntries(target, query)
  yield* iterateLevel({ entries, index: 0, parents, opts: optsA })
}

const getRootEntries = function (target, query) {
  const queryArrays = normalizeQuery(query)
  return queryArrays.map((queryArray) => ({
    queryArray,
    value: target,
    path: [],
    missing: false,
  }))
}

// `parents` is used to prevent infinite recursions when using ** together with
// a value that includes references to itself
const iterateLevel = function* ({
  entries,
  entries: [{ value, missing }],
  index,
  parents,
  opts,
}) {
  if (missing) {
    yield* iterateToken({ entries, index, parents, opts })
    return
  }

  if (parents.has(value)) {
    return
  }

  parents.add(value)
  yield* iterateToken({ entries, index, parents, opts })
  parents.delete(value)
}

// The `roots` option can be used to only include the highest ancestors.
// The `leaves` option can be used to only include the lowest descendants.
// Neither option includes the values in-between.
const iterateToken = function* ({ entries, index, parents, opts }) {
  const entriesA = expandRecursiveTokens(entries, index)
  const entriesB = removeDuplicates(entriesA)
  const parentEntry = getParentEntry(entriesB, index, opts)

  if (shouldYieldParentFirst(parentEntry, opts)) {
    yield parentEntry
  }

  const hasChildren = yield* iterateChildEntries({
    entries: entriesB,
    parentEntry,
    index,
    parents,
    opts,
    iterateLevel,
  })

  if (shouldYieldParentLast(parentEntry, hasChildren, opts)) {
    yield parentEntry
  }
}

const getParentEntry = function (entries, index, opts) {
  const parentEntry = entries.find(
    ({ queryArray }) => queryArray.length === index,
  )
  return parentEntry === undefined
    ? undefined
    : normalizeEntry(parentEntry, opts)
}

const normalizeEntry = function ({ value, path, missing }, { entries }) {
  return entries ? { value, path, missing } : value
}

const shouldYieldParentFirst = function (parentEntry, { childFirst }) {
  return parentEntry !== undefined && !childFirst
}

const shouldYieldParentLast = function (
  parentEntry,
  hasChildren,
  { childFirst, leaves },
) {
  return parentEntry !== undefined && childFirst && !(leaves && hasChildren)
}
