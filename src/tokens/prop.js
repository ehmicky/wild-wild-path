// We distinguish between:
//  - Missing property name: return no entries
//  - Property exists but has `undefined` value: return an entry
const iterate = (value, token) => [
  { value: value[token], prop: token, missing: !(token in value) },
]

export const PROP_TOKEN = {
  name: 'prop',
  valueType: 'weakObject',
  iterate,
}
