import { testListOutput } from '../helpers/list.js'

testListOutput([
  { input: [{ one: 1, two: 2, three: 3 }, '/t/'], output: [2, 3] },
  { input: [{ one: 1, two: 2, three: 3 }, [/t/u]], output: [2, 3] },
  { input: [{ one: 1, two: 2, three: 3 }, '/T/'], output: [] },
  { input: [{ one: 1, two: 2, three: 3 }, '/T/i'], output: [2, 3] },
  { input: [{ one: 1 }, '/a/', { missing: true, entries: true }], output: [] },
  { input: [[], '/a/', { missing: true, entries: true }], output: [] },
  {
    input: [[], '/a/', { shallowArrays: true, missing: true, entries: true }],
    output: [],
  },
])
