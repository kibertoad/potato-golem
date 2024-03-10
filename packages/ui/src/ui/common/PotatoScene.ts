import { Scene } from 'phaser'
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js'
import { ViewParent } from './CommonUITypes'

export class PotatoScene extends Scene {
  rexUI!: UIPlugin
  protected readonly viewParents: ViewParent[]

  constructor(config?: string | Phaser.Types.Scenes.SettingsConfig) {
    super(config)

    this.viewParents = []
  }

}
