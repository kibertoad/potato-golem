import { Scene } from 'phaser'
import type UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js'
import type { ViewParent } from './CommonUITypes'

export class PotatoScene extends Scene {
  rexUI!: UIPlugin
  protected readonly viewParents: ViewParent[]

  constructor(config?: string | Phaser.Types.Scenes.SettingsConfig) {
    super(config)

    this.viewParents = []
  }
}
