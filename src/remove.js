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
  removeInheritedValue(targetA, prop, mutate)
  return targetA
}

// When the property is inherited and not deep, deleting it does not work, since
// only the own property is being deleted (whether one exists or not).
// In this case, we set the value to `undefined` instead.
// This case can only happen when `mutate` is `true` since shallow copies remove
// prototypes.
const removeInheritedValue = function (target, prop, mutate) {
  if (mutate && prop in target && !hasOwnProperty.call(target, prop)) {
    // eslint-disable-next-line fp/no-mutation, no-param-reassign
    target[prop] = undefined
  }
}

// TODO: use `Object.hasOwn()` after dropping support for Node <16.9.0
// eslint-disable-next-line no-shadow
const { hasOwnProperty } = Object.prototype
