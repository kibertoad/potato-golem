import {
  type Activation,
  DescribedTargettedAsyncMultiplexActivation,
  type DynamicDescriptionHolder,
  type EventReceiver,
  type EventSink,
  LOW_PRIORITY,
  type QueuedActivation,
  type StaticDescriptionHolder,
  TargettedAsyncMultiplexActivation,
  getRandomNumber, QueuedTargettedActivation,
} from '@potato-golem/core'
import type { BoardSupportedEvents } from '../../../scenes/board/BoardScene'
import { delay } from '../../../utils/timeUtils'
import type { EventId } from '../../definitions/eventDefinitions'
import type { CardModel } from '../../entities/CardModel'
import type { CardId } from '../../registries/cardRegistry'
import { EventEmitters } from '../../registries/eventEmitterRegistry'
import { type SfxId, SfxRegistry } from '../../registries/sfxRegistry'
import type { Zone } from '../../registries/zoneRegistry'
import { type WorldModel, worldModel } from '../../state/WorldModel'
import { SpawnCardActivation } from '../event/extraEventActivations'
import { AsyncCardActivation, CardActivation } from './CardActivation'
import { ActivationContext, ActivationContextSingleCard, ActivationContextCardCombo } from '../common/ActivationContext'

export type ActivationArray = Array<Activation | CardActivation>

export type AnimationType = 'none' | 'poof' | 'blood_splat' | 'explosion'

export class AnimateCardActivation extends AsyncCardActivation {
  private readonly customDelay: number
  private readonly animationType: AnimationType

  constructor(animationType: AnimationType = 'poof', customDelay = -1) {
    super()
    this.customDelay = customDelay
    this.animationType = animationType
  }

  private async playAnimation(targetCard: CardModel) {
    switch (this.animationType) {
      case 'poof':
        await targetCard.view.playPoofAnimation()
        break
      case 'blood_splat':
        await targetCard.view.playBloodSplatAnimation()
        break
      case 'explosion':
        await targetCard.view.playExplosionAnimation()
        break
      case 'none':
        break
    }
  }

  async activate(context: ActivationContextSingleCard) {
    if (this.customDelay >= 0) {
      this.playAnimation(context.targetCard)
      await delay(this.customDelay)
    } else {
      await this.playAnimation(context.targetCard)
    }
  }

  getDescription(): string {
    return 'Hide card with a poof without destroying it'
  }
}

export class CancelDragCardActivation implements CardActivation, DynamicDescriptionHolder {
  private cardToCancel: CardId

  constructor(cardToCancel: CardId) {
    this.cardToCancel = cardToCancel
  }

  async activate(targetCard: CardModel) {
    if (targetCard.definition.id === this.cardToCancel) {
      targetCard.view.cancelDrag()
      return
    }

    if (targetCard.combinedCard && targetCard.combinedCard.definition.id === this.cardToCancel) {
      targetCard.combinedCard.view.cancelDrag()
    }
  }

  getDescription(): string {
    return `Bounce the card back to it's place`
  }
}

export class DecomposeCardActivation
  extends AnimateCardActivation
  implements AsyncCardActivation, DynamicDescriptionHolder
{
  async activate(context: ActivationContextSingleCard) {
    await super.activate(context)
    context.targetCard.destroy()
  }

  getDescription(): string {
    return 'Destroy card after a poof animation'
  }
}

export class AnimateZoneCardsActivation extends AnimateCardActivation {
  protected readonly zone: Zone

  constructor(zone: Zone, animationType: AnimationType = 'poof', customDelay = -1) {
    super(animationType, customDelay)
    this.zone = zone
  }

  async activate(_context: ActivationContextSingleCard): Promise<void> {
    const cards = worldModel.zones[this.zone].getAllCards()
    const promises = []
    for (const card of cards) {
      promises.push(
        super.activate({
          targetCard: card.model
        })
      )
    }
    await Promise.all(promises)
  }

  getDescription(): string {
    return 'Consume combined card'
  }
}

export class DecomposeOtherCardActivation extends DecomposeCardActivation {
  async activate(context: ActivationContextSingleCard) {
    await super.activate({
      targetCard: context.targetCard.combinedCard
    })
  }

  getDescription(): string {
    return 'Consume combined card'
  }
}

export class DecomposeBothCardsActivation extends DecomposeCardActivation {
  async activate(context: ActivationContextSingleCard) {
    await Promise.all([super.activate(context), super.activate({
      targetCard: context.targetCard.combinedCard
    })])
  }

