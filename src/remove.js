import { reduceParents } from './reduce.js'
import { setValue } from './set.js'
import { validateClasses } from './validate.js'

// Same as `set()` but removing a value
export const remove = (
  target,
  query,
  { mutate = false, leaves = false, shallowArrays, classes, inherited } = {},
) => {
  validateClasses(classes, mutate)
  const setFunc = removeAnyEntry.bind(undefined, mutate)
  return reduceParents({
    target,
    query,
    setFunc,
    missing: false,
    leaves,
    shallowArrays,
    classes,
    inherited,
  })
}

// eslint-disable-next-line max-params
const removeAnyEntry = (mutate, target, path, index) =>
  path.length === 0 ? undefined : removeEntry({ mutate, target, path, index })

const removeEntry = ({ mutate, target, path, index }) => {
  const prop = path[index]

  if (index === path.length - 1) {
    return removeValue(target, prop, mutate)
  }

  const childTarget = target[prop]
  const childValue = removeEntry({
    mutate,
    target: childTarget,
    path,
    index: index + 1,
  })
  return setValue({ target, prop, childValue, mutate })
}

const removeValue = (target, prop, mutate) =>
  Array.isArray(target, prop)
    ? removeArrayValue(target, prop, mutate)
    : removeObjectValue(target, prop, mutate)

const removeArrayValue = (target, index, mutate) => {
  if (target[index] === undefined) {
    return target
  }

  const targetA = mutate ? target : [...target]
  // eslint-disable-next-line fp/no-mutation
  targetA[index] = undefined
  return trimUndefined(targetA, mutate)
}

const trimUndefined = (target, mutate) => {
  if (target.some(isDefined)) {
    return target
  }

  if (mutate) {
    target.splice(0)
    return target
  }

  return []
}

const isDefined = (item) => item !== undefined

const removeObjectValue = (target, prop, mutate) => {
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
const removeInheritedValue = (target, prop, mutate) => {
  if (mutate && prop in target) {
    // eslint-disable-next-line fp/no-mutation, no-param-reassign
    target[prop] = undefined
  }
}
