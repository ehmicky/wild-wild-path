/* eslint-disable max-lines */
import test from 'ava'
import { each } from 'test-each'
import { list, iterate } from 'wild-wild-path'

const selfObject = { one: 1, two: { three: 3 } }
// eslint-disable-next-line fp/no-mutation
selfObject.two.self = selfObject

/* eslint-disable fp/no-class, fp/no-this, fp/no-mutation,
   fp/no-mutating-methods */
class Parent {}

Parent.prototype.inheritedEnum = 'inheritedEnum'
Object.defineProperty(Parent.prototype, 'inheritedNonEnum', {
  value: 'inheritedNonEnum',
})

class Child extends Parent {
  constructor() {
    super()
    this.ownEnum = 'ownEnum'
    Object.defineProperty(this, 'ownNonEnum', { value: 'ownNonEnum' })
  }
}
/* eslint-enable fp/no-class, fp/no-this, fp/no-mutation,
   fp/no-mutating-methods */

const child = new Child()

const iterateAll = function (target, query, opts) {
  return [...iterate(target, query, opts)]
}

const listMethods = [list, iterateAll]

each(
  listMethods,
  [
    // Root query
    { target: 1, query: '.', output: [1] },
    { target: 1, query: [], output: [1] },
    { target: 1, query: [[]], output: [1] },
    {
      target: {},
      query: '.',
      output: [{ value: {}, path: [], missing: false }],
      opts: { entries: true },
    },

    // Deep query
    { target: { one: { two: 1 } }, query: 'one.two', output: [1] },
    { target: { one: { two: 1 } }, query: ['one', 'two'], output: [1] },

    // Unions
    { target: { one: 1, two: 2, three: 3 }, query: 'one two', output: [1, 2] },
    {
      target: { one: 1, two: 2, three: 3 },
      query: [['one'], ['two']],
      output: [1, 2],
    },
    { target: { one: 1 }, query: 'one one', output: [1] },
    { target: { one: { two: 2 } }, query: '*.two one.two', output: [2] },
    {
      target: { one: { two: { three: 1 } } },
      query: '*.two one.two.three',
      output: [{ three: 1 }, 1],
    },

    // Forbidden properties
    { target: { __proto__: {} }, query: '__proto__', output: [] },
    { target: { prototype: {} }, query: 'prototype', output: [] },
    { target: { constructor() {} }, query: 'constructor', output: [] },

    // `childFirst` option
    {
      target: { one: 1 },
      query: 'one .',
      output: [{ one: 1 }, 1],
      opts: { childFirst: false },
    },
    {
      target: { one: 1 },
      query: '. one',
      output: [1, { one: 1 }],
      opts: { childFirst: true },
    },
    {
      target: { one: { two: { three: 1 } } },
      query: 'one.two *.two.three',
      output: [1, { three: 1 }],
      opts: { childFirst: true },
    },

    // `leaves` option
    {
      target: { one: { two: 1 } },
      query: 'one . one.two',
      output: [1],
      opts: { leaves: true },
    },
    {
      target: { one: { two: 1 } },
      query: '. one one.two',
      output: [1],
      opts: { leaves: true, childFirst: true },
    },
    { target: {}, query: '. *', output: [{}], opts: { leaves: true } },

    // `roots` option
    {
      target: { one: 1 },
      query: '. one',
      output: [{ one: 1 }],
      opts: { roots: true },
    },

    // `sort` option
    { target: { two: 2, one: 1 }, query: '*', output: [2, 1] },
    {
      target: { two: 2, one: 1 },
      query: '*',
      output: [1, 2],
      opts: { sort: true },
    },

    // `missing` option
    {
      target: { one: 1 },
      query: 'one two',
      output: [
        { value: 1, path: ['one'], missing: false },
        { value: undefined, path: ['two'], missing: true },
      ],
      opts: { missing: true, entries: true },
    },
    {
      target: {},
      query: 'one',
      output: [{ value: undefined, path: ['one'], missing: true }],
      opts: { missing: true, entries: true },
    },
    { target: { one: undefined }, query: 'one', output: [undefined] },
    {
      target: { one: undefined },
      query: 'one',
      output: [{ value: undefined, path: ['one'], missing: false }],
      opts: { missing: true, entries: true },
    },
    {
      target: [],
      query: 'one',
      output: [{ value: undefined, path: ['one'], missing: true }],
      opts: { missing: true, entries: true },
    },

    // `classes` and `inherited` options
    {
      target: child,
      query: 'ownEnum ownNonEnum inheritedEnum inheritedNonEnum',
      output: [],
    },
    { target: child, query: '/\\.*/', output: [] },
    { target: child, query: '*', output: [] },
    {
      target: child,
      query: 'ownEnum ownNonEnum inheritedEnum inheritedNonEnum',
      output: ['ownEnum', 'ownNonEnum'],
      opts: { classes: true },
    },
    {
      target: child,
      query: '/\\.*/',
      output: ['ownEnum'],
      opts: { classes: true },
    },
    {
      target: child,
      query: '*',
      output: ['ownEnum'],
      opts: { classes: true },
    },
    {
      target: child,
      query: 'ownEnum ownNonEnum inheritedEnum inheritedNonEnum',
      output: ['ownEnum', 'ownNonEnum', 'inheritedEnum', 'inheritedNonEnum'],
      opts: { classes: true, inherited: true },
    },
    {
      target: child,
      query: '/\\.*/',
      output: ['ownEnum', 'inheritedEnum'],
      opts: { classes: true, inherited: true },
    },
    {
      target: child,
      query: '*',
      output: ['ownEnum', 'inheritedEnum'],
      opts: { classes: true, inherited: true },
    },

    // prop tokens
    { target: { one: 1 }, query: 'one', output: [1] },
    { target: { one: 1 }, query: ['one'], output: [1] },

    // Index tokens
    { target: [1, 2, 3], query: '0', output: [1] },
    { target: [1, 2, 3], query: [0], output: [1] },
    { target: [1, 2, 3], query: '1', output: [2] },
    { target: [1, 2, 3], query: '3', output: [] },
    { target: [1, 2, 3], query: '-0', output: [] },
    { target: [1, 2, 3], query: '-1', output: [3] },
    { target: [1, 2, 3], query: '-3', output: [1] },
    {
      target: [],
      query: '0',
      output: [{ value: undefined, path: [0], missing: true }],
      opts: { missing: true, entries: true },
    },
    {
      target: [],
      query: '-0',
      output: [{ value: undefined, path: [0], missing: true }],
      opts: { missing: true, entries: true },
    },
    { target: [undefined], query: '0', output: [undefined] },
    { target: { 0: 1 }, query: '0', output: [] },

    // Slice tokens
    { target: [0, 1, 2, 3], query: '1:3', output: [1, 2] },
    {
      target: [0, 1, 2, 3],
      query: [{ type: 'slice', from: 1, to: 3 }],
      output: [1, 2],
    },
    { target: [0, 1, 2, 3], query: '1:-1', output: [1, 2] },
    { target: [0, 1, 2, 3], query: '-3:3', output: [1, 2] },
    { target: [0, 1, 2, 3], query: '-5:3', output: [0, 1, 2] },
    {
      target: [0, 1, 2, 3],
      query: '-6:-5',
      output: [],
      opts: { missing: true, entries: true },
    },
    { target: [0, 1, 2, 3], query: '1:5', output: [1, 2, 3] },
    { target: [0, 1, 2, 3], query: '1:-0', output: [1, 2, 3] },
    {
      target: [0, 1, 2, 3],
      query: '5:6',
      output: [],
      opts: { missing: true, entries: true },
    },
    { target: [0, 1, 2, 3], query: '1:', output: [1, 2, 3] },
    { target: [0, 1, 2, 3], query: ':3', output: [0, 1, 2] },
    { target: [0, 1, 2, 3], query: ':', output: [0, 1, 2, 3] },
    { target: [], query: '0:5', output: [] },
    {
      target: {},
      query: ':',
      output: [],
      opts: { missing: true, entries: true },
    },

    // RegExp tokens
    { target: { one: 1, two: 2, three: 3 }, query: '/t/', output: [2, 3] },
    { target: { one: 1, two: 2, three: 3 }, query: [/t/u], output: [2, 3] },
    { target: { one: 1, two: 2, three: 3 }, query: '/T/', output: [] },
    { target: { one: 1, two: 2, three: 3 }, query: '/T/i', output: [2, 3] },
    {
      target: { one: 1 },
      query: '/a/',
      output: [],
      opts: { missing: true, entries: true },
    },
    {
      target: [],
      query: '/a/',
      output: [],
      opts: { missing: true, entries: true },
    },

    // any tokens
    {
      target: { one: 1, two: 2 },
      query: '*',
      output: [
        { value: 1, path: ['one'], missing: false },
        { value: 2, path: ['two'], missing: false },
      ],
      opts: { entries: true },
    },
    {
      target: { one: 1, two: 2 },
      query: [{ type: 'any' }],
      output: [
        { value: 1, path: ['one'], missing: false },
        { value: 2, path: ['two'], missing: false },
      ],
      opts: { entries: true },
    },
    {
      target: [1, 2],
      query: '*',
      output: [
        { value: 1, path: [0], missing: false },
        { value: 2, path: [1], missing: false },
      ],
      opts: { entries: true },
    },
    {
      target: {},
      query: '*',
      output: [],
      opts: { missing: true, entries: true },
    },
    {
      target: [],
      query: '*',
      output: [],
      opts: { missing: true, entries: true },
    },

    // anyDeep tokens
    { target: selfObject, query: '**', output: [1, 3], opts: { leaves: true } },
    {
      target: { one: 1, two: { three: 3, four: [2, { five: 0 }] } },
      query: '**',
      output: [1, 3, 2, 0],
      opts: { leaves: true },
    },
    {
      target: { one: { two: 1 } },
      query: '**',
      output: [{ one: { two: 1 } }, { two: 1 }, 1],
    },
    {
      target: { one: { two: 1 } },
      query: '**.*',
      output: [{ two: 1 }, 1],
    },
    {
      target: { one: { two: 1 } },
      query: '*.**',
      output: [{ two: 1 }, 1],
    },
    {
      target: { one: { two: 2 }, three: { two: 3 } },
      query: 'one.**',
      output: [2],
      opts: { leaves: true },
    },
    {
      target: { one: { two: 2 }, three: { two: 3 } },
      query: ['one', { type: 'anyDeep' }],
      output: [2],
      opts: { leaves: true },
    },
    {
      target: { one: { two: 2 }, three: { two: 3 } },
      query: '**.two',
      output: [2, 3],
      opts: { leaves: true },
    },
    {
      target: { one: { two: { four: 2 } }, three: { two: { four: 3 } } },
      query: '**.two.**',
      output: [2, 3],
      opts: { leaves: true },
    },
    {
      target: { one: { one: 2 }, two: { one: 3 } },
      query: '**.one.**',
      output: [{ one: 2 }, 2, 3],
    },
    { target: {}, query: '**', output: [{}] },
    {
      target: { one: { two: 2 }, three: { four: 3 } },
      query: '**.**',
      output: [2, 3],
      opts: { leaves: true },
    },
  ],
  ({ title }, list, { target, query, opts, output }) => {
    test(`list() output | ${title}`, (t) => {
      t.deepEqual(list(target, query, opts), output)
    })
  },
)

each(
  listMethods,
  [
    { target: {}, query: '.', opts: { inherited: true, classes: false } },
    { target: {}, query: '.', opts: { missing: true, entries: false } },
    { target: {}, query: '.', opts: { roots: true, leaves: true } },
    { target: {}, query: true },
    { target: {}, query: [[true]] },
    { target: {}, query: 'a\\b' },
    { target: {}, query: '/[/' },
  ],
  ({ title }, list, { target, query, opts }) => {
    test(`list() validates its input | ${title}`, (t) => {
      t.throws(list.bind(undefined, target, query, opts))
    })
  },
)
/* eslint-enable max-lines */
