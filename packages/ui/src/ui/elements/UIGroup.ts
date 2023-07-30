export class UIGroupSlot<T extends UIGroup> {
  value?: T

  populate(newValue: T) {
    if (this.value) {
      this.value.destroy()
    }
    this.value = newValue
  }

  destroy() {
    this.value?.destroy()
  }
}

export type AbstractUIElementLite = Omit<Phaser.GameObjects.GameObject, 'setActive'> &
  Pick<Phaser.GameObjects.Components.Size, 'displayHeight' | 'displayWidth'> &
  Phaser.GameObjects.Components.Visible &
  Phaser.GameObjects.Components.Transform & {
  setActive(value: boolean): AbstractUIElementLite;
}

export type AbstractUIElement = Phaser.GameObjects.GameObject &
  Phaser.GameObjects.Components.Size &
  Phaser.GameObjects.Components.Visible &
  Phaser.GameObjects.Components.Transform

export type UIGroup = {
  getChildren(): AbstractUIElement[]
  addChild(child: AbstractUIElement)
  addChildren(child: AbstractUIElement[])
  disable()
  enable()
  destroy()
}

export class CommonUIGroup implements UIGroup {
  protected readonly children: AbstractUIElement[]

  constructor(children?: AbstractUIElement[]) {
    this.children = children ? [...children] : []
  }

  addChild(child: AbstractUIElement) {
    this.children.push(child)
  }

  addChildren(child: AbstractUIElement[]) {
    this.children.push(...child)
  }

  disable() {
    for (let child of this.children) {
      child.setVisible(false)
      child.disableInteractive()
    }
  }

  enable() {
    for (let child of this.children) {
      child.setVisible(true)
      child.setInteractive()
    }
  }

  destroy() {
    for (let child of this.children) {
      child.destroy(true)
    }
    this.children.splice(0, this.children.length)
  }

  getChildren(): AbstractUIElement[] {
    return this.children
  }
}
