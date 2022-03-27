// Ensure that the `mutate` option mutates the argument
export const testMutate = function ({ t, mutate, target, output }) {
  if (mutate && Array.isArray(target) === Array.isArray(output)) {
    t.deepEqual(target, output)
  }
}

export const mutateValues = [false, true]
