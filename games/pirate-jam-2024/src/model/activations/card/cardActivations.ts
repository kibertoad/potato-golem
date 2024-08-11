import {
  type Activation,
  DescribedTargettedAsyncMultiplexActivation,
  type DynamicDescriptionHolder,
  type EventReceiver,
  type EventSink,
  LOW_PRIORITY,
  type StaticDescriptionHolder,
  TargettedAsyncMultiplexActivation,
  getRandomNumber, type QueuedTargettedActivation,
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
import type { ActivationContext, ActivationContextSingleCard } from '../common/ActivationContext'

export type ActivationArray = Array<Activation | CardActivation | AsyncCardActivation>

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

export class CancelDragCardActivation extends CardActivation {
  private cardToCancel: CardId

  constructor(cardToCancel: CardId) {
    super()
    this.cardToCancel = cardToCancel
  }

  override activate(context: ActivationContextSingleCard) {
    if (context.targetCard.definition.id === this.cardToCancel) {
      context.targetCard.view.cancelDrag()
      return
    }

    if (context.targetCard.combinedCard && context.targetCard.combinedCard.definition.id === this.cardToCancel) {
      context.targetCard.combinedCard.view.cancelDrag()
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

export class DestroyCardActivation extends AsyncCardActivation {
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

export class EatCardActivation extends AsyncCardActivation {
  async activate(context: ActivationContextSingleCard) {
    await context.targetCard.view.playEatAnimation()
    context.targetCard.destroy()
  }

  getDescription(): string {
    return 'Consume card'
  }
}

export class PlaySfxActivation extends CardActivation {
  private readonly sfx: Array<SfxId>

  constructor(sfx: Array<SfxId>) {
    super()
    this.sfx = sfx
  }

  activate(_context: ActivationContextSingleCard) {
    worldModel.musicScene.playSfx(this.sfx[Math.floor(Math.random() * this.sfx.length)])
  }

  getDescription(): string {
    return ''
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

export class TheLawMoveActivation extends AsyncCardActivation {
  getDescription() {
    return ''
  }
  async activate(context: ActivationContextSingleCard) {
    console.log('Activate TheLaw')
    if (context.targetCard.zone === 'alchemy') {
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
      await activation.activate(context)

      return
    }

    if (!['alchemy', 'streets'].includes(context.targetCard.zone)) {
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

      await activation.activate(context)

      if (context.targetCard.isDestroyed) {
        return
      }

      const diceRoll = getRandomNumber(10)
      if (diceRoll <= 4) {
        const leaveActivation = new TargettedAsyncMultiplexActivation([
          new ChatCardActivation(['Guess nothing to see here']),
          new DecomposeCardActivation(),
        ])
        await leaveActivation.activate(context)
        return
      }
    }
    // end home block

    console.log('Generic branch')

    const possibleTargets: Zone[] = []
    if (context.targetCard.zone === 'streets') {
      possibleTargets.push('home')
    } else if (context.targetCard.zone === 'home') {
      possibleTargets.push('lab')
    } else if (context.targetCard.zone === 'lab') {
      possibleTargets.push('alchemy')
    } else {
      return Promise.resolve()
    }

    //Pre-move chat
    await new ChatCardActivation([
      'Hmmm... Interesting...',
      'What do we have here?',
      'Do you mind if I take a look?',
    ]).activate(context.targetCard)

    const moveActivation = new MoveToZoneCardActivation(worldModel, possibleTargets)
    await moveActivation.activate(context.targetCard)
  }
}

export class MoveToZoneCardActivation extends CardActivation {
  private readonly worldModel: WorldModel
  private readonly targetZone: Zone

  constructor(worldModel: WorldModel, targetZones: Zone | Zone[]) {
    super()
    this.worldModel = worldModel

    this.targetZone = Array.isArray(targetZones)
      ? targetZones[Math.floor(Math.random() * targetZones.length)]
      : targetZones
  }

  async activate(context: ActivationContextSingleCard) {
    const targetZoneView = this.worldModel.zones[this.targetZone]
    context.targetCard.changeZone(this.targetZone, true)
    const availableSpawnPont = targetZoneView.findAvailableSpawnPoint(targetCard.view)
    targetZoneView.registerCard(context.targetCard.view, availableSpawnPont.index)
    targetZoneView.reorderStackedCardDepths()
    await context.targetCard.view.animateMoveTo({
      x: availableSpawnPont.x,
      y: availableSpawnPont.y,
    })
  }

  getDescription(): string {
    return 'Move card to a different zone'
  }
}

export class ChatCardActivation extends AsyncCardActivation {
  private readonly chatPhrases: string[]

  constructor(chatPhrases: string[]) {
    super()
    this.chatPhrases = chatPhrases
  }

  async activate(context: ActivationContextSingleCard) {
    await context.targetCard.view.say(this.chatPhrases)
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

export class SearchAndDestroyCardActivation extends AsyncCardActivation {
  private readonly cardIdsToAttack: CardId | CardId[]
  private readonly searchZone: Zone
  private readonly kamikaze: boolean
  private readonly decompozeAcivation: DecomposeCardActivation = new DecomposeCardActivation()

  constructor(cardIdsToAttack: CardId | CardId[], searchZone: Zone = 'any', kamikaze = true) {
    super()
    this.cardIdsToAttack = cardIdsToAttack
    this.searchZone = searchZone
    this.kamikaze = kamikaze
  }

  async activate(context: ActivationContextSingleCard) {
    const { targetCard } = context
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
    await this.decompozeAcivation.activate({
      targetCard: foundCard
    })
    await targetCard.view.animateRushTo({
      x: currentX,
      y: currentY,
    })
  }

  getDescription(): string {
    return 'Say something'
  }
}

export class SearchAndDecideCardActivation extends AsyncCardActivation {

  private readonly cardIdsToSearch: CardId | CardId[]
  private readonly searchZone: Zone
  private readonly successActivations: ActivationArray
  private readonly failureActivations: ActivationArray

  constructor(
    cardIdsToSearch: CardId | CardId[],
    searchZone: Zone, // = 'any',
    successActivations: ActivationArray,
    failureActivations: ActivationArray,
  ) {
    super()
    this.cardIdsToSearch = cardIdsToSearch
    this.searchZone = searchZone
    this.successActivations = successActivations
    this.failureActivations = failureActivations
  }

  async activate(context: ActivationContextSingleCard) {
    console.log(`Searching for ${context.targetCard.definition.id}`)
    const foundCard = worldModel.searchForCards(this.cardIdsToSearch, this.searchZone)
    console.log(`Card was found: ${foundCard}`)

    const activations = foundCard ? this.successActivations : this.failureActivations
    for (const activation of activations) {
      await activation.activate(context)
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

export class FeedActivation extends CardActivation {
  private readonly amount: number
  private readonly target: EventReceiver
  private readonly starveProtection: boolean

  constructor(target: EventReceiver, amount: number, starveProtection = false) {
    super()
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
