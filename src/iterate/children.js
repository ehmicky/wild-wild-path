import { expandTokens } from './expand.js'
import { groupBy } from './group.js'

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

const shouldIterateChildren = (entries, parentEntry, { roots }) =>
  parentEntry === undefined || (entries.length !== 1 && !roots)

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

  const childEntriesGroups = groupSortChildEntries(childEntries, opts)

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

// We need to group entries by the last property to ensure `childFirst` order.
// Iteration is guaranteed to return child entries before parent ones, or not,
// depending on `childFirst`
//  - This is useful for recursive logic which must often be applied in a
//    specific parent-child order
// We also sort siblings when `sort` is true`
const groupSortChildEntries = (childEntries, { sort }) => {
  const childEntriesObj = groupBy(childEntries, getLastProp)
  return sort
    ? // eslint-disable-next-line fp/no-mutating-methods
      Object.keys(childEntriesObj)
        .sort()
        .map((prop) => childEntriesObj[prop])
    : Object.values(childEntriesObj)
}

const getLastProp = ({ path }) => path[path.length - 1]
