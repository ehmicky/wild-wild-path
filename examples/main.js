// Demo of the main usage.
// This file can be directly run:
//   - first install `wild-wild-path`
//   - then `node node_modules/wild-wild-path/examples/main.js`
// An online demo is also available at:
//   https://repl.it/@ehmicky/wild-wild-path

import { get } from 'wild-wild-path'

console.log(get({ one: { two: true } }, 'one.two'))