  getDescription(): string {
    return 'Consume both cards'
  }
}

export class DestroyCardActivation extends AsyncCardActivation, DynamicDescriptionHolder {
  activate(context: ActivationContextSingleCard): Promise<void> {
    context.targetCard.destroy()
    return Promise.resolve()
  }

  getDescription(): string {
    return 'Destroy card'
  }
}

export class DestroyZoneCardsActivation extends DestroyCardActivation {
  protected readonly zone: Zone

  constructor(zone: Zone) {
    super()
    this.zone = zone
  }

  async activate(_context: ActivationContextSingleCard) {
    const cards = worldModel.zones[this.zone].getAllCards()
    const promises = []
    for (const card of cards) {
      promises.push(super.activate({
        targetCard: card.model,
      }))
    }
    await Promise.all(promises)
  }

  getDescription(): string {
    return 'Consume combined card'
  }
}

export class EatCardActivation implements AsyncCardActivation, DynamicDescriptionHolder {
  async activate(context: ActivationContextSingleCard) {
    await context.targetCard.view.playEatAnimation()
    context.targetCard.destroy()
  }

  getDescription(): string {
    return 'Consume card'
  }
}

export class PlaySfxActivation implements Activation {
  private readonly sfx: Array<SfxId>

  constructor(sfx: Array<SfxId>) {
    this.sfx = sfx
  }

  async activate() {
    worldModel.musicScene.playSfx(this.sfx[Math.floor(Math.random() * this.sfx.length)])
  }
}

export class LawIsDeadActivation extends CardActivation {
  activate() {
    worldModel.theLawIsDead = true
  }

  getDescription(): string {
    return ''
  }
}

export class TheLawMoveActivation implements CardActivation {
  getDescription() {
    return ''
  }
  async activate(targetCard: CardModel) {
    console.log('Activate TheLaw')
    if (targetCard.zone === 'alchemy') {
      console.log('Homunculus branch')
      const activation = new DescribedTargettedAsyncMultiplexActivation([
        new ChatCardActivation([
          'I will stop this ABOMINATION!',
          'Take this!',
          'In the name of the LAW!',
        ]),
        new AttackHomunculusCardActivation(worldModel.homunculusModel, 1),
        new PlaySfxActivation([SfxRegistry.POOF]), //This is for the CORPSE appearence
        new AnimateCardActivation('blood_splat', 0),
        new FeedActivation(worldModel.homunculusModel, 1, true),
        new SpawnCardActivation(EventEmitters.boardEventEmitter, {
          spawnAnimation: 'pop_in',
          description: 'Spawn 1 Corpse',
          cardId: 'CORPSE',
          zone: 'alchemy',
        }),
        new DelayActivation(1100), //Allow blood splat animation to finish
        new DestroyCardActivation(),
      ])
      await activation.activate(targetCard)

      return
    }

    if (!['alchemy', 'streets'].includes(targetCard.zone)) {
      console.log('search branch')
      const activation = new DescribedTargettedAsyncMultiplexActivation([
        new SearchAndDecideCardActivation(
          'CORPSE',
          'home',
          [
            new ChatCardActivation(['Is this...A CORPSE?!', 'A body?! I KNEW IT!']),
            new ChatCardActivation([
              'You will pay for this heresy!',
              'I will stop you!',
              'In the name of the LAW!',
            ]),
            new SearchAndDestroyCardActivation('HEALTH', 'home'),
            new PlaySfxActivation([SfxRegistry.POOF]), //This is for the CORPSE appearence
            new AnimateCardActivation('blood_splat', 0),
            new SpawnCardActivation(EventEmitters.boardEventEmitter, {
              spawnAnimation: 'pop_in',
              description: 'Spawn 1 Corpse',
              cardId: 'CORPSE',
              zone: 'home',
            }),
            new DelayActivation(1100), //Allow blood splat animation to finish
            new DestroyCardActivation(),
          ],
          [],
        ),
      ])

      await activation.activate(targetCard)

      if (targetCard.isDestroyed) {
        return
      }

      const diceRoll = getRandomNumber(10)
      if (diceRoll <= 4) {
        const leaveActivation = new TargettedAsyncMultiplexActivation([
          new ChatCardActivation(['Guess nothing to see here']),
          new DecomposeCardActivation(),
        ])
        await leaveActivation.activate(targetCard)
        return
      }
    }
    // end home block

    console.log('Generic branch')

    const possibleTargets: Zone[] = []
    if (targetCard.zone === 'streets') {
      possibleTargets.push('home')
    } else if (targetCard.zone === 'home') {
      possibleTargets.push('lab')
    } else if (targetCard.zone === 'lab') {
      possibleTargets.push('alchemy')
    } else {
      return Promise.resolve()
    }

    //Pre-move chat
    await new ChatCardActivation([
      'Hmmm... Interesting...',
      'What do we have here?',
      'Do you mind if I take a look?',
    ]).activate(targetCard)

    const moveActivation = new MoveToZoneCardActivation(worldModel, possibleTargets)
    await moveActivation.activate(targetCard)
  }
}

