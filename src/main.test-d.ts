import { expectType, expectNotType, expectError } from 'tsd'

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
} from './main.js'

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
  classes: false,
  inherited: false,
}
const entry: Entry = { value: 1, path: ['prop'], missing: false }

expectType<boolean>(has({}, 'prop'))
has({}, 'prop', { sort: true })
expectError(has(true, 'prop'))
expectError(has({}, true))
expectError(has({}, 'prop', true))

expectType<any | undefined>(get({}, 'prop'))
expectType<Entry | undefined>(get({}, 'prop', { entries: true }))
expectNotType<Entry | undefined>(get({}, 'prop', { entries: false }))
expectNotType<Entry | undefined>(get({}, 'prop', { sort: true }))
expectError(get(true, 'prop'))
expectError(get({}, true))
expectError(get({}, 'prop', true))

expectType<any[]>(list({}, 'prop'))
expectType<Entry[]>(list({}, 'prop', { entries: true }))
expectNotType<Entry[]>(list({}, 'prop', { entries: false }))
expectNotType<Entry[]>(list({}, 'prop', { sort: true }))
expectError(list(true, 'prop'))
expectError(list({}, true))
expectError(list({}, 'prop', true))

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
expectError(iterate(true, 'prop'))
expectError(iterate({}, true))
expectError(iterate({}, 'prop', true))

expectType<Target>(remove({}, 'prop'))
remove({}, 'prop', { mutate: true })
expectError(remove(true, 'prop'))
expectError(remove({}, true))
expectError(remove({}, 'prop', true))

expectType<Target>(set({}, 'prop', 1))
set({}, 'prop', 1, { mutate: true })
expectError(set(true, 'prop', 1))
expectError(set({}, true, 1))
expectError(set({}, 'prop', 1, true))

expectType<boolean>(isObject({}, true))
expectError(isObject({}, {}))
