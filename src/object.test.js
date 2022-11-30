import { isObject } from 'wild-wild-path'

import { getChild } from './helpers/inherited.test.js'
import { testOutput } from './helpers/output.test.js'

const child = getChild()

const funcObj = function () {}

const getAllInputs = function ({ inputs, outputs }) {
  return inputs.flatMap((input) => getInputs(input, outputs))
}

const getInputs = function (input, [noClassesOutput, classesOutput]) {
  return [
    // Output when `classes` option is `false`
    { input: [input, false], output: noClassesOutput },
    // Or when it is `true`
    { input: [input, true], output: classesOutput },
  ]
}

testOutput(
  [{ name: 'isObject', method: isObject }],
  [
    // Values that are never considered objects
    { inputs: [true, null], outputs: [false, false] },

    // Values that are always considered objects
    { inputs: [{}, Object.create(null)], outputs: [true, true] },

    // Values that are only considered objects if the `classes` option is `true`
    {
      inputs: [[], new Map([]), Object.create({}), child, funcObj],
      outputs: [false, true],
    },
  ].flatMap(getAllInputs),
)
