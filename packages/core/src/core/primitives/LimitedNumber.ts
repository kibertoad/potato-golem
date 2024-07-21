/**
 * Numeric value that can have a max limit and optionally negativity constraint
 */
export class LimitedNumber {
  public value: number
  public maxValue: number
  private canBeNegative: boolean

  constructor(value: number, maxValue: number, canBeNegative?: boolean) {
    this.value = value
    this.maxValue = maxValue
    this.canBeNegative = canBeNegative ?? true
  }

  increase(delta: number) {
    this.value = Math.min(this.value + delta, this.maxValue)
  }

  decrease(delta: number) {
    this.value -= delta
    if (!this.canBeNegative && this.value < 0) {
      this.value = 0
    }
  }
  setToMax() {
    this.value = this.maxValue
  }
  setValue(value: number) {
    this.value = Math.min(value, this.maxValue)
  }
  setMaxValue(maxValue: number) {
    this.maxValue = maxValue
    this.value = Math.min(this.value, this.maxValue)
  }

  getPercentage() {
    return (this.value / this.maxValue) * 100
  }

  getMissing() {
    return this.maxValue - this.value
  }

  isAtMax() {
    return this.maxValue === this.value
  }

  isAtZero() {
    return this.value === 0
  }
}
