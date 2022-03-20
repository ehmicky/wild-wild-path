const iterate = function (value, token) {
  const index = getArrayIndex(value, token)
  return [{ value: value[index], prop: index, missing: index >= value.length }]
}

// Negative array indices start from the end.
// Indices that are out-of-bound:
//  - Do not error
//  - Are min-bounded to 0
//  - Are not max-bounded:
//     - Those return a missing entry instead
//     - Reasons:
//        - This is more consistent with how missing entries with property names
//          are handled
//        - This allows appending with -0
//        - This is better when setting values on arrays with varying sizes
export const getArrayIndex = function (value, token) {
  return token > 0 || Object.is(token, +0)
    ? token
    : Math.max(value.length + token, 0)
}

export const INDEX_TOKEN = {
  name: 'index',
  valueType: 'array',
  iterate,
}
