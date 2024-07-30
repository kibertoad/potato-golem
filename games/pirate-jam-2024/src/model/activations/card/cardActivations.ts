import {
  type Activation, DescribedTargettedMultipleActivation,
  type DynamicDescriptionHolder,
  type EventReceiver,
  type EventSink, getRandomNumber,
  LOW_PRIORITY,
  type QueuedActivation,
  type StaticDescriptionHolder, TargettedMultiplexActivation,
} from '@potato-golem/core'
import type { BoardSupportedEvents } from '../../../scenes/board/BoardScene'
import { delay } from '../../../utils/timeUtils'
import type { EventId } from '../../definitions/eventDefinitions'
import type { CardModel } from '../../entities/CardModel'
import type { CardId } from '../../registries/cardRegistry'
import { EventEmitters } from '../../registries/eventEmitterRegistry'
import { SfxId, SfxRegistry } from '../../registries/sfxRegistry'
import type { Zone } from '../../registries/zoneRegistry'
import { type WorldModel, worldModel } from '../../state/WorldModel'
import type { CardActivation } from './CardActivation'
import { SpawnCardActivation } from '../event/extraEventActivations'

export type ActivationArray = Array<Activation | CardActivation>

export type AnimationType = 'none' | 'poof' | 'blood_splat'

export class AnimateCardActivation implements CardActivation, DynamicDescriptionHolder {
  isExclusive = true
  priority = LOW_PRIORITY

  private readonly customDelay: number
  private readonly animationType: AnimationType

  constructor(animationType: AnimationType = 'poof', customDelay = -1) {
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
      case 'none':
        break
    }
  }

  async activate(targetCard: CardModel) {
    if (this.customDelay >= 0) {
      this.playAnimation(targetCard)
      await delay(this.customDelay)
    } else {
      await this.playAnimation(targetCard)
    }
  }

  getDescription(): string {
    return 'Hide card with a poof without destroying it'
  }
}

export class CancelDragCardActivation implements CardActivation, DynamicDescriptionHolder {
  isExclusive = true
  priority = LOW_PRIORITY

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
  implements CardActivation, DynamicDescriptionHolder
{
  isExclusive = true
  priority = LOW_PRIORITY

  async activate(targetCard: CardModel) {
    await super.activate(targetCard)
    targetCard.destroy()
  }

  getDescription(): string {
    return 'Destroy card after a poof animation'
  }
}

export class DecomposeOtherCardActivation extends DecomposeCardActivation {
  async activate(targetCard: CardModel) {
    await super.activate(targetCard.combinedCard)
  }

  getDescription(): string {
    return 'Consume combined card'
  }
}

export class DecomposeBothCardsActivation extends DecomposeCardActivation {
  async activate(targetCard: CardModel) {
    await Promise.all([super.activate(targetCard), super.activate(targetCard.combinedCard)])
  }

  getDescription(): string {
    return 'Consume both cards'
  }
}

export class DestroyCardActivation implements CardActivation, DynamicDescriptionHolder {
  isExclusive = true
  priority = LOW_PRIORITY

  async activate(targetCard: CardModel) {
    targetCard.destroy()
  }

  getDescription(): string {
    return 'Destroy card'
  }
}

export class EatCardActivation implements CardActivation, DynamicDescriptionHolder {
  isExclusive = true
  priority = LOW_PRIORITY

