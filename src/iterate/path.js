import { iterateChildEntries } from './path_children.js'

// `iterate()` logic when the query is path
export const iteratePath = function* (target, pathArray, opts) {
  const entries = getRootEntries(target, pathArray)
  yield* iterateLevel(entries, 0, opts)
}

const getRootEntries = function (target, pathArray) {
  return [{ pathArray, value: target, missing: false }]
}

// The `roots` option can be used to only include the highest ancestors.
// The `leaves` option can be used to only include the lowest descendants.
// Neither option includes the values in-between.
const iterateLevel = function* (entries, index, opts) {
  const parentEntry = getParentEntry(entries, index)

  if (shouldYieldParentFirst(parentEntry, opts)) {
    yield normalizeEntry(parentEntry, opts)
  }

  const hasChildren = yield* iterateChildEntries({
    entries,
    parentEntry,
    index,
    opts,
    iterateLevel,
  })

  if (shouldYieldParentLast(parentEntry, hasChildren, opts)) {
    yield normalizeEntry(parentEntry, opts)
  }
}

const getParentEntry = function (entries, index) {
  return entries.find(({ pathArray }) => pathArray.length === index)
}

const normalizeEntry = function ({ value, pathArray, missing }, { entries }) {
  return entries ? { value, path: pathArray, missing } : value
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
