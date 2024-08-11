import type { Game } from 'phaser'
import { FMOD, type Out } from '../../lib/fmod/types'
import type {
  MusicEvent,
  MusicEventParameterId,
  MusicEventParameterValueId,
} from '../model/registries/musicEventRegistry'
import type { SfxEvent } from '../model/registries/sfxEventRegistry'

export class AudioSystem {
  private readonly game: Game
  private readonly fmodStudio: FMOD.StudioSystem
  private readonly fmodStudioCore: FMOD.System

  private readonly fmodEvents: Record<string, FMOD.EventInstance> = {}
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

    this.fmodStudioCore.setDSPBufferSize(2048, 2)

    this.setupLifecycleEvents()
  }

  private setupLifecycleEvents() {
    this.game.events.on('pause', () => {
      console.log('Suspending FMOD mixer')
      this.fmodStudioCore.mixerSuspend()
    })
    this.game.events.on('resume', () => {
      console.log('Resuming FMOD mixer')
      this.fmodStudioCore.mixerResume()
    })
  }

  private prepareEventInstance(eventId: string): FMOD.EventInstance {
    if (this.fmodEvents[eventId]) {
      return this.fmodEvents[eventId]
    }

    this.fmodStudio.getEvent(eventId, this.outMusicDescription)
    this.outMusicDescription.val.createInstance(this.outMusicInstance)

    this.fmodEvents[eventId] = this.outMusicInstance.val

    return this.fmodEvents[eventId]
  }

  public playSfx(eventDefinition: SfxEvent) {
    const sfxEvent = this.prepareEventInstance(eventDefinition.id)

    sfxEvent.start()
  }

  public setMusicVolume(volume: number) {
    this.musicVolume = volume
    for (const musicEventId in this.fmodEvents) {
      this.fmodEvents[musicEventId].setVolume(this.musicVolume)
    }
  }

  public stopMusic() {
    if (this.currentMusicEventId === null) {
      return
    }

    const musicEvent = this.prepareEventInstance(this.currentMusicEventId)
    musicEvent.stop(FMOD.STUDIO_STOP_MODE.ALLOWFADEOUT)

    this.currentMusicEventId = null
  }

  // Preffer using parameters to switch music tracks
  public playMusic(eventDefinition: MusicEvent) {
    const musicEvent = this.prepareEventInstance(eventDefinition.id)

    if (this.currentMusicEventId === eventDefinition.id) {
      return
    }

    if (this.currentMusicEventId) {
      this.fmodEvents[this.currentMusicEventId].stop(FMOD.STUDIO_STOP_MODE.ALLOWFADEOUT)
    }

    this.currentMusicEventId = eventDefinition.id
    musicEvent.setVolume(this.musicVolume)
    musicEvent.start()
  }

  public setMusicParameter<T extends MusicEvent>(
    eventDefinition: T,
    parameterName: MusicEventParameterId<T>,
    valueId: MusicEventParameterValueId<T>,
  ) {
    const value = eventDefinition.parameters[parameterName as string][valueId]

    console.log('Setting parameter', eventDefinition.id, parameterName, 'to', valueId, ':', value)
    const musicEvent = this.prepareEventInstance(eventDefinition.id)
    musicEvent.setParameterByName(parameterName as string, value as number, false)
  }

  public update() {
    this.fmodStudio.update()
  }
}
