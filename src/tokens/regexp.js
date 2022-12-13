import { getKeys } from './any.js'

const iterate = (value, token, { inherited }) =>
  getKeys(value, inherited)
    .filter((childKey) => token.test(childKey))
    .map((childKey) => ({
      value: value[childKey],
      prop: childKey,
      missing: false,
    }))

export const REGEXP_TOKEN = {
  name: 'regExp',
  valueType: 'strictObject',
  iterate,
}
