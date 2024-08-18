import {
  ActivationContainer,
  DescribedTargettedAsyncMultiplexActivation,
  type DynamicDescriptionHolder,
  type EventReceiver,
  type EventSink,
  type QueuedTargettedActivation,
  type StaticDescriptionHolder,
  TargettedAsyncMultiplexActivation,
  getRandomNumber,
} from '@potato-golem/core'
import { audioSystem } from '../../..'
import {
  type BoardSupportedEvents,
  bloodSplatAnimationPool,
  explosionAnimationPool,
  poofAnimationPool,
} from '../../../scenes/board/BoardScene'
import { delay } from '../../../utils/timeUtils'
import type { EventId } from '../../definitions/eventDefinitions'
import type { CardModel } from '../../entities/CardModel'
import type { CardId } from '../../registries/cardRegistry'
import { EventEmitters } from '../../registries/eventEmitterRegistry'
import { type SfxEvent, SfxEventRegistry } from '../../registries/sfxEventRegistry'
import type { Zone } from '../../registries/zoneRegistry'
import { type WorldModel, worldModel } from '../../state/WorldModel'
import type {
  ActivationContext,
  ActivationContextCardOrEvent,
  ActivationContextSingleCard,
} from '../common/ActivationContext'
import { SpawnCardActivation } from '../event/extraEventActivations'
import { AsyncCardActivation, CardActivation, CardOrEventActivation } from './CardActivation'

