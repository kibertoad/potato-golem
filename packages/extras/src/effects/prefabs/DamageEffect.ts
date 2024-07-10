import type { Effect } from '../Effect'
import type { DamageableComponent } from '../targets/DamageableComponent'

export const GENERIC_DAMAGE_TYPE = 'generic'

export class DamageEffect implements Effect<DamageableComponent> {
  private damageAmount: number
  private damageType: string

  constructor(damageAmount: number, damageType: string = GENERIC_DAMAGE_TYPE) {
    this.damageAmount = damageAmount
    this.damageType = damageType
  }

  applyEffect(target: DamageableComponent): void {
    target.inflictDamage(this.damageAmount)
  }
}
