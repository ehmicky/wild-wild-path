import { handleMissingValue } from './missing.js'

// Expand special tokens like *, **, regexps, slices into property names or
// indices for a given value
export const expandTokens = function (entries, index, opts) {
  return entries
    .filter(({ queryArray }) => queryArray.length !== index)
    .flatMap((entry) => expandToken(entry, index, opts))
}

// Use the token to list entries against a target value.
const expandToken = function ({ queryArray, value, path }, index, opts) {
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

const isAllowedEntry = function ({ prop }) {
  return isAllowedProp(prop)
}

// Forbidden to avoid prototype pollution attacks
export const isAllowedProp = function (prop) {
  return !FORBIDDEN_PROPS.has(prop)
}

const FORBIDDEN_PROPS = new Set(['__proto__', 'prototype', 'constructor'])

const iterateToken = function (
  token,
  { tokenType, missing: missingParent, value },
  opts,
) {
  if (opts.missing) {
    return tokenType.iterate(value, token, opts)
  }

  if (missingParent) {
    return []
  }

  const childEntries = tokenType.iterate(value, token, opts)
  return childEntries.filter(isNotMissing)
}

const isNotMissing = function ({ missing }) {
  return !missing
}
