import { describe, expect, it } from 'vitest'
import { composerNudge, nudgeFor } from '@/lib/nudges'

const long = (text: string) => `${text} ${'and it keeps happening every single week without fail '.repeat(3)}`

describe('nudges', () => {
  it('stays quiet until someone has really started', () => {
    expect(nudgeFor('whyProblem', 'An app')).toBeNull()
  })
  it('spots a solution where a problem should be', () => {
    expect(nudgeFor('whyProblem', 'I will build an app that tracks stock for shops')).toBe('solution')
    expect(nudgeFor('whyProblem', long('Shops lose sales when shelves run empty'))).toBeNull()
  })
  it('asks for a person', () => {
    expect(nudgeFor('whyUser', 'It would be really useful for the market in general')).toBe('person')
    expect(nudgeFor('whyUser', long('My uncle runs a hardware shop'))).toBeNull()
  })
  it('asks where the money comes from', () => {
    expect(nudgeFor('whyPay', 'It is a really important thing to fix for them')).toBe('money')
    expect(nudgeFor('whyPay', long('Shops already pay ₹500 a month for billing'))).toBeNull()
  })
  it('asks for a little more when it is thin', () => {
    expect(nudgeFor('whyUser', 'My uncle runs a hardware shop in Pune')).toBe('short')
  })
  it('keeps composer titles short and challenges product-free', () => {
    expect(composerNudge('title', 'one two three four five six seven eight nine ten')).toBe('title')
    expect(composerNudge('challenge', 'Build an app for kirana owners')).toBe('prescribes')
    expect(composerNudge('challenge', 'Make reordering take ten minutes a week')).toBeNull()
  })
})
