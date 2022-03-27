import { has, get, Target, Query, Options } from 'wild-wild-path'
import { expectType, expectError } from 'tsd'

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

expectType<boolean>(has({}, 'prop'))
has({}, 'prop', { sort: true })
expectError(has(true, 'prop'))
expectError(has({}, true))
expectError(has({}, 'prop', true))

expectType<any>(get({}, 'prop'))
get({}, 'prop', { sort: true })
expectError(get(true, 'prop'))
expectError(get({}, true))
expectError(get({}, 'prop', true))
