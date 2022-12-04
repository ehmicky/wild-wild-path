import { expectType, expectNotType } from 'tsd'

import {
  has,
  get,
  list,
  iterate,
  remove,
  set,
  isObject,
  Target,
  Query,
  Options,
  Entry,
} from 'wild-wild-path'

const targetObj: Target = { one: 1 }
const targetArray: Target = [1]
const targetSpecialObj: Target = /regexp/
const queryArray: Query = [{ type: 'any' }]
const queryString: Query = '*'
const optionsMin: Options = {}
const optionsFull: Options = {
  childFirst: false,
  roots: false,
  leaves: false,
  sort: false,
  missing: false,
  entries: false,
  shallowArrays: false,
  classes: false,
  inherited: false,
}
const entry: Entry = { value: 1, path: ['prop'], missing: false }

expectType<boolean>(has({}, 'prop'))
has({}, 'prop', { sort: true })
// @ts-expect-error
has(true, 'prop')
// @ts-expect-error
has({}, true)
// @ts-expect-error
has({}, 'prop', true)

expectType<any | undefined>(get({}, 'prop'))
expectType<Entry | undefined>(get({}, 'prop', { entries: true }))
expectNotType<Entry | undefined>(get({}, 'prop', { entries: false }))
expectNotType<Entry | undefined>(get({}, 'prop', { sort: true }))
// @ts-expect-error
get(true, 'prop')
// @ts-expect-error
get({}, true)
// @ts-expect-error
get({}, 'prop', true)

expectType<any[]>(list({}, 'prop'))
expectType<Entry[]>(list({}, 'prop', { entries: true }))
expectNotType<Entry[]>(list({}, 'prop', { entries: false }))
expectNotType<Entry[]>(list({}, 'prop', { sort: true }))
// @ts-expect-error
list(true, 'prop')
// @ts-expect-error
list({}, true)
// @ts-expect-error
list({}, 'prop', true)

expectType<Generator<any>>(iterate({}, 'prop'))
for (const entry of iterate({}, 'prop', { entries: true })) {
  expectType<Entry>(entry)
}
for (const entry of iterate({}, 'prop', { entries: false })) {
  expectNotType<Entry>(entry)
}
for (const entry of iterate({}, 'prop', { sort: true })) {
  expectNotType<Entry>(entry)
}
// @ts-expect-error
iterate(true, 'prop')
// @ts-expect-error
iterate({}, true)
// @ts-expect-error
iterate({}, 'prop', true)

expectType<Target>(remove({}, 'prop'))
remove({}, 'prop', { mutate: true })
// @ts-expect-error
remove(true, 'prop')
// @ts-expect-error
remove({}, true)
// @ts-expect-error
remove({}, 'prop', true)

expectType<Target>(set({}, 'prop', 1))
set({}, 'prop', 1, { mutate: true })
// @ts-expect-error
set(true, 'prop', 1)
// @ts-expect-error
set({}, true, 1)
// @ts-expect-error
set({}, 'prop', 1, true)

expectType<boolean>(isObject({}, true))
// @ts-expect-error
isObject({}, {})
