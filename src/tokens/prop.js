// TODO: use `Object.hasOwn()` after dropping support for Node <16.9.0
// eslint-disable-next-line no-shadow
const { hasOwnProperty } = Object.prototype

// We distinguish between:
//  - Missing property name: return no entries
//  - Property exists but has `undefined` value: return an entry
const iterate = function (value, token, inherited) {
  const missing = inherited
    ? !(token in value)
    : !hasOwnProperty.call(value, token)
  return [{ value: value[token], prop: token, missing }]
}

export const PROP_TOKEN = {
  name: 'prop',
  valueType: 'object',
  iterate,
}
