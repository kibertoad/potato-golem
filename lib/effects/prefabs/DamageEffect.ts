import {Effect} from "../Effect";
import {DamageableComponent} from "../targets/DamageableEntity";

export class DamageEffect implements Effect<DamageableComponent> {
    private damageAmount: number;
    private damageType: string;

    constructor(damageAmount: number, damageType: string) {
        this.damageAmount = damageAmount
        this.damageType = damageType
    }

    applyEffect(target: DamageableComponent): void {
        target.inflictDamage(this.damageAmount)
    }
}
