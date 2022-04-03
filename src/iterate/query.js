import { iterateChildEntries } from './children.js'
import { removeDuplicates } from './duplicate.js'
import { expandRecursiveTokens } from './recurse.js'

// `iterate()` logic when the query is not a path
export const iterateQuery = function* (target, queryArrays, opts) {
  const parents = new Set([])
  const entries = getRootEntries(target, queryArrays)
  yield* iterateLevel({ entries, index: 0, parents, opts })
}

const getRootEntries = function (target, queryArrays) {
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
  const parentEntry = getParentEntry(entriesB, index)

  if (shouldYieldParentFirst(parentEntry, opts)) {
    yield normalizeEntry(parentEntry, opts)
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
    yield normalizeEntry(parentEntry, opts)
  }
}

const getParentEntry = function (entries, index) {
  return entries.find(({ queryArray }) => queryArray.length === index)
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
