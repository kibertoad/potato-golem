import { buildDialog, CommonUIGroup, Position, TabPageBuilder } from '@potato-golem/ui'
import { PotatoScene } from '@potato-golem/ui/dist/src/ui/common/PotatoScene'

export class CouncilOverlay extends CommonUIGroup {

  static build(scene: PotatoScene, startingPosition: Position) {
    const councilOverlay = new CouncilOverlay();

    const x = 200
    const y = 500

    const proposalWindow = new TabPageBuilder(scene)
      .setWidth(400)
      .setHeight(300)
      .setPosition({
        x: 600,
        y: y - 30,
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

    return councilOverlay
  }
}
