const cursorHandImg = require("../../assets/img/cursor_hand.png");
const glassPanelImg = require("../../assets/img/glassPanel.png");
import { ButtonListBuilder } from '@potato-golem/core'

export class MainMenuScene extends Phaser.Scene {
  private buttonSelector!: Phaser.GameObjects.Image;

  private buttons: Phaser.GameObjects.Image[] = [];
  private selectedButtonIndex = 0;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super("main-menu");
  }

  init() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  preload() {
    this.load.image("glass-panel", glassPanelImg);
    this.load.image("cursor-hand", cursorHandImg);
  }

  create() {
    const { width, height } = this.scale;

    // Play button
    const buttonList = new ButtonListBuilder(this)
      .textureKey("glass-panel")
      .displaySize(150, 50)
      .setExactPosition(width * 0.5, height * 0.6)
      .setSpacingOffset(0, 10)

    const playButton = buttonList.addButton()
      .text("Play")
      .onclick(() => { console.log('clickety click ')})
      .build();

    const settingsButton = buttonList.addButton()
      .text("Settings")
      .onclick(() => { console.log('clickety click ')})
      .build();

    // Credits button
    const creditsButton = buttonList.addButton()
      .text("Credits")
      .onclick(() => { console.log('clickety click ')})
      .build();

    this.buttons.push(playButton);
    this.buttons.push(settingsButton);
    this.buttons.push(creditsButton);

    playButton.on("selected", () => {
      console.log("play");
    });

    settingsButton.on("selected", () => {
      console.log("settings");
    });

    creditsButton.on("selected", () => {
      console.log("credits");
    });

    const r1 = this.add.graphics();

    // draw rectangle
    r1.fillStyle(0xffb000, 1);
    r1.fillRect(450, 200, 200, 200);

    // this line seem to cause the problem somehow
    r1.setInteractive(
      new Phaser.Geom.Rectangle(450, 200, 200, 200),
      Phaser.Geom.Rectangle.Contains
    );

    // pointer on rectangle
    r1.on(Phaser.Input.Events.POINTER_OVER, function () {
      r1.alpha = 0.5;
    });
    r1.on(Phaser.Input.Events.POINTER_OUT, function () {
      r1.alpha = 1.0;
    });
    r1.on(Phaser.Input.Events.POINTER_DOWN, function () {
      console.log("clickety clackety");
    });

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      playButton.off("selected");
      // ...
    });

    this.buttonSelector = this.add.image(0, 0, "cursor-hand");
    this.selectButton(0);
  }

  selectButton(index: number) {
    const currentButton = this.buttons[this.selectedButtonIndex];

    // set the current selected button to a white tint
    currentButton.setTint(0xffffff);

    const button = this.buttons[index];

    // set the newly selected button to a green tint
    button.setTint(0x66ff7f);

    // move the hand cursor to the right edge
    this.buttonSelector.x = button.x + button.displayWidth * 0.5;
    this.buttonSelector.y = button.y + 10;

    // store the new selected index
    this.selectedButtonIndex = index;
  }

  selectNextButton(change = 1) {
    let index = this.selectedButtonIndex + change;

    // wrap the index to the front or end of array
    if (index >= this.buttons.length) {
      index = 0;
    } else if (index < 0) {
      index = this.buttons.length - 1;
    }

    this.selectButton(index);
  }

  confirmSelection() {
    // get the currently selected button
    const button = this.buttons[this.selectedButtonIndex];

    // emit the 'selected' event
    button.emit("selected");
  }

  update() {
    const upJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up!);
    const downJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.down!);
    const spaceJustPressed = Phaser.Input.Keyboard.JustDown(
      this.cursors.space!
    );

    if (upJustPressed) {
      this.selectNextButton(-1);
    } else if (downJustPressed) {
      this.selectNextButton(1);
    } else if (spaceJustPressed) {
      this.confirmSelection();
    }
  }
}
