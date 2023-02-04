import { PotatoScene } from '../common/PotatoScene'
import { BLUE } from '../constants/Colours'
import { ActivationCallback } from '../activations/ActivationTypes'
import { ChoiceOption } from '../common/CommonUITypes'

export type BuildDialogParams = {
  x: number
  y: number
  backgroundWidth: number
  backgroundHeight: number
  backgroundColour?: number
  promptText: string

  actionOptions: readonly ChoiceOption[]
  choiceOptions: readonly ChoiceOption[]
}

export function buildDialog(scene: PotatoScene, params: BuildDialogParams) {
  /*
  const actions = params.choiceOptions.map((choiceOption) => {
    return createLabel(scene, choiceOption.text, choiceOption.activation)
  })

   */

  const dialog = scene.rexUI.add.dialog({
    x: params.x,
    y: params.y,

    background: scene.rexUI.add.roundRectangle(0, 0, params.backgroundWidth, params.backgroundHeight, 20, params.backgroundColour ?? BLUE),


    /*
    title: scene.rexUI.add.label({
      background: scene.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0x003c8f),
      text: scene.add.text(0, 0, 'Title', {
        fontSize: '24px'
      }),
      space: {
        left: 15,
        right: 15,
        top: 10,
        bottom: 10
      }
    }),
     */

    content: scene.add.text(0, 0, params.promptText, {
      fontSize: '24px'
    }),

    //actions,

    /*
    actions: [
      createLabel(scene, 'Yes', () => {}),
      createLabel(scene, 'No', () => {)
    ],

     */

    actions: params.actionOptions.map((actionOption) => {
      return createLabel(scene, actionOption.text, actionOption.activation)
    }),
    choices: params.choiceOptions.map((choiceOption) => {
      return createLabel(scene, choiceOption.text, choiceOption.activation)
    }),

    space: {
      title: 25,
      content: 25,
      action: 15,
      choice: 15,

      left: 20,
      right: 20,
      top: 20,
      bottom: 20,
      choices: 20,
    },

    align: {
      actions: 'right', // 'center'|'left'|'right'
    },

    expand: {
      content: false, // Content is a pure text object
    }
  })
    .layout()
    // .drawBounds(this.add.graphics(), 0xff0000)
    .popUp(1000);

  dialog
    .on('button.click', function (button, groupName, index) {
      button.emit('click')
      //this.print.text += index + ': ' + button.text + '\n';
    })
    .on('button.over', function (button, groupName, index) {
      button.getElement('background').setStrokeStyle(1, 0xffffff);
    })
    .on('button.out', function (button, groupName, index) {
      button.getElement('background').setStrokeStyle();
    });

  return dialog
}

function createLabel (scene: PotatoScene, text: string, activation: ActivationCallback) {
  const label = scene.rexUI.add.label({
    // width: 40,
    // height: 40,

    background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0x5e92f3),

    text: scene.add.text(0, 0, text, {
      fontSize: '24px'
    }),

    space: {
      left: 10,
      right: 10,
      top: 10,
      bottom: 10
    }
  });
  label.on('click', activation)

  return label
}