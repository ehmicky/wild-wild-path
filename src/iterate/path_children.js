import { expandTokens } from './path_expand.js'

// Iterate over child entries
export const iterateChildEntries = function* ({
  entries,
  parentEntry,
  index,
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

const iterateChildren = function* ({ entries, index, opts, iterateLevel }) {
  const childEntries = expandTokens(entries, index, opts)

  if (childEntries.length === 0) {
    return
  }

  yield* iterateLevel(childEntries, index + 1, opts)
}
