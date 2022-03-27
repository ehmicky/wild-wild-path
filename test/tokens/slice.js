import { testListOutput } from '../helpers/list.js'
import { missingOpts } from '../helpers/options.js'

testListOutput([
  { input: [[0, 1, 2, 3], '1:3'], output: [1, 2] },
  {
    input: [[0, 1, 2, 3], [{ type: 'slice', from: 1, to: 3 }]],
    output: [1, 2],
  },
  { input: [[0, 1, 2, 3], '1:-1'], output: [1, 2] },
  { input: [[0, 1, 2, 3], '-3:3'], output: [1, 2] },
  { input: [[0, 1, 2, 3], '-5:3'], output: [0, 1, 2] },
  { input: [[0, 1, 2, 3], '-6:-5', missingOpts], output: [] },
  { input: [[0, 1, 2, 3], '1:5'], output: [1, 2, 3] },
  { input: [[0, 1, 2, 3], '1:-0'], output: [1, 2, 3] },
  { input: [[0, 1, 2, 3], '5:6', missingOpts], output: [] },
  { input: [[0, 1, 2, 3], '1:'], output: [1, 2, 3] },
  { input: [[0, 1, 2, 3], ':3'], output: [0, 1, 2] },
  { input: [[0, 1, 2, 3], ':'], output: [0, 1, 2, 3] },
  { input: [[], '0:5'], output: [] },
  { input: [{}, ':', missingOpts], output: [] },
])