export type ActivationArrayNew = Array<CardActivation | AsyncCardActivation>

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
        await poofAnimationPool.playAtTarget(targetCard.view)
        break
      case 'blood_splat':
        await bloodSplatAnimationPool.playAtTarget(targetCard.view)
        break
      case 'explosion':
        await explosionAnimationPool.playAtTarget(targetCard.view)
        break
      case 'none':
        break
    }
  }

  async activateTargettedAsync(context: ActivationContextSingleCard) {
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

  activateTargetted(context: ActivationContextSingleCard) {
    if (context.targetCard.definition.id === this.cardToCancel) {
      context.targetCard.view.cancelDrag()
      return
    }

    if (
      context.targetCard.combinedCard &&
      context.targetCard.combinedCard.definition.id === this.cardToCancel
    ) {
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
  async activateTargettedAsync(context: ActivationContextSingleCard) {
    context.targetCard.view.setVisible(false)
    await super.activateTargettedAsync(context)
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

  async activateTargettedAsync(_context: ActivationContextSingleCard): Promise<void> {
    const cards = worldModel.zones[this.zone].getAllCards()
    const promises = []
    for (const card of cards) {
      promises.push(
        super.activateTargettedAsync({
          targetCard: card.model,
        }),
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
    await super.activateTargettedAsync({
      targetCard: context.targetCard.combinedCard,
    })
  }

  getDescription(): string {
    return 'Consume combined card'
  }
}

export class DecomposeBothCardsActivation extends DecomposeCardActivation {
  async activateTargettedAsync(context: ActivationContextSingleCard) {
    await Promise.all([
      super.activateTargettedAsync(context),
      super.activateTargettedAsync({
        targetCard: context.targetCard.combinedCard,
      }),
    ])
  }

  getDescription(): string {
    return 'Consume both cards'
  }
}

export class DestroyCardActivation extends AsyncCardActivation {
  activateTargettedAsync(context: ActivationContextSingleCard): Promise<void> {
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

  async activateTargettedAsync(_context: ActivationContextSingleCard) {
    const cards = worldModel.zones[this.zone].getAllCards()
    const promises = []
    for (const card of cards) {
      promises.push(
        super.activateTargettedAsync({
          targetCard: card.model,
        }),
      )
    }
    await Promise.all(promises)
  }

  getDescription(): string {
    return 'Consume combined card'
  }
}

export class EatCardActivation extends AsyncCardActivation {
  async activateTargettedAsync(context: ActivationContextSingleCard) {
    await context.targetCard.view.playEatAnimation()
    context.targetCard.destroy()
  }

  getDescription(): string {
    return 'Consume card'
  }
}

export class PlaySfxActivation extends CardActivation {
  private readonly sfx: Array<SfxEvent>

  constructor(sfx: Array<SfxEvent>) {
    super()
    this.sfx = sfx
  }

  activateTargetted(_context: ActivationContextSingleCard) {
    audioSystem.playSfx(this.sfx[Math.floor(Math.random() * this.sfx.length)])
  }

  getDescription(): string {
    return ''
  }
}

export class LawIsDeadActivation extends CardActivation {
  activateTargetted(_context: ActivationContextSingleCard) {
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

  async activateTargettedAsync(context: ActivationContextSingleCard) {
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
        new PlaySfxActivation([SfxEventRegistry.POOF]), //This is for the CORPSE appearence
        new AnimateCardActivation('blood_splat', 0),
        new FeedActivation(worldModel.homunculusModel, 1, true),
        new SpawnCardActivation({
          spawnAnimation: 'pop_in',
          description: 'Spawn 1 Corpse',
          cardId: 'CORPSE',
          zone: 'alchemy',
        }),
        new DelayActivation(1100), //Allow blood splat animation to finish
        new DestroyCardActivation(),
      ])
      await activation.activateTargettedAsync(context)

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
            new PlaySfxActivation([SfxEventRegistry.POOF]), //This is for the CORPSE appearence
            new AnimateCardActivation('blood_splat', 0),
            new SpawnCardActivation({
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

      await activation.activateTargettedAsync(context)

      if (context.targetCard.isDestroyed) {
        return
      }

      const diceRoll = getRandomNumber(10)
      if (diceRoll <= 4) {
        const leaveActivation = new TargettedAsyncMultiplexActivation([
          new ChatCardActivation(['Guess nothing to see here']),
          new DecomposeCardActivation(),
        ])
        await leaveActivation.activateTargettedAsync(context)
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
    ]).activateTargettedAsync(context)

    const moveActivation = new MoveToZoneCardActivation(worldModel, possibleTargets)
    await moveActivation.activateTargettedAsync(context)
  }
}

export class MoveToZoneCardActivation extends AsyncCardActivation {
  private readonly worldModel: WorldModel
  private readonly targetZone: Zone

  constructor(worldModel: WorldModel, targetZones: Zone | Zone[]) {
    super()
    this.worldModel = worldModel

    this.targetZone = Array.isArray(targetZones)
      ? targetZones[Math.floor(Math.random() * targetZones.length)]
      : targetZones
  }

  async activateTargettedAsync(context: ActivationContextSingleCard): Promise<void> {
    const targetZoneView = this.worldModel.zones[this.targetZone]
    context.targetCard.changeZone(this.targetZone, true)
    const availableSpawnPont = targetZoneView.findAvailableSpawnPoint(context.targetCard.view)
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

  async activateTargettedAsync(context: ActivationContextSingleCard) {
    await context.targetCard.view.say(this.chatPhrases)
  }

  getDescription(): string {
    return 'Say something'
  }
}

export class DelayActivation extends AsyncCardActivation {
  private readonly delay: number

  constructor(delay: number) {
    super()
    this.delay = delay
  }

  async activateTargettedAsync(_context: ActivationContextSingleCard) {
    await delay(this.delay)
  }

  getDescription(): string {
    return ''
  }
}

export class GainHealthActivation implements CardActivation {
  private readonly amount: number
  private readonly target: EventReceiver

  constructor(target: EventReceiver, amount: number) {
    this.amount = amount
    this.target = target
  }

  activateTargetted(_context: ActivationContextSingleCard) {
    this.target.eventSink.emit('HEAL', this.amount)
  }

  getDescription(): string {
    return `Gain ${this.amount} health`
  }
}

export class DamageActivation extends CardActivation {
  protected readonly amount: number
  protected readonly target: EventReceiver

  constructor(target: EventReceiver, amount: number) {
    super()
    this.amount = amount
    this.target = target
  }

  activateTargetted(_context: ActivationContextSingleCard) {
    this.target.eventSink.emit('DAMAGE', this.amount)
  }

  getDescription(): string {
    return `Lose ${this.amount} health`
  }
}

export class AttackHomunculusCardActivation extends AsyncCardActivation {
  private readonly kamikaze: boolean
  private readonly damageActivation: DamageActivation
  private readonly target: EventReceiver

  constructor(target: EventReceiver, amount: number, kamikaze = true) {
    super()
    this.damageActivation = new DamageActivation(target, amount)
    this.kamikaze = kamikaze
    this.target = target
  }

  async activateTargettedAsync(context: ActivationContextSingleCard) {
    const { targetCard } = context
    const currentX = targetCard.view.x
    const currentY = targetCard.view.y

    await targetCard.view.animateAttackTo({
      x: 1280,
      y: 720,
    })
    this.damageActivation.activateTargetted(context)
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

  async activateTargettedAsync(context: ActivationContextSingleCard) {
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
    await this.decompozeAcivation.activateTargettedAsync({
      targetCard: foundCard,
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
  private readonly successActivations: ActivationContainer<ActivationContextSingleCard>
  private readonly failureActivations: ActivationContainer<ActivationContextSingleCard>

  constructor(
    cardIdsToSearch: CardId | CardId[],
    searchZone: Zone, // = 'any',
    successActivations: ActivationArrayNew,
    failureActivations: ActivationArrayNew,
  ) {
    super()
    this.cardIdsToSearch = cardIdsToSearch
    this.searchZone = searchZone
    this.successActivations = new ActivationContainer(successActivations)
    this.failureActivations = new ActivationContainer<ActivationContextSingleCard>(
      failureActivations,
    )
  }

  async activateTargettedAsync(context: ActivationContextSingleCard) {
    console.log(`Searching for ${context.targetCard.definition.id}`)
    const foundCard = worldModel.searchForCards(this.cardIdsToSearch, this.searchZone)
    console.log(`Card was found: ${foundCard}`)

    const activations = foundCard ? this.successActivations : this.failureActivations
    await activations.activateAsyncWithTarget(context)
  }

  getDescription(): string {
    return 'Search for a card and decide what to do'
  }
}

export class NextTurnActivation extends CardActivation {
  activateTargetted(_context: ActivationContext) {
    console.log('emit next turn')
    EventEmitters.boardEventEmitter.emit('NEXT_TURN')
  }

  override getDescription(): string {
    return `Time passes`
  }
}

/*
export class GainConscienceActivation implements Activation, DynamicDescriptionHolder {
  private readonly amount: number
  private readonly target: EventReceiver

  constructor(target: EventReceiver, amount: number) {
    this.amount = amount
    this.target = target
  }

  activateTargetted() {
    this.target.eventSink.emit('GAIN_CONSCIENCE', this.amount)
  }

  getDescription(): string {
    return `Homunculus gets ${this.amount} conscience`
  }
}

 */

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

  activateTargetted(_context: ActivationContextSingleCard) {
    this.target.eventSink.emit('FEED', this.amount, this.starveProtection)
  }

  getDescription(): string {
    return `Homunculus gets ${this.amount} satiation`
  }
}

export class QueueActivation extends CardOrEventActivation implements StaticDescriptionHolder {
  private readonly activation: QueuedTargettedActivation<ActivationContextCardOrEvent>
  private readonly eventSink: EventSink<BoardSupportedEvents>
  readonly description: string

  constructor(activation: QueuedTargettedActivation<ActivationContextCardOrEvent>) {
    super()
    this.eventSink = EventEmitters.boardEventEmitter
    this.activation = activation
    this.description = activation.description ?? ''
  }

  activateTargetted(context: ActivationContextCardOrEvent) {
    this.eventSink.emit('QUEUE_ACTIVATION', this.activation, context.targetCard)
  }

  getDescription(): string {
    return `Queue activation`
  }
}

export class SetActiveCardActivation extends CardOrEventActivation {
  private active: boolean

  constructor(active: boolean) {
    super()
    this.active = active
  }

  // ToDo revise this part
  override activateTargetted(context: ActivationContextCardOrEvent): void {
    if (!context.targetCard) {
      throw new Error('Target card not passed for SetActiveCardActivation')
    }

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

  activateTargetted(context: ActivationContext) {
    console.log('Start event', context.sourceCard)
    this.eventSink.emit('START_EVENT', this.eventId, context.sourceCard)
  }

  getDescription(): string {
    return `Start event`
  }
}
