import { list } from './get.js'

// Modify a target object multiple times for each matched property.
export const reduceParents = function ({
  target,
  query,
  setFunc,
  missing,
  leaves,
  classes,
  inherited,
}) {
  const entries = list(target, query, {
    childFirst: false,
    roots: !leaves,
    leaves,
    sort: false,
    missing,
    entries: true,
    classes,
    inherited,
  })
  return entries.reduce(
    (targetA, { path }) => setFunc(targetA, path, 0),
    target,
  )
}
