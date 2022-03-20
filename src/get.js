import { iterate } from './iterate/main.js'

// Retrieve all properties in `target` matching a query string.
// Unlike `get|has()` it also return missing entries, letting consumers filter
// them or not.
export const list = function (
  target,
  query,
  {
    childFirst,
    roots,
    leaves,
    sort,
    missing,
    entries,
    classes,
    inherited,
  } = {},
) {
  return [
    ...iterate(target, query, {
      childFirst,
      roots,
      leaves,
      sort,
      missing,
      entries,
      classes,
      inherited,
    }),
  ]
}

// Retrieve a single property's value in `target` matching a query string.
// Wildcards can be used, but only the first value is returned.
export const get = function (
  target,
  query,
  { childFirst, roots, leaves, sort, entries, classes, inherited } = {},
) {
  return iterate(target, query, {
    childFirst,
    roots,
    leaves,
    sort,
    entries,
    missing: false,
    classes,
    inherited,
  }).next().value
}

// Check if a property is not missing according to a query
export const has = function (target, query, { classes, inherited } = {}) {
  return (
    get(target, query, {
      childFirst: false,
      roots: false,
      leaves: false,
      sort: false,
      entries: true,
      classes,
      inherited,
    }) !== undefined
  )
}
