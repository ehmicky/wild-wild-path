import { testListIterate } from '../helpers/list.js'
import { missingOpts } from '../helpers/options.js'

testListIterate([
  { input: [{ one: 1, two: 2, three: 3 }, '/t/'], output: [2, 3] },
  { input: [{ one: 1, two: 2, three: 3 }, [/t/u]], output: [2, 3] },
  { input: [{ one: 1, two: 2, three: 3 }, '/T/'], output: [] },
  { input: [{ one: 1, two: 2, three: 3 }, '/T/i'], output: [2, 3] },
  { input: [{ one: 1 }, '/a/', missingOpts], output: [] },
  { input: [[], '/a/', missingOpts], output: [] },
])
