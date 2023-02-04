import { PotatoScene } from '../common/PotatoScene'
import { ChoiceOption } from '../common/CommonUITypes'
import { chunk } from '@potato-golem/core/dist/src/core/utils/arrayUtils'
import { validateNumber } from 'validation-utils'

export class GridButtonBuilder {
  private readonly scene: PotatoScene
  private choiceRowLength?: number
  private headerText?: string
  private title?: string
  private readonly choiceOptions: ChoiceOption[]
  private readonly actionOptions: ChoiceOption[]


  constructor(scene: PotatoScene) {
    this.scene = scene
    this.actionOptions = []
    this.choiceOptions = []
  }

  public addAction(choiceOption: ChoiceOption) {
    this.actionOptions.push(choiceOption)
    return this
  }

  public addChoice(choiceOption: ChoiceOption) {
    this.choiceOptions.push(choiceOption)
    return this
  }

  public setTitle(value: string) {
    this.title = value
    return this
  }

  public setHeaderText(value: string) {
    this.headerText = value
    return this
  }


  public setChoiceRowLength(value: number) {
    this.choiceRowLength = value
    return this
  }

  private splitChoicesIntoRows(choices: readonly ChoiceOption[]) {
    const rows = choices.map((actionOption) => {
      return this.createLabel(actionOption.text)
    })
    return chunk(rows, validateNumber(this.choiceRowLength))
  }

  build() {
    // @ts-ignore
    // @ts-ignore
    const dialog = this.scene.rexUI.add.dialog({
      x: 400,
      y: 300,

      background: this.scene.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0x3e2723),

      title: this.headerText ? this.scene.rexUI.add.label({
        background: this.scene.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0x1b0000),


        text: this.scene.add.text(0, 0, this.headerText, {
          fontSize: '24px'
        }),

        space: {
          left: 15,
          right: 15,
          top: 10,
          bottom: 10
        }
      }) : undefined,

      content: this.title ? this.scene.add.text(0, 0, this.title, {
        fontSize: '24px'
      }) : undefined,

      choicesType: 'grid-checkboxes',
      choicesHeight: 300,
      // @ts-ignore
      choices: this.splitChoicesIntoRows(this.choiceOptions),

        /*
        [
        [this.createLabel('5 AM', 'btn0'), this.createLabel('6 AM', 'btn1'), this.createLabel('7 AM', 'btn2')] as any,
        [this.createLabel('8 AM', 'btn3'), this.createLabel('9 AM', 'btn4'), this.createLabel('10 AM', 'btn5')],
        [this.createLabel('11 AM', 'btn6'), this.createLabel('12 PM', 'btn7'), this.createLabel('1 PM', 'btn8')]

         */
      //],
      /*
      choicesSetValueCallback: function(button, value) {
        if (value) {
          button.getElement('background').setStrokeStyle(1, 0xffffff);
        } else {
          button.getElement('background').setStrokeStyle();
        }
      },
       */

      actions: this.actionOptions.map((actionOption) => {
        return this.createLabel(actionOption.text)
      }),

      space: {
        title: 25,
        content: 25,
        choices: 25,
        choice: 15,
        action: 15,

        left: 25,
        right: 25,
        top: 25,
        bottom: 25,
      },

      align: {
        actions: 'right'
      },

      expand: {
        content: false,  // Content is a pure text object
      }
    })
      .layout()
      //.drawBounds(this.add.graphics(), 0xff0000)
      .popUp(1000);

    dialog
      .on('button.click', function(button, groupName, index, pointer, event) {
        console.log('button click')

        if (groupName === 'actions') {
          console.log('action')

          if (index === 0) {
            // Clear
            dialog.clearChoicesButtonStates();
          } else {
            // OK
          }
          // Display button state
          // @ts-ignore
          const states = dialog.getChoicesButtonStates();
          var s = ''
          for (var name in states) {
            s += `${name}: ${states[name]}\n`;
          }
          //this.print.text = s;
        } else {
          console.log('choice click')
          //this.print.text += `${groupName}[${index}] = ${button.text}\n`;
        }

      }, this)
  }

  createLabel(text: string, name?: string) {
    if (name === undefined) {
      name = text;
    }
    return this.scene.rexUI.add.label({
      background: this.scene.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0x6a4f4b),

      text: this.scene.add.text(0, 0, text, {
        fontSize: '24px'
      }),

      space: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10
      },

      name: name
    });
  }
}