import type Phaser from 'phaser'
import { Game } from 'phaser'
import FMODModule from '../lib/fmod/fmodstudio'
require('url:../lib/fmod/fmodstudio.js.mem') // Important for fmod to function

/*** FMOD setup ***/
// Do NOT forget to include Master to have sound
const bankUrls = [
  require('url:../assets/audio/fmod/Build/HTML5/Master.bank'),
  require('url:../assets/audio/fmod/Build/HTML5/Master.strings.bank'),
  require('url:../assets/audio/fmod/Build/HTML5/Music.bank'),
]

const getBankFilename = (bankUrl: string) => {
  return bankUrl.split('/').pop().split('?')[0]
}

const fmod: FMOD = {
  TOTAL_MEMORY: 64 * 1024 * 1024,
  preRun: () => {
    // We need to preload files before accessing them later!
    console.log('FMOD Banks', bankUrls)
    bankUrls.map((bankUrl) => {
      const filename = getBankFilename(bankUrl)
      console.log('FMOD Preload Bank', '.', filename, bankUrl)
      fmod.FS_createPreloadedFile('.', filename, bankUrl, true, false)
    })
  },
}

// Exporting FMOD so as to have it around as a global object
export let FMODStudio: FMOD.StudioSystem = null
export let FMODStudioCore: FMOD.System = null

export const initFmodGame = (gameConfig: Phaser.Types.Core.GameConfig) => {
  fmod['onRuntimeInitialized'] = () => {
    const out = { val: null }

    fmod.Studio_System_Create(out)
    FMODStudio = out.val

    FMODStudio.getCoreSystem(out)
    FMODStudioCore = out.val

    // More advanced settings to tweak the memory gestion
    FMODStudio.setAdvancedSettings({
      //Command queue size for studio async processing.
      commandqueuesize: 32768,

      //Initial size to allocate for handles. Memory for handles will grow as needed in pages.
      handleinitialsize: 32768,

      //Update period of Studio when in async mode, in milliseconds. Will be quantized to the nearest multiple of mixer duration.
      studioupdateperiod: 20,

      //Size in bytes of sample data to retain in memory when no longer used, to avoid repeated disk I/O. Use -1 to disable.
      idlesampledatapoolsize: 262144,

      //Specify the schedule delay for streams, in samples. Lower values can reduce latency when scheduling events containing streams but may cause scheduling issues if too small.
      streamingscheduledelay: 8192,

      encryptionkey: '',
    })
    FMODStudio.initialize(1024, FMOD.STUDIO_INITFLAGS.NORMAL, FMOD.INITFLAGS.NORMAL, null)

    // Loading banks, so that we can use getEvent normally after
    bankUrls.map((bankUrl) => {
      const filename = getBankFilename(bankUrl)
      FMODStudio.loadBankFile(
        filename,
        FMOD.STUDIO_LOAD_BANK_FLAGS.NORMAL | FMOD.STUDIO_LOAD_BANK_FLAGS.DECOMPRESS_SAMPLES,
        {},
      )
    })

    const game = new Game(gameConfig)
    setUpEvents(game)
  }

  FMODModule(fmod)
}

const setUpEvents = (game: Game) => {
  game.events.on('blur', () => {
    console.log('Suspending FMOD mixer')
    FMODStudioCore.mixerSuspend()
  })
  game.events.on('focus', () => {
    console.log('Resuming FMOD mixer')
    FMODStudioCore.mixerResume()
  })
}
