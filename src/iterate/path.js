import { iterateQuery } from './query.js'

// `iterate()` logic when the query is path
export const iteratePath = function* (target, pathArray, opts) {
  yield* iterateQuery(target, [pathArray], opts)
}
