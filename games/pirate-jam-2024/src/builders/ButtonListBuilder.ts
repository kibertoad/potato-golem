import Phaser from 'phaser'

interface ButtonListBuilderConfig {
  textureKey: string
  position?: { x: number; y: number }
  depth?: number
  width?: number
  height?: number
  distance?: number
  orientation?: 'vertical' | 'horizontal'
  hoverTint?: number
}

export class ButtonListBuilder {
  private scene: Phaser.Scene
  private textureKey: string
  private position: { x: number; y: number }
  private depth: number
  private width: number
  private height: number
  private distance: number
  private orientation: 'vertical' | 'horizontal'
  private buttons: Phaser.GameObjects.Container[]
  private container: Phaser.GameObjects.Container
  private currentX: number
  private currentY: number
  private hoverTint: number

  constructor(scene: Phaser.Scene, config: ButtonListBuilderConfig) {
    this.scene = scene
    this.textureKey = config.textureKey
    this.position = config.position || { x: 0, y: 0 }
    this.depth = config.depth || 0
    this.width = config.width || 100
    this.height = config.height || 50
    this.distance = config.distance || 10
    this.orientation = config.orientation || 'vertical'
    this.buttons = []
    this.container = new Phaser.GameObjects.Container(this.scene)
    this.currentX = this.position.x
    this.currentY = this.position.y
    this.hoverTint = config.hoverTint || 0xffff00 // Default hover tint to yellow
  }

  addButton(text: string, onClick?: () => void): void {
    // Create button image
    const buttonImage = this.scene.add
      .image(0, 0, this.textureKey)
      .setOrigin(0.5, 0.5)
      .setDisplaySize(this.width, this.height)
      .setInteractive()

    // Create text for the button
    const buttonText = this.scene.add
      .text(0, 0, text, {
        fontSize: '20px',
        color: '#ffffff',
      })
      .setOrigin(0.5, 0.5)

    // Create container for button and text
    const container = new Phaser.GameObjects.Container(this.scene, this.currentX, this.currentY, [
      buttonImage,
      buttonText,
    ])
    container.setSize(this.width, this.height)
    container.setDepth(this.depth)

    // Center the button and text within the container
    buttonImage.setPosition(this.width / 2, this.height / 2)
    buttonText.setPosition(this.width / 2, this.height / 2)

    // Add hover effects
    buttonImage.on('pointerover', () => {
      buttonImage.setTint(this.hoverTint)
    })

    buttonImage.on('pointerout', () => {
      buttonImage.clearTint()
    })

    // Add click event
    if (onClick) {
      buttonImage.on('pointerdown', onClick)
    }

    // Update the position for the next button based on the orientation
    if (this.orientation === 'vertical') {
      this.currentY += this.height + this.distance
    } else {
      this.currentX += this.width + this.distance
    }

    // Store button container
    this.buttons.push(container)
    this.container.add(container)
  }

  build(): Phaser.GameObjects.Container {
    return this.container
  }

  hide(): void {
    for (const container of this.buttons) {
      container.visible = false
    }
  }

  show(): void {
    for (const container of this.buttons) {
      container.visible = true
    }
  }

  destroy() {
    for (const container of this.buttons) {
      container.destroy()
    }
    this.buttons = []
  }
}
