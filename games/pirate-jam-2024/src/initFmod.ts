import FMODModule from '../lib/fmod/fmodstudio'
import { FMOD, type Out } from '../lib/fmod/types'
require('url:../lib/fmod/fmodstudio.wasm') // Important for fmod to function

/*** FMOD setup ***/
// Do NOT forget to include Master to have sound
const bankUrls = [
  require('url:../assets/audio/fmod/Build/HTML5/Master.bank'),
  require('url:../assets/audio/fmod/Build/HTML5/Master.strings.bank'),
  require('url:../assets/audio/fmod/Build/HTML5/Music.bank'),
  require('url:../assets/audio/fmod/Build/HTML5/Sfx.bank'),
]

const getBankFilename = (bankUrl: string) => {
  return bankUrl.split('/').pop().split('?')[0]
}

const fmod: FMOD = {
  TOTAL_MEMORY: 256 * 1024 * 1024,
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

export const initFmod = (onInitialized: (fmodStudio: FMOD.StudioSystem) => void) => {
  fmod['onRuntimeInitialized'] = () => {
    const out = { val: null }

    fmod.Studio_System_Create(out)
    const fmodStudio: FMOD.StudioSystem = out.val

    // More advanced settings to tweak the memory gestion
    fmodStudio.setAdvancedSettings({
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
    fmodStudio.initialize(256, FMOD.STUDIO_INITFLAGS.LIVEUPDATE, FMOD.INITFLAGS.NORMAL, null)

    // Loading banks, so that we can use getEvent normally after
    const outBank: Out<FMOD.Bank> = { val: null }
    bankUrls.map((bankUrl) => {
      const filename = getBankFilename(bankUrl)
      fmodStudio.loadBankFile(
        filename,
        FMOD.STUDIO_LOAD_BANK_FLAGS.NORMAL | FMOD.STUDIO_LOAD_BANK_FLAGS.DECOMPRESS_SAMPLES,
        outBank,
      )

      // Pre-load sample data
      outBank.val.loadSampleData()
    })

    onInitialized(fmodStudio)
  }

  FMODModule(fmod)
}
