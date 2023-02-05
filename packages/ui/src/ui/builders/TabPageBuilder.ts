import { AbstractUIBuilder } from './AbstractUIBuilder'
import { PotatoScene } from '../common/PotatoScene'
import { COLOR_DARK, COLOR_LIGHT, COLOR_PRIMARY } from '../constants/Colours'
import RexPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js'

export type PageDefinition = {
  pageName: string
  content: string

}

export class TabPageBuilder extends AbstractUIBuilder {

  private pages: PageDefinition[]


  constructor(scene: PotatoScene) {
    super(scene)
    this.pages = []
  }

  addPage(page: PageDefinition) {
    this.pages.push(page)
    return this
  }

  build() {
    // @ts-ignore
    const tabPages: RexPlugin.TabPages = this.scene.rexUI.add.tabPages({
      x: this.getX(), y: this.getY(),
      width: this.getWidth(), height: this.getHeight(),
      background: this.scene.rexUI.add.roundRectangle(0, 0, 0, 0, 0, COLOR_DARK),

      tabs: {
        space: { item: 3 },
      },
      pages: {
        fadeIn: 300,
      },

      align: {
        tabs: 'left',
      },

      space: { left: 5, right: 5, top: 5, bottom: 5, item: 10 },

    })
      .on('tab.focus', function(tab, key) {
        tab.getElement('background').setStrokeStyle(2, COLOR_LIGHT)
      })
      .on('tab.blur', function(tab, key) {
        tab.getElement('background').setStrokeStyle()
      })

    for (let page of this.pages) {
      tabPages.addPage(
        {
          key: page.pageName,
          tab: this.createLabel(this.scene, page.pageName),
          page: this.createPage(this.scene, page.content),
        },
      )
    }

    tabPages
      .layout()
      .swapFirstPage()

    return tabPages

    // Remove page testing
    // tabPages.removePage('page2', true).layout();
  }

  createLabel(scene: PotatoScene, text: string) {
    return scene.rexUI.add.label({
      width: 40, height: 40,

      background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 0, COLOR_PRIMARY),
      text: scene.add.text(0, 0, text, { fontSize: '24px' }),

      space: { left: 10, right: 10, top: 10, bottom: 10 },
    })
  }

  createPage(scene: PotatoScene, content: string) {
    //const content = `Phaser is a fast, free, and fun open source HTML5 game framework that offers WebGL and Canvas rendering across desktop and mobile web browsers. Games can be compiled to iOS, Android and native apps by using 3rd party tools. You can use JavaScript or TypeScript for development.`;

    return scene.rexUI.add.textArea({
      text: scene.rexUI.add.BBCodeText(0, 0, '', { fontSize: '24px' }),
      slider: {
        track: scene.rexUI.add.roundRectangle(0, 0, 20, 0, 10, COLOR_PRIMARY),
        thumb: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 13, COLOR_LIGHT),
      },

      content,
      /*
      : `\
    This is ${text}
    ....
    ${content}
    ....
    [color=green]${content}[/color]
    ....
    [color=cadetblue]${content}[/color]
    ....
    [color=yellow]${content}[/color]\
    `

       */
    })
  }
}