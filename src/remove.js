import { reduceParents } from './reduce.js'
import { setValue } from './set.js'
import { validateClasses } from './validate.js'

// Same as `set()` but removing a value
export const remove = function (
  target,
  query,
  { mutate = false, leaves = false, classes } = {},
) {
  validateClasses(classes, mutate)
  const setFunc = removeAnyEntry.bind(undefined, { mutate, classes })
  return reduceParents({
    target,
    query,
    setFunc,
    missing: false,
    leaves,
    classes,
  })
}

// eslint-disable-next-line max-params
const removeAnyEntry = function ({ mutate, classes }, target, path, index) {
  return path.length === 0
    ? undefined
    : removeEntry({ mutate, classes, target, path, index })
}

const removeEntry = function ({ mutate, classes, target, path, index }) {
  const prop = path[index]

  if (index === path.length - 1) {
    return removeValue(target, prop, mutate)
  }

  const childTarget = target[prop]
  const childValue = removeEntry({
    classes,
    mutate,
    target: childTarget,
    path,
    index: index + 1,
  })
  return setValue({ target, prop, childValue, mutate })
}

const removeValue = function (target, prop, mutate) {
  return Array.isArray(target, prop)
    ? removeArrayValue(target, prop, mutate)
    : removeObjectValue(target, prop, mutate)
}

const removeArrayValue = function (target, index, mutate) {
  if (target[index] === undefined) {
    return target
  }

  const targetA = mutate ? target : [...target]
  // eslint-disable-next-line fp/no-mutation
  targetA[index] = undefined
  return trimUndefined(targetA, mutate)
}

const trimUndefined = function (target, mutate) {
  if (target.some(isDefined)) {
    return target
  }

  if (mutate) {
    // eslint-disable-next-line fp/no-mutating-methods
    target.splice(0)
    return target
  }

  return []
}

const isDefined = function (item) {
  return item !== undefined
}

const removeObjectValue = function (target, prop, mutate) {
  const targetA = mutate ? target : { ...target }
  // eslint-disable-next-line fp/no-delete
  delete targetA[prop]
  return targetA
}
