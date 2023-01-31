export type AbstractUIElement = Phaser.GameObjects.GameObject & Phaser.GameObjects.Components.Visible

export type UIGroup = {
  getChildren(): AbstractUIElement[]
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
    this.children.splice(0,this.children.length)
  }

  getChildren(): AbstractUIElement[] {
    return this.children
  }


}