export class MoveToZoneCardActivation implements CardActivation, DynamicDescriptionHolder {
  private readonly worldModel: WorldModel
  private readonly targetZone: Zone

  constructor(worldModel: WorldModel, targetZones: Zone | Zone[]) {
    this.worldModel = worldModel

    this.targetZone = Array.isArray(targetZones)
      ? targetZones[Math.floor(Math.random() * targetZones.length)]
      : targetZones
  }

  async activate(targetCard: CardModel) {
    const targetZoneView = this.worldModel.zones[this.targetZone]
    targetCard.changeZone(this.targetZone, true)
    const availableSpawnPont = targetZoneView.findAvailableSpawnPoint(targetCard.view)
    targetZoneView.registerCard(targetCard.view, availableSpawnPont.index)
    targetZoneView.reorderStackedCardDepths()
    await targetCard.view.animateMoveTo({
      x: availableSpawnPont.x,
      y: availableSpawnPont.y,
    })
  }

  getDescription(): string {
    return 'Move card to a different zone'
  }
}

export class ChatCardActivation implements CardActivation, DynamicDescriptionHolder {
  private readonly chatPhrases: string[]

  constructor(chatPhrases: string[]) {
    this.chatPhrases = chatPhrases
  }

  async activate(targetCard: CardModel) {
    await targetCard.view.say(this.chatPhrases)
  }

  getDescription(): string {
    return 'Say something'
  }
}

export class DelayActivation implements Activation {
  private readonly delay: number

  constructor(delay: number) {
    this.delay = delay
  }

  async activate() {
    await delay(this.delay)
  }
}

export class GainHealthActivation implements Activation, DynamicDescriptionHolder {
  private readonly amount: number
  private readonly target: EventReceiver

  constructor(target: EventReceiver, amount: number) {
    this.amount = amount
    this.target = target
  }

  activate() {
    this.target.eventSink.emit('HEAL', this.amount)
  }

  getDescription(): string {
    return `Gain ${this.amount} health`
  }
}

export class DamageActivation implements CardActivation, DynamicDescriptionHolder {
  protected readonly amount: number
  protected readonly target: EventReceiver

  constructor(target: EventReceiver, amount: number) {
    this.amount = amount
    this.target = target
  }

  activate(_context: ActivationContextSingleCard) {
    this.target.eventSink.emit('DAMAGE', this.amount)
  }

  getDescription(): string {
    return `Lose ${this.amount} health`
  }
}

export class AttackHomunculusCardActivation extends DamageActivation implements CardActivation {
  isExclusive = true
  priority = LOW_PRIORITY

  private readonly kamikaze: boolean

  constructor(target: EventReceiver, amount: number, kamikaze = true) {
    super(target, amount)
    this.kamikaze = kamikaze
  }

  async activate(targetCard?: CardModel) {
    const currentX = targetCard.view.x
    const currentY = targetCard.view.y

    await targetCard.view.animateAttackTo({
      x: 1280,
      y: 720,
    })
    await super.activate()
    if (this.kamikaze) {
      return
    }
    this.target.eventSink.emit('ATTACKED')
    await targetCard.view.animateRushTo({
      x: currentX,
      y: currentY,
    })
  }

  getDescription(): string {
    return 'Attack homunculus'
  }
}

export class SearchAndDestroyCardActivation implements CardActivation, DynamicDescriptionHolder {
  isExclusive = true
  priority = LOW_PRIORITY

  private readonly cardIdsToAttack: CardId | CardId[]
  private readonly searchZone: Zone
  private readonly kamikaze: boolean
  private readonly decompozeAcivation: DecomposeCardActivation = new DecomposeCardActivation()

  constructor(cardIdsToAttack: CardId | CardId[], searchZone: Zone = 'any', kamikaze = true) {
    this.cardIdsToAttack = cardIdsToAttack
    this.searchZone = searchZone
    this.kamikaze = kamikaze
  }

