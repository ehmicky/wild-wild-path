import {
  validateInherited,
  validateLeaves,
  validateMissing,
} from '../validate.js'

// Add default values and validate options for `iterate()`
export const getOptions = function ({
  childFirst = false,
  roots = false,
  leaves = false,
  sort = false,
  missing = false,
  entries = false,
  classes = false,
  inherited = false,
} = {}) {
  const opts = {
    childFirst: childFirst || leaves,
    roots,
    leaves,
    sort,
    missing,
    entries,
    classes,
    inherited,
  }
  validateInherited(opts)
  validateLeaves(opts)
  validateMissing(opts)
  return opts
}
