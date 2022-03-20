import { expandTokens } from './expand.js'
import { groupSortChildEntries } from './group.js'

// Iterate over child entries
export const iterateChildEntries = function* ({
  entries,
  parentEntry,
  index,
  parents,
  opts,
  iterateLevel,
}) {
  if (!shouldIterateChildren(entries, parentEntry, opts)) {
    return false
  }

  // eslint-disable-next-line fp/no-let
  let hasChildren = false

  // eslint-disable-next-line fp/no-loops
  for (const childEntry of iterateChildren({
    entries,
    index,
    parents,
    opts,
    iterateLevel,
  })) {
    // eslint-disable-next-line fp/no-mutation
    hasChildren = true
    yield childEntry
  }

  return hasChildren
}

const shouldIterateChildren = function (entries, parentEntry, { roots }) {
  return parentEntry === undefined || (entries.length !== 1 && !roots)
}

const iterateChildren = function* ({
  entries,
  index,
  parents,
  opts,
  iterateLevel,
}) {
  const childEntries = expandTokens(entries, index, opts)

  if (childEntries.length === 0) {
    return
  }

  const indexA = index + 1

  if (childEntries.length === 1) {
    yield* iterateLevel({ entries: childEntries, index: indexA, parents, opts })
    return
  }

  const childEntriesGroups = groupSortChildEntries(childEntries, opts.sort)

  // eslint-disable-next-line fp/no-loops
  for (const childEntriesA of childEntriesGroups) {
    yield* iterateLevel({
      entries: childEntriesA,
      index: indexA,
      parents,
      opts,
    })
  }
}
