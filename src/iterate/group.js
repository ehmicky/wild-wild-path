// We need to group entries by the last property to ensure `childFirst` order.
// Iteration is guaranteed to return child entries before parent ones, or not,
// depending on `childFirst`
//  - This is useful for recursive logic which must often be applied in a
//    specific parent-child order
// We also sort siblings when `sort` is true`
export const groupSortChildEntries = function (childEntries, sort) {
  const childEntriesObj = groupBy(childEntries, getLastProp)
  return sort
    ? // eslint-disable-next-line fp/no-mutating-methods
      Object.keys(childEntriesObj)
        .sort()
        .map((prop) => childEntriesObj[prop])
    : Object.values(childEntriesObj)
}

const getLastProp = function ({ path }) {
  return path[path.length - 1]
}

// Group an array of objects into an object of objects based on a property
const groupBy = function (array, getGroup) {
  const groups = {}

  array.forEach((object, index) => {
    addGroup(object, index, groups, getGroup)
  })

  return groups
}

// We directly mutate `groups` for performance reasons
// eslint-disable-next-line max-params
const addGroup = function (object, index, groups, getGroup) {
  const groupValue =
    typeof getGroup === 'function' ? getGroup(object, index) : object[getGroup]
  const group = String(groupValue)

  if (groups[group] === undefined) {
    // eslint-disable-next-line no-param-reassign, fp/no-mutation
    groups[group] = [object]
    return
  }

  // eslint-disable-next-line fp/no-mutating-methods
  groups[group].push(object)
}
