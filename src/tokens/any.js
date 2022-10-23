// By using `for in`, we purposely exclude both symbols and inherited properties
const iterate = function (value, token, { inherited, shallowArrays }) {
  if (!Array.isArray(value)) {
    return getKeys(value, inherited).map((childKey) => ({
      value: value[childKey],
      prop: childKey,
      missing: false,
    }))
  }

  return shallowArrays
    ? [{ value, missing: false }]
    : value.map((childValue, index) => ({
        value: childValue,
        prop: index,
        missing: false,
      }))
}

export const getKeys = function (value, inherited) {
  if (!inherited) {
    return Object.keys(value)
  }

  const keys = []

  // eslint-disable-next-line fp/no-loops, guard-for-in
  for (const key in value) {
    // eslint-disable-next-line fp/no-mutating-methods
    keys.push(key)
  }

  return keys
}

export const ANY_TOKEN = {
  name: 'any',
  valueType: 'objectArray',
  iterate,
}
