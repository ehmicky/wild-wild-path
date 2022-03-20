import { getKeys } from './any.js'

const iterate = function (value, token, inherited) {
  return getKeys(value, inherited)
    .filter((childKey) => token.test(childKey))
    .map((childKey) => ({
      value: value[childKey],
      prop: childKey,
      missing: false,
    }))
}

export const REGEXP_TOKEN = {
  name: 'regExp',
  valueType: 'object',
  iterate,
}
