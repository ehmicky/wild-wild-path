import { get } from './iterate/main.js'

// Check if a property is not missing according to a query
export const has = (
  target,
  query,
  { shallowArrays, classes, inherited } = {},
) =>
  get(target, query, {
    childFirst: false,
    roots: false,
    leaves: false,
    sort: false,
    entries: true,
    shallowArrays,
    classes,
    inherited,
  }) !== undefined
