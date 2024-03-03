import { expect } from 'chai'
import { describe } from 'mocha'
import { CommonDamageableComponent, DamageableComponent } from '../targets/DamageableComponent'
import { DamageEffect } from './DamageEffect'

describe('DamageEffect', () => {
  it('correctly reduces hp', () => {
    const target = new CommonDamageableComponent(100, 100)
    const effect = new DamageEffect(7)

    effect.applyEffect(target)

    expect(target.hp.value).to.eq(93)
  })
})
