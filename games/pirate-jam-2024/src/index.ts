import Phaser, { Game } from 'phaser'
import { instantiateContainer } from './model/diConfig'

import FMODModule, {FMOD as FMOD_} from '../lib/fmodstudioL'
import {STUDIO_INITFLAGS, INITFLAGS, STUDIO_LOAD_BANK_FLAGS} from '../lib/fmod_const'

const GameResolutions = {
  default: {
    width: 2560,
    height: 1440,
  },
}

const resolution = GameResolutions.default

const container = instantiateContainer()

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  parent: undefined,
  width: resolution.width,
  height: resolution.height,
  plugins: {},
  scene: [container.cradle.mainMenuScene, container.cradle.boardScene, container.cradle.musicScene],
}

/*** FMOD setup ***/
// Do NOT forget to include Master to have sound
const banks =
[
    "Master.bank",
    "Master.strings.bank",
    "Music.bank",
]

// Exporting FMOD so as to have it around as a global object
export let FMODStudio = null

const FMOD: FMOD_ = 
{
  TOTAL_MEMORY: 128 * 1024 * 1024,

  preRun()
  {
    // We need to preload files before accessing them later!
    banks.map(i => FMOD.FS_createPreloadedFile(".", i, i, true, false))
  },

  // We can only access FMOD in onRunTimeInitialized. Hence we launch the game inside it
  onRuntimeInitialized()
  {
    const out = {val: null}
    
    FMOD.Studio_System_Create(out)
    FMODStudio = out.val
    // More advanced settings to tweak the memory gestion
    FMODStudio.setAdvancedSettings(
    {
      //Command queue size for studio async processing.
      commandqueuesize : 32768,

      //Initial size to allocate for handles. Memory for handles will grow as needed in pages.
      handleinitialsize : 32768,

      //Update period of Studio when in async mode, in milliseconds. Will be quantized to the nearest multiple of mixer duration.
      studioupdateperiod : 20,

      //Size in bytes of sample data to retain in memory when no longer used, to avoid repeated disk I/O. Use -1 to disable.
      idlesampledatapoolsize : 262144,

      //Specify the schedule delay for streams, in samples. Lower values can reduce latency when scheduling events containing streams but may cause scheduling issues if too small.
      streamingscheduledelay : 8192,
    })
    FMODStudio.initialize(1024, STUDIO_INITFLAGS.NORMAL, INITFLAGS.NORMAL, null)

    // Loading banks, so that we can use getEvent normally after
    banks.map(i => FMODStudio.loadBankFile(i, STUDIO_LOAD_BANK_FLAGS.NORMAL | STUDIO_LOAD_BANK_FLAGS.DECOMPRESS_SAMPLES, {}))
    FMODStudio.getBank("bank:/Music", out)
    // out.val.loadSampleData()
    console.log(out.val)

    // Finally run game
    const game = new Game(config)
  },
}

FMODModule(FMOD)


