export class LimitedNumber {
    public value: number;
    public maxValue: number;

    constructor(value: number, maxValue: number) {
        this.value = value
        this.maxValue = maxValue
    }

    increase(delta: number) {
        this.value = Math.min(this.value + delta, this.maxValue)
    }

    decrease(delta: number) {
        this.value -= delta
    }

    setToMax() {
        this.value = this.maxValue
    }
}
