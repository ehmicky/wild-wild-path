import test from 'ava'
import { get } from 'wild-wild-path'

test('Dummy test', (t) => {
  t.is(get({ one: { two: true } }, 'one.two'), true)
})
