import { isAllowedProp } from './expand.js'
import { MISSING_HANDLERS } from './missing.js'

// Performance-optimized `iterate()` logic when the query is a path
export const getPathValue = (
  target,
  pathArray,
  { missing: missingOpt, entries },
) => {
  const { value, missing, forbidden } = getDeepValue(target, pathArray)

  if (missing && (forbidden || !missingOpt)) {
    return { matches: false }
  }

  const entry = entries ? { value, path: pathArray, missing } : value
  return { entry, matches: true }
}

const getDeepValue = (value, pathArray) => {
  // eslint-disable-next-line fp/no-loops
  for (const prop of pathArray) {
    // eslint-disable-next-line max-depth
    if (!isAllowedProp(prop)) {
      return { value: undefined, missing: true, forbidden: true }
    }

    // eslint-disable-next-line max-depth
    if (!isPresent(value, prop)) {
      return { value: undefined, missing: true, forbidden: false }
    }

    // eslint-disable-next-line no-param-reassign, fp/no-mutation
    value = value[prop]
  }

  return { value, missing: false, forbidden: false }
}

const isPresent = (value, prop) => {
  if (typeof prop === 'string') {
    return isPresentProp(value) && prop in value
  }

  return isPresentIndex(value) && prop < value.length
}

const {
  array: { isPresent: isPresentIndex },
  weakObject: { isPresent: isPresentProp },
} = MISSING_HANDLERS
