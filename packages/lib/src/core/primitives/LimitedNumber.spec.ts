import { LimitedNumber } from './LimitedNumber'
import { expect } from 'chai'

describe('LimitedNumber', () => {
  it('correctly sets to max', () => {
    const value = new LimitedNumber(1, 10)
    expect(value.value).to.eq(1)

    value.setToMax()
    expect(value.value).to.eq(10)
  })
})
