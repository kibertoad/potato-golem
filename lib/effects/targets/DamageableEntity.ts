import {LimitedNumber} from "../../core/entities/LimitedNumber";

export class CommonDamageableComponent implements DamageableComponent {
    hp: LimitedNumber;

    constructor(hp: number, maxHp: number) {
        this.hp = new LimitedNumber(hp, maxHp)
    }

    healDamage(healingAmount: number) {
        this.hp.increase(healingAmount)
    }

    inflictDamage(damageAmount: number) {
        this.hp.decrease(damageAmount)
    }
}

export type DamageableComponent = {
    hp: LimitedNumber

    inflictDamage(damageAmount: number)
    healDamage(healingAmount: number)
}
