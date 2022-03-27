import { has, get, list, Target, Query, Options, Entry } from 'wild-wild-path'
import { expectType, expectNotType, expectError } from 'tsd'

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
get({}, 'prop', { sort: true })
expectError(get(true, 'prop'))
expectError(get({}, true))
expectError(get({}, 'prop', true))

expectType<any[]>(list({}, 'prop'))
expectType<Entry[]>(list({}, 'prop', { entries: true }))
expectNotType<Entry[]>(list({}, 'prop', { entries: false }))
expectNotType<Entry[]>(list({}, 'prop', { sort: true }))
list({}, 'prop', { sort: true })
expectError(list(true, 'prop'))
expectError(list({}, true))
expectError(list({}, 'prop', true))
