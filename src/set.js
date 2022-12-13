import { getMissingValue } from './iterate/missing.js'
import { reduceParents } from './reduce.js'
import { validateClasses } from './validate.js'

// Set a value to one or multiple properties in `target` using a query string.
// Unless `mutate` is `true`, this returns a new copy
//  - The value is returned in both cases so consumers can forward the `mutate`
//    option without inspecting it
export const set = (
  target,
  query,
  value,
  {
    mutate = false,
    missing = true,
    leaves = false,
    shallowArrays,
    classes,
    inherited,
  } = {},
  // eslint-disable-next-line max-params
) => {
  validateClasses(classes, mutate)
  const setFunc = setEntry.bind(undefined, { value, mutate, missing, classes })
  return reduceParents({
    target,
    query,
    setFunc,
    missing,
    leaves,
    shallowArrays,
    classes,
    inherited,
  })
}

// Use positional arguments for performance
// eslint-disable-next-line max-params
const setEntry = ({ value, mutate, missing, classes }, target, path, index) => {
  if (index === path.length) {
    return value
  }

  const prop = path[index]
  const defaultedTarget = getMissingValue(target, prop, { missing, classes })
  const childTarget = defaultedTarget[prop]
  const childValue = setEntry(
    { value, mutate, missing, classes },
    childTarget,
    path,
    index + 1,
  )
  return setValue({ target: defaultedTarget, prop, childValue, mutate })
}

export const setValue = ({ target, prop, childValue, mutate }) =>
  Array.isArray(target)
    ? setArrayValue({ target, index: prop, childValue, mutate })
    : setObjectValue({ target, prop, childValue, mutate })

const setArrayValue = ({ target, index, childValue, mutate }) => {
  if (isSameArrayValue(target, index, childValue)) {
    return target
  }

  const targetA = mutate ? target : [...target]
  // eslint-disable-next-line fp/no-mutation
  targetA[index] = childValue
  return targetA
}

// Setting an `undefined` value out-of-bound changes `Array.length`, i.e. should
// not be skipped
const isSameArrayValue = (target, index, childValue) =>
  target[index] === childValue &&
  (childValue !== undefined || index < target.length)

const setObjectValue = ({ target, prop, childValue, mutate }) => {
  if (isSameObjectValue(target, prop, childValue)) {
    return target
  }

  const targetA = mutate ? target : { ...target }
  // eslint-disable-next-line fp/no-mutation
  targetA[prop] = childValue
  return targetA
}

// Do not set value if it has not changed.
// We distinguish between `undefined` values with the property set and unset.
const isSameObjectValue = (target, prop, childValue) =>
  target[prop] === childValue && (childValue !== undefined || prop in target)
