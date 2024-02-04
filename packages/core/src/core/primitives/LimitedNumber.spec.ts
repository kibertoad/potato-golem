import { expect } from 'chai'
import { LimitedNumber } from './LimitedNumber'

describe('LimitedNumber', () => {
  it('sets to max', () => {
    const value = new LimitedNumber(1, 10)
    expect(value.value).to.eq(1)

    value.setToMax()
    expect(value.value).to.eq(10)
  })

  it('calculates percentage', () => {
    expect(new LimitedNumber(0, 10).getPercentage()).to.eq(0)
    expect(new LimitedNumber(10, 10).getPercentage()).to.eq(100)
    expect(new LimitedNumber(3, 10).getPercentage()).to.eq(30)
  })

  it('calculates missing', () => {
    expect(new LimitedNumber(0, 10).getMissing()).to.eq(10)
    expect(new LimitedNumber(10, 10).getMissing()).to.eq(0)
    expect(new LimitedNumber(3, 10).getMissing()).to.eq(7)
  })
})
