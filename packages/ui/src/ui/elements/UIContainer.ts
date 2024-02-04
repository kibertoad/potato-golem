import { Position } from '../common/CommonUITypes'
import { AbstractUIElement, AbstractUIElementLite } from './UIGroup'

export type SiblingLink = {
  sibling: UIContainer<AbstractUIElementLite>
  offset: Position
}

export class UIContainer<T extends AbstractUIElementLite = AbstractUIElement> {
  readonly value: T
  private siblings: SiblingLink[]

  constructor(value: T) {
    this.value = value
    this.siblings = []
  }

  addSibling(siblingLink: SiblingLink) {
    this.siblings.push(siblingLink)
    this.updateSiblingPosition(siblingLink)
  }

  setPosition(position: Position) {
    this.value.setPosition(position.x, position.y)
    this.updateSiblingPositions()
  }

  private updateSiblingPosition(sibling: SiblingLink) {
    sibling.sibling.setPosition({
      x: this.value.x + sibling.offset.x,
      y: this.value.displayHeight + (this.value.y + sibling.offset.y),
    })
    console.log(`New sibling position: ${sibling.sibling.value.x}/${sibling.sibling.value.y}`)
  }
  private updateSiblingPositions() {
    for (const sibling of this.siblings) {
      this.updateSiblingPosition(sibling)
    }
  }
}
