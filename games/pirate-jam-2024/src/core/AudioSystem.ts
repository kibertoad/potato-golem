import type { Game } from 'phaser'
import { FMOD, type Out } from '../../lib/fmod/types'
import type { MusicEventId } from '../model/registries/musicEventRegistry'

export class AudioSystem {
  private readonly game: Game
  private readonly fmodStudio: FMOD.StudioSystem
  private readonly fmodStudioCore: FMOD.System

  private readonly musicEvents: Record<MusicEventId, FMOD.EventInstance> = {}
  private musicVolume = 0.2
  private currentMusicEventId: string = null
  private outMusicDescription: Out<FMOD.EventDescription> = { val: null }
  private outMusicInstance: Out<FMOD.EventInstance> = { val: null }

  constructor(game: Game, fmodStudio: FMOD.StudioSystem) {
    this.game = game
    this.fmodStudio = fmodStudio

    const out: Out<FMOD.System> = { val: null }
    this.fmodStudio.getCoreSystem(out)
    this.fmodStudioCore = out.val

    this.setupLifecycleEvents()
  }

  private setupLifecycleEvents() {
    this.game.events.on('blur', () => {
      console.log('Suspending FMOD mixer')
      this.fmodStudioCore.mixerSuspend()
    })
    this.game.events.on('focus', () => {
      console.log('Resuming FMOD mixer')
      this.fmodStudioCore.mixerResume()
    })
  }

  private prepareEventInstance(eventId: string): FMOD.EventInstance {
    if (this.musicEvents[eventId]) {
      return this.musicEvents[eventId]
    }

    this.fmodStudio.getEvent(eventId, this.outMusicDescription)
    this.outMusicDescription.val.createInstance(this.outMusicInstance)

    this.musicEvents[eventId] = this.outMusicInstance.val

    return this.musicEvents[eventId]
  }

  public setMusicVolume(volume: number) {
    this.musicVolume = volume
    for (const musicEventId in this.musicEvents) {
      this.musicEvents[musicEventId].setVolume(this.musicVolume)
    }
  }

  public playMusic(eventId: MusicEventId) {
    const musicEvent = this.prepareEventInstance(eventId)

    if (this.currentMusicEventId === eventId) {
      return
    }

    if (this.currentMusicEventId) {
      this.musicEvents[this.currentMusicEventId].stop(FMOD.STUDIO_STOP_MODE.ALLOWFADEOUT)
    }

    this.currentMusicEventId = eventId
    musicEvent.setVolume(this.musicVolume)
    musicEvent.start()
  }

  public update() {
    this.fmodStudio.update()
  }
}