  async activate(targetCard: CardModel) {
    await targetCard.view.playEatAnimation()
    targetCard.destroy()
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

export class LawIsDeadActivation implements Activation {
  activate() {
    worldModel.theLawIsDead = true
  }
}

export class TheLawMoveActivation implements CardActivation {
  getDescription() {
    return ''
  }
  async activate(targetCard: CardModel) {
    console.log('Activate TheLaw')
    if (targetCard.zone === 'homunculus') {
      console.log('Homunculus branch')
      const activation = new DescribedTargettedMultipleActivation([
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
          zone: 'homunculus',
        }),
        new DelayActivation(1100), //Allow blood splat animation to finish
        new DestroyCardActivation(),
      ])
      await activation.activate(targetCard)

      return
    }

    if (!(['homunculus', 'streets'].includes(targetCard.zone))) {
    console.log('search branch')
    const activation = new DescribedTargettedMultipleActivation([
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
      const leaveActivation = new TargettedMultiplexActivation([new ChatCardActivation(['Guess nothing to see here']), new DecomposeCardActivation()])
      await leaveActivation.activate(targetCard)
      return
    }
  }
    // end home block

    console.log('Generic branch')

    const possibleTargets: Zone[] = []
    if (targetCard.zone === 'streets') {
      possibleTargets.push('home')
    } else
    if (targetCard.zone === 'home') {
      possibleTargets.push('lab')
    } else if (targetCard.zone === 'lab') {
      possibleTargets.push('homunculus')
    } else {
      return Promise.resolve()
    }

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

export class DamageActivation implements Activation, DynamicDescriptionHolder {
  protected readonly amount: number
  protected readonly target: EventReceiver

  constructor(target: EventReceiver, amount: number) {
    this.amount = amount
    this.target = target
  }

  activate() {
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

export class NextTurnActivation implements Activation, DynamicDescriptionHolder {
  activate() {
    console.log('emit next turn')
    EventEmitters.boardEventEmitter.emit('NEXT_TURN')
  }

  getDescription(): string {
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

export class GainHatredActivation implements Activation, DynamicDescriptionHolder {
  private readonly amount: number
  private readonly target: EventReceiver

  constructor(target: EventReceiver, amount: number) {
    this.amount = amount
    this.target = target
  }

  activate() {
    this.target.eventSink.emit('GAIN_HATRED', this.amount)
  }

  getDescription(): string {
    return `Homunculus gets ${this.amount} hatred`
  }
}

export class FeedActivation implements Activation, DynamicDescriptionHolder {
  private readonly amount: number
  private readonly target: EventReceiver
  private readonly starveProtection: boolean

  constructor(target: EventReceiver, amount: number, starveProtection = false) {
    this.amount = amount
    this.target = target
    this.starveProtection = starveProtection
  }

  activate() {
    this.target.eventSink.emit('FEED', this.amount, this.starveProtection)
  }

  getDescription(): string {
    return `Homunculus gets ${this.amount} satiation`
  }
}

export class QueueActivation implements Activation, CardActivation, StaticDescriptionHolder {
  isExclusive = true
  priority = LOW_PRIORITY

  private readonly activation: QueuedActivation
  private readonly eventSink: EventSink<BoardSupportedEvents>
  readonly description: string

  constructor(eventSink: EventSink<BoardSupportedEvents>, activation: QueuedActivation) {
    this.activation = activation
    this.eventSink = eventSink
    this.description = activation.description ?? ''
  }

  activate(targetCard?: CardModel) {
    this.eventSink.emit('QUEUE_ACTIVATION', this.activation, targetCard)
  }

  getDescription(): string {
    return `Queue activation`
  }
}

export class SetActiveCardActivation implements CardActivation, DynamicDescriptionHolder {
  isExclusive = true
  priority = LOW_PRIORITY

  private active: boolean

  constructor(active: boolean) {
    this.active = active
  }

  activate(targetCard: CardModel) {
    targetCard.view.setActiveCard(this.active)
  }

  getDescription(): string {
    return `Activate card`
  }
}

export class StartEventActivation implements CardActivation, Activation, DynamicDescriptionHolder {
  isExclusive = true
  priority = LOW_PRIORITY

  private readonly eventId: EventId
  private readonly eventSink: EventSink<BoardSupportedEvents>

  constructor(eventId: EventId, eventSink: EventSink<BoardSupportedEvents>) {
    this.eventId = eventId
    this.eventSink = eventSink
  }

  activate(targetCard?: CardModel) {
    console.log('Start event', targetCard)
    this.eventSink.emit('START_EVENT', this.eventId, targetCard)
  }

  getDescription(): string {
    return `Start event`
  }
}
