import { buildDialog, CommonUIGroup, ImageBoxBuilder, Position, TabPageBuilder } from '@potato-golem/ui'
import { PotatoScene } from '@potato-golem/ui/dist/src/ui/common/PotatoScene'
import { Director } from '../generators/directorGenerator'
import { LabelBuilder } from '@potato-golem/ui/dist/src/ui/builders/LabelBuilder'
import { VpPositionWindow } from './VpPositionWindow'

export class CouncilOverlay extends CommonUIGroup {

  static build(scene: PotatoScene, startingPosition: Position, vps: readonly Director[]) {
    const councilOverlay = new CouncilOverlay();

    const x = startingPosition.x + 200
    const y = startingPosition.y + 520

    const proposalWindow = new TabPageBuilder(scene)
      .setWidth(400)
      .setHeight(300)
      .setPosition({
        x: 250,
        y: 170,
      })
      .addPage({
        pageName: 'Overview',
        content: `\
    [color=green]Timeline...: A[/color]
    [color=green]Costs......: B[/color]
    [color=yellow]Quality....: C[/color]
    [color=yellow]Ecology....: C[/color]
    [color=red]Risks......: D[/color]
        `
      })
      .build()

    const choicesDialog = buildDialog(scene, {
      x,
      y,
      promptText: 'Your choice',
      backgroundWidth: 200,
      backgroundHeight: 400,
      choiceOptions: [
        {
          text: 'Approve'
        },
        {
          text: 'Reject'
        },
        {
          text: 'Abstain'
        },
        {
          text: 'Require changes'
        },
      ],
      actionOptions: [
        {
          text: 'Confirm'
        }
      ]
    })

    let counter = 0
    for (let vp of vps) {
      counter++
      const vpWindow = VpPositionWindow.build(scene, {
        x: 360 + (200 * counter),
        y: 360
      }, vp)
    }

    return councilOverlay
  }
}
