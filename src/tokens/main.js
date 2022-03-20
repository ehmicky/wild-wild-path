import { getTokenType as getTokenTypeName } from 'wild-wild-parser'

import { ANY_TOKEN } from './any.js'
import { ANY_DEEP_TOKEN } from './any_deep.js'
import { INDEX_TOKEN } from './array.js'
import { PROP_TOKEN } from './prop.js'
import { REGEXP_TOKEN } from './regexp.js'
import { SLICE_TOKEN } from './slice.js'

// Retrieve token type-specific logic
export const getTokenType = function (token) {
  const tokenTypeName = getTokenTypeName(token)
  return TOKEN_TYPES[tokenTypeName]
}

const TOKEN_TYPES = {
  [ANY_TOKEN.name]: ANY_TOKEN,
  [ANY_DEEP_TOKEN.name]: ANY_DEEP_TOKEN,
  [INDEX_TOKEN.name]: INDEX_TOKEN,
  [PROP_TOKEN.name]: PROP_TOKEN,
  [REGEXP_TOKEN.name]: REGEXP_TOKEN,
  [SLICE_TOKEN.name]: SLICE_TOKEN,
}
