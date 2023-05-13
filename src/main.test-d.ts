import { expectType, expectNotType, expectAssignable } from 'tsd'

import {
  has,
  get,
  list,
  iterate,
  remove,
  set,
  isObject,
  type Target,
  type Query,
  type Options,
  type Entry,
} from 'wild-wild-path'

expectAssignable<Target>({ one: 1 })
expectAssignable<Target>([1])
expectAssignable<Target>(/regexp/u)
expectAssignable<Query>([{ type: 'any' }])
expectAssignable<Query>('*')
expectAssignable<Options>({})
expectAssignable<Options>({
  childFirst: false,
  roots: false,
  leaves: false,
  sort: false,
  missing: false,
  entries: false,
  shallowArrays: false,
  classes: false,
  inherited: false,
})
expectAssignable<Entry>({ value: 1, path: ['prop'], missing: false })

expectType<boolean>(has({}, 'prop'))
has({}, 'prop', { sort: true })
// @ts-expect-error
has(true, 'prop')
// @ts-expect-error
has({}, true)
// @ts-expect-error
has({}, 'prop', true)

expectType<unknown>(get({}, 'prop'))
expectType<Entry | undefined>(get({}, 'prop', { entries: true }))
expectNotType<Entry | undefined>(get({}, 'prop', { entries: false }))
expectNotType<Entry | undefined>(get({}, 'prop', { sort: true }))
// @ts-expect-error
get(true, 'prop')
// @ts-expect-error
get({}, true)
// @ts-expect-error
get({}, 'prop', true)

expectType<unknown[]>(list({}, 'prop'))
expectType<Entry[]>(list({}, 'prop', { entries: true }))
expectNotType<Entry[]>(list({}, 'prop', { entries: false }))
expectNotType<Entry[]>(list({}, 'prop', { sort: true }))
// @ts-expect-error
list(true, 'prop')
// @ts-expect-error
list({}, true)
// @ts-expect-error
list({}, 'prop', true)

expectType<Generator>(iterate({}, 'prop'))

// eslint-disable-next-line fp/no-loops
for (const entry of iterate({}, 'prop', { entries: true })) {
  expectType<Entry>(entry)
}

// eslint-disable-next-line fp/no-loops
for (const entry of iterate({}, 'prop', { entries: false })) {
  expectNotType<Entry>(entry)
}

// eslint-disable-next-line fp/no-loops
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