  async activate(targetCard: CardModel) {
    const foundCard = worldModel.searchForCards(this.cardIdsToAttack, this.searchZone)

    if (!foundCard) {
      return
    }
    const currentX = targetCard.view.x
    const currentY = targetCard.view.y
    await targetCard.view.animateAttackTo({
      x: foundCard.view.x,
      y: foundCard.view.y,
    })
    if (this.kamikaze) {
      foundCard.destroy()
      return
    }
    this.decompozeAcivation.activate(foundCard)
    await targetCard.view.animateRushTo({
      x: currentX,
      y: currentY,
    })
  }

  getDescription(): string {
    return 'Say something'
  }
}

export class SearchAndDecideCardActivation implements CardActivation, DynamicDescriptionHolder {
  isExclusive = true
  priority = LOW_PRIORITY

  private readonly cardIdsToSearch: CardId | CardId[]
  private readonly searchZone: Zone
  private readonly successActivations: ActivationArray
  private readonly failureActivations: ActivationArray

  constructor(
    cardIdsToSearch: CardId | CardId[],
    searchZone: Zone = 'any',
    successActivations: ActivationArray,
    failureActivations: ActivationArray,
  ) {
    this.cardIdsToSearch = cardIdsToSearch
    this.searchZone = searchZone
    this.successActivations = successActivations
    this.failureActivations = failureActivations
  }

  async activate(targetCard: CardModel) {
    console.log(`Searching for ${targetCard.definition.id}`)
    const foundCard = worldModel.searchForCards(this.cardIdsToSearch, this.searchZone)
    console.log(`Card was found: ${foundCard}`)

    const activations = foundCard ? this.successActivations : this.failureActivations
    for (const activation of activations) {
      await activation.activate(targetCard)
    }
  }

  getDescription(): string {
    return 'Search for a card and decide what to do'
  }
}

export class NextTurnActivation extends CardActivation {
  activate(_context: ActivationContext) {
    console.log('emit next turn')
    EventEmitters.boardEventEmitter.emit('NEXT_TURN')
  }

  override getDescription(): string {
    return `Time passes`
  }
}

export class GainConscienceActivation implements Activation, DynamicDescriptionHolder {
  private readonly amount: number
  private readonly target: EventReceiver

  constructor(target: EventReceiver, amount: number) {
    this.amount = amount
    this.target = target
  }

  activate() {
    this.target.eventSink.emit('GAIN_CONSCIENCE', this.amount)
  }

  getDescription(): string {
    return `Homunculus gets ${this.amount} conscience`
  }
}

export class FeedActivation implements CardActivation, DynamicDescriptionHolder {
  private readonly amount: number
  private readonly target: EventReceiver
  private readonly starveProtection: boolean

  constructor(target: EventReceiver, amount: number, starveProtection = false) {
    this.amount = amount
    this.target = target
    this.starveProtection = starveProtection
  }

  activate(_context: ActivationContextSingleCard) {
    this.target.eventSink.emit('FEED', this.amount, this.starveProtection)
  }

  getDescription(): string {
    return `Homunculus gets ${this.amount} satiation`
  }
}

export class QueueActivation extends CardActivation implements StaticDescriptionHolder {
  private readonly activation: QueuedTargettedActivation<ActivationContextSingleCard>
  private readonly eventSink: EventSink<BoardSupportedEvents>
  readonly description: string

  constructor(activation: QueuedTargettedActivation<ActivationContextSingleCard>) {
    super()
    this.eventSink = EventEmitters.boardEventEmitter
    this.activation = activation
    this.description = activation.description ?? ''
  }

  activate(context: ActivationContextSingleCard) {
    this.eventSink.emit('QUEUE_ACTIVATION', this.activation, context.targetCard)
  }

  getDescription(): string {
    return `Queue activation`
  }
}

export class SetActiveCardActivation extends CardActivation {
  private active: boolean

  constructor(active: boolean) {
    super()
    this.active = active
  }

  activate(context: ActivationContextSingleCard) {
    context.targetCard.view.setActiveCard(this.active)
  }

  getDescription(): string {
    return `Activate card`
  }
}

export class StartEventActivation extends CardActivation {
  private readonly eventId: EventId
  private readonly eventSink: EventSink<BoardSupportedEvents>

  constructor(eventId: EventId) {
    super()
    this.eventId = eventId
    this.eventSink = EventEmitters.eventViewEmitter
  }

  activate(context: ActivationContext) {
    console.log('Start event', context.sourceCard)
    this.eventSink.emit('START_EVENT', this.eventId, context.sourceCard)
  }

  getDescription(): string {
    return `Start event`
  }
}
