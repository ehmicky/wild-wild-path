import { isAllowedProp } from './expand.js'
import { isWeakObject } from './object.js'

// Performance-optimized `iterate()` logic when the query is path.
export const iteratePath = function* (
  target,
  pathArray,
  { missing: missingOpt, entries },
) {
  const { value, missing } = iterateLevel(target, pathArray, 0)

  if (!missing || missingOpt) {
    yield entries ? { value, path: pathArray, missing } : value
  }
}

const iterateLevel = function (value, pathArray, index) {
  const prop = pathArray[index]

  if (prop === undefined) {
    return { value, missing: false }
  }

  return isPresent(value, prop) && isAllowedProp(prop)
    ? iterateLevel(value[prop], pathArray, index + 1)
    : { value: undefined, missing: true }
}

const isPresent = function (value, prop) {
  if (typeof prop === 'string') {
    return isWeakObject(value) && prop in value
  }

  return Array.isArray(value) && prop < value.length
}
