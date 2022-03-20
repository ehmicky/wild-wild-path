import { reduceParents } from './reduce.js'
import { setValue } from './set.js'
import { validateClasses } from './validate.js'

// Same as `set()` but removing a value
export const remove = function (
  target,
  query,
  { mutate = false, leaves = false, classes, inherited } = {},
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
    inherited,
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

// We make sure removing out-of-bound does not increase its length
const removeArrayValue = function (target, prop, mutate) {
  if (target[prop] === undefined) {
    return target
  }

  const targetA = mutate ? target : [...target]
  // eslint-disable-next-line fp/no-mutation
  targetA[prop] = undefined
  return targetA.every(isUndefined) ? [] : targetA
}

const isUndefined = function (item) {
  return item === undefined
}

const removeObjectValue = function (target, prop, mutate) {
  if (!(prop in target)) {
    return target
  }

  const targetA = mutate ? target : { ...target }
  // eslint-disable-next-line fp/no-delete
  delete targetA[prop]
  return targetA
}
