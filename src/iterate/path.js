import { isAllowedProp } from './expand.js'
import { MISSING_HANDLERS } from './missing.js'

// Performance-optimized `iterate()` logic when the query is a path
export const getPathValue = function (
  target,
  pathArray,
  { missing: missingOpt, entries },
) {
  const { value, missing } = getDeepValue(target, pathArray)

  if (missing && !missingOpt) {
    return { matches: false }
  }

  const entry = entries ? { value, path: pathArray, missing } : value
  return { entry, matches: true }
}

const getDeepValue = function (value, pathArray) {
  // eslint-disable-next-line fp/no-loops
  for (const prop of pathArray) {
    // eslint-disable-next-line max-depth
    if (!isPresent(value, prop) || !isAllowedProp(prop)) {
      return { value: undefined, missing: true }
    }

    // eslint-disable-next-line no-param-reassign, fp/no-mutation
    value = value[prop]
  }

  return { value, missing: false }
}

const isPresent = function (value, prop) {
  if (typeof prop === 'string') {
    return isPresentProp(value) && prop in value
  }

  return isPresentIndex(value) && prop < value.length
}

const {
  array: { isPresent: isPresentIndex },
  weakObject: { isPresent: isPresentProp },
} = MISSING_HANDLERS
