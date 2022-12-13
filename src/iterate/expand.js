import { handleMissingValue } from './missing.js'

// Expand special tokens like *, **, regexps, slices into property names or
// indices for a given value
export const expandTokens = (entries, index, opts) =>
  entries
    .filter(({ queryArray }) => queryArray.length !== index)
    .flatMap((entry) => expandToken(entry, index, opts))

// Use the token to list entries against a target value.
const expandToken = ({ queryArray, value, path }, index, opts) => {
  const token = queryArray[index]
  const missingReturn = handleMissingValue(value, token, opts.classes)
  const childEntriesA = iterateToken(token, missingReturn, opts)
  return childEntriesA
    .filter(isAllowedEntry)
    .map(({ value: childValue, prop, missing: missingEntry }) => ({
      queryArray,
      value: childValue,
      path: prop === undefined ? path : [...path, prop],
      missing: missingReturn.missing || missingEntry,
    }))
}

const isAllowedEntry = ({ prop }) => isAllowedProp(prop)

// Forbidden to avoid prototype pollution attacks
export const isAllowedProp = (prop) => !FORBIDDEN_PROPS.has(prop)

const FORBIDDEN_PROPS = new Set(['__proto__', 'prototype', 'constructor'])

const iterateToken = (
  token,
  { tokenType, missing: missingParent, value },
  opts,
) => {
  if (opts.missing) {
    return tokenType.iterate(value, token, opts)
  }

  if (missingParent) {
    return []
  }

  const childEntries = tokenType.iterate(value, token, opts)
  return childEntries.filter(isNotMissing)
}

const isNotMissing = ({ missing }) => !missing
