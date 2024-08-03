export const enum STUDIO_INITFLAGS {
    /** Initialize normally.  */
    NORMAL = 0x00000000,
    /** Enable live update */
    LIVEUPDATE = 0x00000001,
    /** Load banks even if they reference plugins that have not been loaded */
    ALLOW_MISSING_PLUGINS = 0x00000002,
    /** Disable asynchronous processing and perform all processing on the calling thread instead. */
    SYNCHRONOUS_UPDATE = 0x00000004,
    /** Defer timeline callbacks until the main update. See Studio::EventInstance::SetCallback for more information */
    DEFERRED_CALLBACKS = 0x00000008,
    /** No additional threads are created for bank and resource loading. Loading is driven from Studio::System::update. 
     * Mainly used in non-realtime situations.  */
    LOAD_FROM_UPDATE = 0x00000010
}

/** These are bitfields to describe for a certain number of channels in a signal, which channels are being represented.
 * @description For example, a signal could be 1 channel, but contain the LFE channel only. */
export const enum CHANNELMASK {
    CHANNELMASK_FRONT_LEFT = 0x00000001,
    CHANNELMASK_FRONT_RIGHT = 0x00000002,
    CHANNELMASK_FRONT_CENTER = 0x00000004,
    CHANNELMASK_LOW_FREQUENCY = 0x00000008,
    CHANNELMASK_SURROUND_LEFT = 0x00000010,
    CHANNELMASK_SURROUND_RIGHT = 0x00000020,
    CHANNELMASK_BACK_LEFT = 0x00000040,
    CHANNELMASK_BACK_RIGHT = 0x00000080,
    CHANNELMASK_BACK_CENTER = 0x00000100,
    CHANNELMASK_MONO = CHANNELMASK_FRONT_LEFT,
    CHANNELMASK_STEREO = CHANNELMASK_FRONT_LEFT | CHANNELMASK_FRONT_RIGHT,
    CHANNELMASK_LRC = CHANNELMASK_FRONT_LEFT | CHANNELMASK_FRONT_RIGHT | CHANNELMASK_FRONT_CENTER,
    CHANNELMASK_QUAD = CHANNELMASK_FRONT_LEFT | CHANNELMASK_FRONT_RIGHT | CHANNELMASK_SURROUND_LEFT | CHANNELMASK_SURROUND_RIGHT,
    CHANNELMASK_SURROUND = CHANNELMASK_FRONT_LEFT | CHANNELMASK_FRONT_RIGHT | CHANNELMASK_FRONT_CENTER | CHANNELMASK_SURROUND_LEFT | CHANNELMASK_SURROUND_RIGHT,
    CHANNELMASK_5POINT1 = CHANNELMASK_FRONT_LEFT | CHANNELMASK_FRONT_RIGHT | CHANNELMASK_FRONT_CENTER | CHANNELMASK_LOW_FREQUENCY | CHANNELMASK_SURROUND_LEFT | CHANNELMASK_SURROUND_RIGHT,
    CHANNELMASK_5POINT1_REARS = CHANNELMASK_FRONT_LEFT | CHANNELMASK_FRONT_RIGHT | CHANNELMASK_FRONT_CENTER | CHANNELMASK_LOW_FREQUENCY | CHANNELMASK_BACK_LEFT | CHANNELMASK_BACK_RIGHT,
    CHANNELMASK_7POINT0 = CHANNELMASK_FRONT_LEFT | CHANNELMASK_FRONT_RIGHT | CHANNELMASK_FRONT_CENTER | CHANNELMASK_SURROUND_LEFT | CHANNELMASK_SURROUND_RIGHT | CHANNELMASK_BACK_LEFT | CHANNELMASK_BACK_RIGHT,
    CHANNELMASK_7POINT1 = CHANNELMASK_FRONT_LEFT | CHANNELMASK_FRONT_RIGHT | CHANNELMASK_FRONT_CENTER | CHANNELMASK_LOW_FREQUENCY | CHANNELMASK_SURROUND_LEFT | CHANNELMASK_SURROUND_RIGHT | CHANNELMASK_BACK_LEFT | CHANNELMASK_BACK_RIGHT
}

/** 
 * Specify the requested information to be output when using the logging version of FMOD. 
*/
export const enum DEBUG_FLAGS {
    /** Disable all messages */
    LEVEL_NONE = 0x00000000,
    /** Enable only error messages */
    LEVEL_ERROR = 0x00000001,
    /** Enable warning and error messages */
    LEVEL_WARNING = 0x00000002,
    /** Enable informational, warning and error messages (default) */
    LEVEL_LOG = 0x00000004,
    /** Verbose logging for memory operations. 
     * Only use this if you are debugging a memory related issue */
    TYPE_MEMORY = 0x00000100,
    /** Verbose logging for file access, only use this if you are
     * debugging a file related issue.  */
    TYPE_FILE = 0x00000200,
    /** Verbose logging for codec initialization.
     * Only use this if you are debugging a codec related issue. */
    TYPE_CODEC = 0x00000400,
    /** Verbose logging for internal errors, use this for tracking
     * the origin of error codes.  */
    TYPE_TRACE = 0x00000800,
    /** Display the time stamp of the log message in milliseconds */
    DISPLAY_TIMESTAMPS = 0x00010000,
    /** Display the source code file and line number for where the message originated */
    DISPLAY_LINENUMBERS = 0x00020000,
    /** Display the thread ID of the calling function that generated the message */
    DISPLAY_THREAD = 0x00040000
}

/** Version number of FMOD_CODEC_WAVEFORMAT structure. 
 * @description Should be set into FMOD_CODEC_STATE in the FMOD_CODEC_OPEN_CALLBACK.
 * Use this for binary compatibility and for future expansion. */
export const CODEC_WAVEFORMAT_VERSION = 3;

/** Flags that provide additional information about a particular driver */
export const enum DRIVER_STATE {
    CONNECTED = 1,
    DEFAULT = 2
}

/** Initialization flags. Use them with System::init in the flags parameter to change various behavior. Use System::setAdvancedSettings to adjust settings for some of the features that are enabled by these flags. */
export const enum INITFLAGS {
    /** Initialize normally */
    NORMAL = 0,
    /** No stream thread is created internally. Streams are driven from System.update. Mainly used with non-realtime outputs. */
    STREAM_FROM_UPDATE = 1,
    /** No mixer thread is created internally. Mixing is driven from System.update. Only applies to polling based output modes such as FMOD_OUTPUTTYPE_NOSOUND,  FMOD_OUTPUTTYPE_WAVWRITER, FMOD_OUTPUTTYPE_DSOUND, FMOD_OUTPUTTYPE_WINMM, FMOD_OUTPUTTYPE_XAUDIO. */
    MIX_FROM_UPDATE = 2,
    /** 3D calculations will be performed in right-handed coordinates. */
    _3D_RIGHTHANDED = 4,
    /** Enables usage of Channel::setLowPassGain, Channel::set3DOcclusion, or automatic usage by the Geometry API. All voices will add a software lowpass filter effect into the DSP chain which is idle unless one of the previous functions/features are used. */
    CHANNEL_LOWPASS = 256,
    /** All FMOD_3D based voices will add a software lowpass and highpass filter effect into the DSP chain which will act as a distance-automated bandpass filter. Use System::setAdvancedSettings to adjust the center frequency. */
    CHANNEL_DISTANCEFILTER = 512,
    /** Enable TCP/IP based host which allows FMOD Designer or FMOD Profiler to connect to it, and view memory, CPU and the DSP network graph in real-time. */
    PROFILE_ENABLE = 65536,
    /** Any sounds that are 0 volume will go virtual and not be processed except for having their positions updated virtually. Use System::setAdvancedSettings to adjust what volume besides zero to switch to virtual at. */
    VOL0_BECOMES_VIRTUAL = 131072,
    /** With the geometry engine, only process the closest polygon rather than accumulating all polygons the sound to listener line intersects. (Feature removed in HTML5) */
    GEOMETRY_USECLOSEST = 262144,
    /** When using FMOD_SPEAKERMODE_5POINT1 with a stereo output device, use the Dolby Pro Logic II downmix algorithm instead of the SRS Circle Surround algorithm.  */
    PREFER_DOLBY_DOWNMIX = 524288,
    /** Disables thread safety for API calls. Only use this if FMOD low level is
     * being called from a single thread, and if Studio API is not being used! */
    THREAD_UNSAFE = 1048576,
    /** Slower, but adds level metering for every single DSP unit in the graph.
     *  Use DSP::setMeteringEnabled to turn meters off individually. */
    PROFILE_METER_ALL = 2097152 
}

/** The maximum number of channels per frame of audio supported by audio files, buffers, 
 * connections and DSPs. */
export const MAX_CHANNEL_WIDTH = 32;

/** The maximum number of FMOD::System objects allowed */
export const MAX_SYSTEMS = 8;

/** Sound description bitfields, bitwise OR them together for loading and describing sounds.
 * @description By default a sound will open as a static sound that is decompressed fully into memory to PCM. (ie equivalent of FMOD_CREATESAMPLE) To have a sound stream instead, use FMOD_CREATESTREAM, or use the wrapper function System::createStream. Some opening modes (ie FMOD_OPENUSER, FMOD_OPENMEMORY, FMOD_OPENMEMORY_POINT, FMOD_OPENRAW) will need extra information. This can be provided using the FMOD_CREATESOUNDEXINFO structure. Specifying FMOD_OPENMEMORY_POINT will POINT to your memory rather allocating its own sound buffers and duplicating it internally. This means you cannot free the memory while FMOD is using it, until after Sound::release is called. With FMOD_OPENMEMORY_POINT, for PCM formats, only WAV, FSB, and RAW are supported. For compressed formats, only those formats supported by FMOD_CREATECOMPRESSEDSAMPLE are supported. With FMOD_OPENMEMORY_POINT and FMOD_OPENRAW or PCM, if using them together, note that you must pad the data on each side by 16 bytes. This is so fmod can modify the ends of the data for looping/interpolation/mixing purposes. If a wav file, you will need to insert silence, and then reset loop points to stop the playback from playing that silence. Xbox 360 memory On Xbox 360 Specifying FMOD_OPENMEMORY_POINT to a virtual memory address will cause FMOD_ERR_INVALID_ADDRESS to be returned. Use physical memory only for this functionality. FMOD_LOWMEM is used on a sound if you want to minimize the memory overhead, by having FMOD not allocate memory for certain features that are not likely to be used in a game environment. These are : 1. Sound::getName functionality is removed. 256 bytes per sound is saved
 */
export const enum MODE {
    /** Default for all modes listed below. FMOD_LOOP_OFF, FMOD_2D, FMOD_3D_WORLDRELATIVE, 
     * FMOD_3D_INVERSEROLLOFF  */
    DEFAULT = 0,
    /** For non looping sounds. (DEFAULT). Overrides FMOD_LOOP_NORMAL / FMOD_LOOP_BIDI */
    LOOP_OFF = 1,
    /** For forward looping sounds */
    LOOP_NORMAL = 2,
    /** For bidirectional sounds. (only works on software mixed static sounds). */
    LOOP_BIDI = 4,
    /** Ignores any 3D processing. (DEFAULT) */
    _2D = 8,
    /** Makes the sound positionable in 3D. Overrides FMOD_2D */
    _3D = 16,
    /** Decompress at runtime, streaming from the source provided (ie from disk)  
     * Overrides FMOD_CREATESAMPLE and FMOD_CREATECOMPRESSEDSAMPLE. 
     * Note a stream can only be played once at a time due to a stream only having 
     * 1 stream buffer and file handle. Open multiple streams to have them play concurrently. */
    CREATESTREAM = 128,
    /** Decompress at loadtime, decompressing or decoding whole file into memory as the 
     * target sample format (ie PCM). Fastest for playback and most flexible.  */
    CREATESAMPLE = 256,
    /** Load MP2/MP3/FADPCM/IMAADPCM/Vorbis/AT9 or XMA into memory and leave it compressed. 
     * Vorbis/AT9/FADPCM encoding only supported in the .FSB container format. 
     * During playback the FMOD software mixer will decode it in realtime as a 'compressed sample'. 
     * Overrides FMOD_CREATESAMPLE. If the sound data is not one of the supported formats, 
     * it will behave as if it was created with FMOD_CREATESAMPLE and decode the sound into PCM. */
    CREATECOMPRESSEDSAMPLE = 512,
    /** Opens a user created static sample or stream. 
     * Use FMOD_CREATESOUNDEXINFO to specify format, defaultfrequency, numchannels, 
     * and optionally a read callback. If a user created 'sample' is created with no read 
     * callback, the sample will be empty. Use Sound::lock and Sound::unlock to place sound 
     * data into the sound if this is the case. */
    OPENUSER = 1024,
    /** "name_or_data" will be interpreted as a pointer to memory instead of filename for 
     * creating sounds. Use FMOD_CREATESOUNDEXINFO to specify length. If used with 
     * FMOD_CREATESAMPLE or FMOD_CREATECOMPRESSEDSAMPLE, FMOD duplicates the memory into its 
     * own buffers. Your own buffer can be freed after open. If used with FMOD_CREATESTREAM, 
     * FMOD will stream out of the buffer whose pointer you passed in. In this case, your own 
     * buffer should not be freed until you have finished with and released the stream. */
    OPENMEMORY = 2048,
    /** "name_or_data" will be interpreted as a pointer to memory instead of filename for 
     * creating sounds. Use FMOD_CREATESOUNDEXINFO to specify length. This differs to 
     * FMOD_OPENMEMORY in that it uses the memory as is, without duplicating the memory 
     * into its own buffers. Cannot be freed after open, only after Sound::release. 
     * Will not work if the data is compressed and FMOD_CREATECOMPRESSEDSAMPLE is not used.  */
    OPENMEMORY_POINT = 268435456,
    /** Will ignore file format and treat as raw pcm. Use FMOD_CREATESOUNDEXINFO to 
     * specify format. Requires at least defaultfrequency, numchannels and format to be 
     * specified before it will open. Must be little endian data.  */
    OPENRAW = 4096,
    /** Just open the file, dont prebuffer or read. Good for fast opens for info, 
     * or when sound::readData is to be used.  */
    OPENONLY = 8192,
    /** For System::createSound - for accurate Sound::getLength/Channel::setPosition 
     * on VBR MP3, and MOD/S3M/XM/IT/MIDI files. Scans file first, so takes longer to open. 
     * FMOD_OPENONLY does not affect this.  */
    ACCURATETIME = 16384,
    /** For corrupted / bad MP3 files. This will search all the way through the file until 
     * it hits a valid MPEG header. Normally only searches for 4k.  */
    MPEGSEARCH = 32768,
    /** For opening sounds and getting streamed subsounds (seeking) asyncronously. 
     * Use Sound::getOpenState to poll the state of the sound as it opens or retrieves the 
     * subsound in the background. */
    NONBLOCKING = 65536,
    /** Unique sound, can only be played one at a time */
    UNIQUE = 131072,
    /** Make the sound's position, velocity and orientation relative to the listener. */
    _3D_HEADRELATIVE = 262144,
    /** Make the sound's position, velocity and orientation absolute 
     * (relative to the world). (DEFAULT)  */
    _3D_WORLDRELATIVE = 524288,
    /** This sound will follow the inverse rolloff model where mindistance = full volume, 
     * maxdistance = where sound stops attenuating, and rolloff is fixed according to the 
     * global rolloff factor. (DEFAULT) */
    _3D_INVERSEROLLOFF = 1048576,
    /** This sound will follow a linear rolloff model where mindistance = full volume, 
     * maxdistance = silence. */
    _3D_LINEARROLLOFF = 2097152,
    /** This sound will follow a linear-square rolloff model where mindistance = full volume, 
     * maxdistance = silence. */
    _3D_LINEARSQUAREROLLOFF = 4194304,
    /** This sound will follow the inverse rolloff model at distances close to mindistance 
     * and a linear-square rolloff close to maxdistance. */
    _3D_INVERSETAPEREDROLLOFF = 8388608,
    /** This sound will follow a rolloff model defined by Sound::set3DCustomRolloff / 
     * Channel::set3DCustomRolloff.  */
    _3D_CUSTOMROLLOFF = 67108864,
    /** This sound is not affect by geometry occlusion. If not specified in Sound::setMode, 
     * or Channel::setMode, the flag is cleared and it is affected by geometry again.  */
    _3D_IGNOREGEOMETRY = 1073741824,
    /** Skips id3v2/asf/etc tag checks when opening a sound, to reduce seek/read 
     * overhead when opening files (helps with CD performance).  */
    IGNORETAGS = 33554432,
    /** Removes some features from samples to give a lower memory overhead, 
     * like Sound::getName. See remarks.  */
    LOWMEM = 134217728,
    /** Load sound into the secondary RAM of supported platform. 
     * On PS3, sounds will be loaded into RSX/VRAM.  */
    LOADSECONDARYRAM = 536870912,
    /** For sounds that start virtual (due to being quiet or low importance), 
     * instead of swapping back to audible, and playing at the correct offset according to time, 
     * this flag makes the sound play from the start. */
    VIRTUAL_PLAYFROMSTART = 2147483648
}

export const enum PORT_INDEX {
    NONE = 0xFFFFFFFFFFFFFFFF
}

export const REVERB_MAXINSTANCES = 4;

/** These callback types are used with System::setCallback. */
export const enum SYSTEM_CALLBACK_TYPE {
    DEVICELISTCHANGED = 0x00000001,
    DEVICELOST = 0x00000002,
    MEMORYALLOCATIONFAILED = 0x00000004,
    THREADCREATED = 0x00000008,
    BADDSPCONNECTION = 0x00000010,
    PREMIX = 0x00000020,
    POSTMIX = 0x00000040,
    ERROR = 0x00000080,
    MIDMIX = 0x00000100,
    THREADDESTROYED = 0x00000200,
    PREUPDATE = 0x00000400,
    POSTUPDATE = 0x00000800,
    RECORDLISTCHANGED = 0x00001000,
    ALL = 0xFFFFFFFF
}

/** These callback types are used with Channel::setCallback. */
export const enum CHANNELCONTROL_CALLBACK_TYPE {
    END,
    VIRTUALVOICE,
    SYNCPOINT,
    OCCLUSION,
    MAX,
    FORCEINT 
}

/** Used to distinguish if a FMOD_CHANNELCONTROL parameter is actually a channel 
 * or a channelgroup. */
export const enum CHANNELCONTROL_TYPE {
    CHANNEL,
    CHANNELGROUP,
    FORCEINT
}

/** Specify the destination of log output when using the logging version of FMOD. */
export const enum DEBUG_MODE {
    /** Default log location per platform, i.e. Visual Studio output window, stderr, LogCat, etc. */
    TTY,
    /** Write log to specified file path */
    FILE,
    /** Call specified callback with log information */
    CALLBACK,
    FORCEINT
}

/** Parameter types for the FMOD_DSP_TYPE_CHANNELMIX filter. */
export const enum DSP_CHANNELMIX {
    OUTPUTGROUPING,
    GAIN_CH0,
    GAIN_CH1,
    GAIN_CH2,
    GAIN_CH3,
    GAIN_CH4,
    GAIN_CH5,
    GAIN_CH6,
    GAIN_CH7,
    GAIN_CH8,
    GAIN_CH9,
    GAIN_CH10,
    GAIN_CH11,
    GAIN_CH12,
    GAIN_CH13,
    GAIN_CH14,
    GAIN_CH15,
    GAIN_CH16,
    GAIN_CH17,
    GAIN_CH18,
    GAIN_CH19,
    GAIN_CH20,
    GAIN_CH21,
    GAIN_CH22,
    GAIN_CH23,
    GAIN_CH24,
    GAIN_CH25,
    GAIN_CH26,
    GAIN_CH27,
    GAIN_CH28,
    GAIN_CH29,
    GAIN_CH30,
    GAIN_CH31
}

/** Parameter types for the FMOD_DSP_CHANNELMIX_OUTPUTGROUPING parameter for
 * FMOD_DSP_TYPE_CHANNELMIX effect. */
export const enum DSP_CHANNELMIX_OUTPUT {
    DEFAULT,
    ALLMONO,
    ALLSTEREO,
    ALLQUAD,
    ALL5POINT1,
    ALL7POINT1,
    ALLFE
}

/** Parameter types for the FMOD_DSP_TYPE_CHORUS filter. */
export const enum DSP_CHORUS {
    MIX,
    RATE,
    DEPTH
}

/** Parameter types for the FMOD_DSP_TYPE_COMPRESSOR unit. 
 * This is a multichannel software limiter that is uniform across the whole spectrum. */
export const enum DSP_COMPRESSOR {
    THRESHOLD,
    RATIO,
    ATTACK,
    RELEASE,
    GAINMAKEUP,
    USESIDECHAIN,
    LINKED
}

/** Parameter types for the FMOD_DSP_TYPE_CONVOLUTIONREVERB filter. */
export const enum DSP_CONVOLUTION_REVERB {
    PARAM_IR,
    PARAM_WET,
    PARAM_DRY,
    PARAM_LINKED
}

/** Parameter types for the FMOD_DSP_TYPE_DELAY filter. */
export const enum DSP_DELAY {
    CH0,
    CH1,
    CH2,
    CH3,
    CH4,
    CH5,
    CH6,
    CH7,
    CH8,
    CH9,
    CH10,
    CH11,
    CH12,
    CH13,
    CH14,
    CH15,
    MAXDELAY  
}

/** Parameter types for the FMOD_DSP_TYPE_DISTORTION filter. */ 
export const enum DSP_DISTORTION {
    LEVEL
}

/** Parameter types for the FMOD_DSP_TYPE_ECHO filter. */
export const enum DSP_ECHO {
    DELAY,
    FEEDBACK,
    DRYLEVEL,
    WETLEVEL,
    FORCEINT
}

/** Parameter types for the FMOD_DSP_TYPE_ENVELOPEFOLLOWER unit. 
 * This is a simple envelope follower for tracking the signal level.
 * @deprecated */
export const enum DSP_EVELOPEFOLLOWER {
    ATTACK,
    RELEASE,
    ENVELOPE,
    USESIDECHAIN         
}

/** Parameter types for the FMOD_DSP_TYPE_FADER filter. */
export const enum DSP_FADER {
    GAIN,
    OVERALL_GAIN    
}

/** Parameter types for the FMOD_DSP_TYPE_FFT dsp effect. */
export const enum DSP_FFT {
    WINDOWSIZE,
    WINDOWTYPE,
    SPECTRUMDATA,
    DOMINANT_FREQ     
}

/** List of windowing methods for the FMOD_DSP_TYPE_FFT unit. 
 * Used in spectrum analysis to reduce leakage / transient signals
 * intefering with the analysis. 
 * @description This is a problem with analysis of continuous signals that 
 * only have a small portion of the signal sample (the fft window size).
 * Windowing the signal with a curve or triangle tapers the sides of the fft window 
 * to help alleviate this problem. */
export const enum DSP_FFT_WINDOW {
    RECT,
    TRIANGLE,
    HAMMING,
    HANNING,
    BLACKMAN,
    BLACKMANHARRIS 
}

/** Parameter types for the FMOD_DSP_TYPE_FLANGE filter. */
export const enum DSP_FLANGE {
    MIX,
    DEPTH,
    RATE
}

/** Parameter types for the FMOD_DSP_TYPE_HIGHPASS filter. */
export const enum DSP_HIGHPASS {
    CUTOFF,
    RESONANCE
}

/** Parameter types for the FMOD_DSP_TYPE_HIGHPASS_SIMPLE filter. */
export const enum DSP_HIGHPASS_SIMPLE {
    CUTOFF
}

/** Parameter types for the FMOD_DSP_TYPE_ITECHO filter.
 * @description This is effectively a software based echo filter that
 * emulates the DirectX DMO echo effect. Impulse tracker files can support
 *  this, and FMOD will produce the effect on ANY platform, not just those
 *  that support DirectX effects! */
export const enum DSP_ITECHO {
    WETDRYMIX,
    FEEDBACK,
    LEFTDELAY,
    RIGHTDELAY,
    PANDELAY
}

/** Parameter types for the FMOD_DSP_TYPE_ITLOWPASS filter. 
 * @description This is different to the default FMOD_DSP_TYPE_ITLOWPASS
 *  filter in that it uses a different quality algorithm and is the filter
 *  used to produce the correct sounding playback in .IT files. FMOD Studio's .IT
 *  playback uses this filter. */
export const enum DSP_ITLOWPASS {
    CUTOFF,
    RESONANCE   
}

/** Parameter types for the FMOD_DSP_TYPE_LIMITER filter. */
export const enum DSP_LIMITER {
    RELEASETIME,
    CEILING,
    MAXIMIZERGAIN,
    MODE
}

/** Parameter types for the FMOD_DSP_TYPE_LOWPASS filter. */
export const enum DSP_LOWPASS {
    CUTOFF,
    RESONANCE     
}

/** Parameter types for the FMOD_DSP_TYPE_LOWPASS_SIMPLE filter. */
export const enum DSP_LOWPASS_SIMPLE {
    CUTOFF
}

/** Parameter types for the FMOD_DSP_TYPE_MULTIBAND_EQ filter. */
export const enum DSP_MULTIBAND_EQ {
    A_FILTER,
    A_FREQUENCY,
    A_Q,
    A_GAIN,
    B_FILTER,
    B_FREQUENCY,
    B_Q,
    B_GAIN,
    C_FILTER,
    C_FREQUENCY,
    C_Q,
    C_GAIN,
    D_FILTER,
    D_FREQUENCY,
    D_Q,
    D_GAIN,
    E_FILTER,
    E_FREQUENCY,
    E_Q,
    E_GAIN    
}

/** Filter types for FMOD_DSP_MULTIBAND_EQ. */
export const enum DSP_MULTIBAND_EQ_FILTER_TYPE {
    DISABLED,
    LOWPASS_12DB,
    LOWPASS_24DB,
    LOWPASS_48DB,
    HIGHPASS_12DB,
    HIGHPASS_24DB,
    HIGHPASS_48DB,
    LOWSHELF,
    HIGHSHELF,
    PEAKING,
    BANDPASS,
    NOTCH,
    ALLPASS      
}

/** Parameter types for the FMOD_DSP_TYPE_NORMALIZE filter. */
export const enum DSP_NORMALIZE {
    FADETIME,
    THRESHHOLD,
    MAXAMP     
}

/** Parameter types for the FMOD_DSP_TYPE_OBJECTPAN DSP. 
 * @description 3D Object panners are meant for hardware 3d object systems
 *  like Dolby Atmos or Sony Morpheus. These object panners take input in,
 *  and send it to the 7.1 bed, but do not send the signal further down the
 *  DSP chain (the output of the dsp is silence). */
export const enum DSP_OBJECTPAN {
    _3D_POSITION,
    _3D_ROLLOFF,
    _3D_MIN_DISTANCE,
    _3D_MAX_DISTANCE,
    _3D_EXTENT_MODE,
    _3D_SOUND_SIZE,
    _3D_MIN_EXTENT,
    OVERALL_GAIN,
    OUTPUTGAIN   
}

/** Parameter types for the FMOD_DSP_TYPE_OSCILLATOR filter. */
export const enum DSP_OSCILLATOR {
    TYPE,
    RATE  
}

/** Parameter types for the FMOD_DSP_TYPE_PAN DSP. */
export const enum DSP_PAN {
    MODE,
    _2D_STEREO_POSITION,
    _2D_DIRECTION,
    _2D_EXTENT,
    _2D_ROTATION,
    _2D_LFE_LEVEL,
    _2D_STEREO_MODE,
    _2D_STEREO_SEPARATION,
    _2D_STEREO_AXIS,
    ENABLED_SPEAKERS,
    _3D_POSITION,
    _3D_ROLLOFF,
    _3D_MIN_DISTANCE,
    _3D_MAX_DISTANCE,
    _3D_EXTENT_MODE,
    _3D_SOUND_SIZE,
    _3D_MIN_EXTENT,
    _3D_PAN_BLEND,
    LFE_UPMIX_ENABLED,
    OVERALL_GAIN,
    SURROUND_SPEAKER_MODE,
    _2D_HEIGHT_BLEND     
}

/** Parameter values for the FMOD_DSP_PAN_2D_STEREO_MODE parameter
 *  of the FMOD_DSP_TYPE_PAN DSP. */
export const enum DSP_PAN_2D_STEREO_MODE_TYPE {
    DISTRIBUTED,
    DISCRETE     
}

/** Parameter values for the FMOD_DSP_PAN_3D_EXTENT_MODE parameter
 * of the FMOD_DSP_TYPE_PAN DSP */
export const enum DSP_PAN_3D_EXTENT_MODE_TYPE {
    AUTO,
    USER,
    OFF   
}

/** Parameter values for the FMOD_DSP_PAN_3D_ROLLOFF parameter of
 * the FMOD_DSP_TYPE_PAN DSP. */
export const enum DSP_PAN_3D_ROLLOFF_TYPE {
    LINEARSQUARED,
    LINEAR,
    INVERSE,
    INVERSETAPERED,
    CUSTOM
}

/** Parameter values for the FMOD_DSP_PAN_MODE parameter of the 
 * FMOD_DSP_TYPE_PAN DSP. */
export const enum DSP_PAN_MODE_TYPE {
    MONO,
    STEREO,
    SURROUND    
}

/** Flags for the FMOD_DSP_PAN_SUMSURROUNDMATRIX_FUNC function. */
export const enum DSP_PAN_SURROUND_FLAGS {
    DEFAULT,
    ROTATION_NOT_BIASED
}

/** Parameter types for the FMOD_DSP_TYPE_PARAMEQ filter. */
export const enum DSP_PARAMEQ {
    CENTER,
    BANDWIDTH,
    GAIN
}

/** Built-in types for the 'datatype' member of FMOD_DSP_PARAMETER_DESC_DATA. 
 * Data parameters of type other than FMOD_DSP_PARAMETER_DATA_TYPE_USER will be 
 * treated specially by the system. */
export const enum DSP_PARAMETER_DATA_TYPE {
    USER,
    OVERALLGAIN,
    _3DATTRIBUTES,
    SIDECHAIN,
    FFT,
    _3DATTRIBUTES_MULTI      
}

/** DSP float parameter mappings. These determine how values are mapped across 
 * dials and automation curves. */
export const enum DSP_PARAMETER_FLOAT_MAPPING_TYPE {
    LINEAR,
    AUTO,
    PIECEWISE_LINEAR     
}

/** DSP parameter types */
export const enum DSP_PARAMETER_TYPE {
    FLOAT,
    INT,
    BOOL,
    DATA,
    MAX   
}

/** Parameter types for the FMOD_DSP_TYPE_PITCHSHIFT filter */
export const enum DSP_PITCHSHIFT {
    PITCH,
    FFTSIZE,
    OVERLAP,
    MAXCHANNELS      
}

/** Operation type for FMOD_DSP_PROCESS_CALLBACK. */
export const enum DSP_PROCESS_OPERATION {
    PERFORM,
    QUERY 
}

/** List of interpolation types that the FMOD Studio software mixer supports. */
export const enum DSP_RESAMPLER {
    DEFAULT,
    NOINTERP,
    LINEAR,
    CUBIC,
    SPLINE,
    MAX 
}

/** Parameter types for the FMOD_DSP_TYPE_RETURN */
export const enum DSP_RETURN {
    ID,
    INPUT_SPEAKER_MODE  
}

/** Parameter types for the FMOD_DSP_TYPE_SEND DSP. */
export const enum DSP_SEND {
    RETURNID,
    LEVEL
}

/** Parameter types for the FMOD_DSP_TYPE_SFXREVERB unit. */
export const enum DSP_SFXREVERB {
    DECAYTIME,
    EARLYDELAY,
    LATEDELAY,
    HFREFERENCE,
    HFDECAYRATIO,
    DIFFUSION,
    DENSITY,
    LOWSHELFFREQUENCY,
    LOWSHELFGAIN,
    HIGHCUT,
    EARLYLATEMIX,
    WETLEVEL,
    DRYLEVEL 
}

/** Parameter types for the FMOD_DSP_TYPE_THREE_EQ filter. */
export const  enum DSP_THREE_EQ {
    LOWGAIN,
    MIDGAIN,
    HIGHGAIN,
    LOWCROSSOVER,
    HIGHCROSSOVER,
    CROSSOVERSLOPE
}

/** Parameter values for the FMOD_DSP_THREE_EQ_CROSSOVERSLOPE parameter 
 * of the FMOD_DSP_TYPE_THREE_EQ DSP. */
export const enum DSP_THREE_EQ_CROSSOVERSLOPE_TYPE {
    _12DB,
    _24DB,
    _48DB
}

/** Parameter types for the FMOD_DSP_TYPE_TRANSCEIVER filter */
export const enum DSP_TRANSCEIVER {
    TRANSMIT,
    GAIN,
    CHANNEL,
    TRANSMITSPEAKERMODE
}

/** Parameter types for the FMOD_DSP_TRANSCEIVER_SPEAKERMODE parameter for 
 * FMOD_DSP_TYPE_TRANSCEIVER effect. */
export const enum DSP_TRANSCEIVER_SPEAKERMODE {
    AUTO,
    MONO,
    STEREO,
    SURROUND
}

/** Parameter types for the FMOD_DSP_TYPE_TREMOLO filter. */
export const enum DSP_TREMOLO {
    FREQUENCY,
    DEPTH,
    SHAPE,
    SKEW,
    DUTY,
    SQUARE,
    PHASE,
    SPREAD
}
/** These definitions can be used for creating FMOD defined special effects 
 * or DSP units. */
export const enum DSP_TYPE {
    UNKNOWN,
    MIXER,
    OSCILLATOR,
    LOWPASS,
    ITLOWPASS,
    HIGHPASS,
    ECHO,
    FADER,
    FLANGE,
    DISTORTION,
    NORMALIZE,
    LIMITER,
    PARAMEQ,
    PITCHSHIFT,
    CHORUS,
    VSTPLUGIN,
    WINAMPPLUGIN,
    ITECHO,
    COMPRESSOR,
    SFXREVERB,
    LOWPASS_SIMPLE,
    DELAY,
    TREMOLO,
    LADSPAPLUGIN,
    SEND,
    RETURN,
    HIGHPASS_SIMPLE,
    PAN,
    THREE_EQ,
    FFT,
    LOUDNESS_METER,
    ENVELOPEFOLLOWER,
    CONVOLUTIONREVERB,
    CHANNELMIX,
    TRANSCEIVER,
    OBJECTPAN,
    MULTIBAND_EQ,
    MAX 
}

/** Used to distinguish the instance type passed into FMOD_ERROR_CALLBACK */
export const enum ERRORCALLBACK_INSTANCETYPE {
    NONE,
    SYSTEM,
    CHANNEL,
    CHANNELGROUP,
    CHANNELCONTROL,
    SOUND,
    SOUNDGROUP,
    DSP,
    DSPCONNECTION,
    GEOMETRY,
    REVERB3D,
    STUDIO_SYSTEM,
    STUDIO_EVENTDESCRIPTION,
    STUDIO_EVENTINSTANCE,
    STUDIO_PARAMETERINSTANCE,
    STUDIO_BUS,
    STUDIO_VCA,
    STUDIO_BANK,
    STUDIO_COMMANDREPLAY
}

/** These values describe what state a sound is in after FMOD_NONBLOCKING
 *  has been used to open it. */
export const enum OPENSTATE {
    READY,
    LOADING,
    ERROR,
    CONNECTING,
    BUFFERING,
    SEEKING,
    PLAYING,
    SETPOSITION,
    MAX
}

/** These output types are used with System::setOutput / System::getOutput, 
 * to choose which output method to use. */
export const enum OUTPUTTYPE {
    AUTODETECT,
    UNKNOWN,
    NOSOUND,
    WAVWRITER,
    NOSOUND_NRT,
    WAVWRITER_NRT,
    DSOUND,
    WINMM,
    WASAPI,
    ASIO,
    PULSEAUDIO,
    ALSA,
    COREAUDIO,
    XAUDIO,
    PS3,
    AUDIOTRACK,
    OPENSL,
    WIIU,
    AUDIOOUT,
    AUDIO3D,
    ATMOS,
    WEBAUDIO,
    NNAUDIO,
    WINSONIC,
    MAX
}

/** These are plugin types defined for use with the System::getNumPlugins, 
 * System::getPluginInfo and System::unloadPlugin functions. */
export const enum PLUGINTYPE {
    OUTPUT,
    CODEC,
    DSP,
    MAX 
}

/** Error codes. Returned from every function. */
export const enum RESULT {
    OK,
    ERR_BADCOMMAND,
    ERR_CHANNEL_ALLOC,
    ERR_CHANNEL_STOLEN,
    ERR_DMA,
    ERR_DSP_CONNECTION,
    ERR_DSP_DONTPROCESS,
    ERR_DSP_FORMAT,
    ERR_DSP_INUSE,
    ERR_DSP_NOTFOUND,
    ERR_DSP_RESERVED,
    ERR_DSP_SILENCE,
    ERR_DSP_TYPE,
    ERR_FILE_BAD,
    ERR_FILE_COULDNOTSEEK,
    ERR_FILE_DISKEJECTED,
    ERR_FILE_EOF,
    ERR_FILE_ENDOFDATA,
    ERR_FILE_NOTFOUND,
    ERR_FORMAT,
    ERR_HEADER_MISMATCH,
    ERR_HTTP,
    ERR_HTTP_ACCESS,
    ERR_HTTP_PROXY_AUTH,
    ERR_HTTP_SERVER_ERROR,
    ERR_HTTP_TIMEOUT,
    ERR_INITIALIZATION,
    ERR_INITIALIZED,
    ERR_INTERNAL,
    ERR_INVALID_FLOAT,
    ERR_INVALID_HANDLE,
    ERR_INVALID_PARAM,
    ERR_INVALID_POSITION,
    ERR_INVALID_SPEAKER,
    ERR_INVALID_SYNCPOINT,
    ERR_INVALID_THREAD,
    ERR_INVALID_VECTOR,
    ERR_MAXAUDIBLE,
    ERR_MEMORY,
    ERR_MEMORY_CANTPOINT,
    ERR_NEEDS3D,
    ERR_NEEDSHARDWARE,
    ERR_NET_CONNECT,
    ERR_NET_SOCKET_ERROR,
    ERR_NET_URL,
    ERR_NET_WOULD_BLOCK,
    ERR_NOTREADY,
    ERR_OUTPUT_ALLOCATED,
    ERR_OUTPUT_CREATEBUFFER,
    ERR_OUTPUT_DRIVERCALL,
    ERR_OUTPUT_FORMAT,
    ERR_OUTPUT_INIT,
    ERR_OUTPUT_NODRIVERS,
    ERR_PLUGIN,
    ERR_PLUGIN_MISSING,
    ERR_PLUGIN_RESOURCE,
    ERR_PLUGIN_VERSION,
    ERR_RECORD,
    ERR_REVERB_CHANNELGROUP,
    ERR_REVERB_INSTANCE,
    ERR_SUBSOUNDS,
    ERR_SUBSOUND_ALLOCATED,
    ERR_SUBSOUND_CANTMOVE,
    ERR_TAGNOTFOUND,
    ERR_TOOMANYCHANNELS,
    ERR_TRUNCATED,
    ERR_UNIMPLEMENTED,
    ERR_UNINITIALIZED,
    ERR_UNSUPPORTED,
    ERR_VERSION,
    ERR_EVENT_ALREADY_LOADED,
    ERR_EVENT_LIVEUPDATE_BUSY,
    ERR_EVENT_LIVEUPDATE_MISMATCH,
    ERR_EVENT_LIVEUPDATE_TIMEOUT,
    ERR_EVENT_NOTFOUND,
    ERR_STUDIO_UNINITIALIZED,
    ERR_STUDIO_NOT_LOADED,
    ERR_INVALID_STRING,
    ERR_ALREADY_LOCKED,
    ERR_NOT_LOCKED,
    ERR_RECORD_DISCONNECTED,
    ERR_TOOMANYSAMPLES 
}

/** These values are used with SoundGroup::setMaxAudibleBehavior to determine
 *  what happens when more sounds are played than are specified with
 *  SoundGroup::setMaxAudible. */
export const enum SOUNDGROUP_BEHAVIOR {
    FAIL,
    MUTE,
    STEALLOWEST,
    MAX,
    FORCEINT
}

/** These definitions describe the native format of the hardware or software 
 * buffer that will be used */
export const enum SOUND_FORMAT {
    NONE,
    PCM8,
    PCM16,
    PCM24,
    PCM32,
    PCMFLOAT,
    BITSTREAM,
    MAX,
    FORCEINT
}

/** These definitions describe the type of sound being played */
export const enum SOUND_TYPE {
    UNKNOWN,
    AIFF,
    ASF,
    DLS,
    FLAC,
    FSB,
    IT,
    MIDI,
    MOD,
    MPEG,
    OGGVORBIS,
    PLAYLIST,
    RAW,
    S3M,
    USER,
    WAV,
    XM,
    XMA,
    AUDIOQUEUE,
    AT9,
    VORBIS,
    MEDIA_FOUNDATION,
    MEDIACODEC,
    FADPCM,
    MAX
  
}

/** Assigns an enumeration for a speaker index. */
export const enum SPEAKER {
    FRONT_LEFT,
    FRONT_RIGHT,
    FRONT_CENTER,
    LOW_FREQUENCY,
    SURROUND_LEFT,
    SURROUND_RIGHT,
    BACK_LEFT,
    BACK_RIGHT,
    TOP_FRONT_LEFT,
    TOP_FRONT_RIGHT,
    TOP_BACK_LEFT,
    TOP_BACK_RIGHT,
    MAX
}

/** These are speaker types defined for use with the System::setSoftwareFormat command */
export const enum SPEAKERMODE {
    DEFAULT,
    RAW,
    MONO,
    STEREO,
    QUAD,
    SURROUND,
    _5POINT1,
    _7POINT1,
    _7POINT1POINT4,
    MAX
}

/** List of data types that can be returned by Sound::getTag  */
export const enum TAGDATATYPE {
    BINARY,
    INT,
    FLOAT,
    STRING,
    STRING_UTF16,
    STRING_UTF16BE,
    STRING_UTF8,
    CDTOC,
    MAX
}

/** List of tag types that could be stored within a sound. 
 * These include id3 tags, metadata from netstreams and vorbis/asf data. */
export const enum TAGTYPE {
    UNKNOWN,
    ID3V1,
    ID3V2,
    VORBISCOMMENT,
    SHOUTCAST,
    ICECAST,
    ASF,
    MIDI,
    PLAYLIST,
    FMOD,
    USER,
    MAX
}

/** Flags passed into Studio.System.loadCommandReplay */
export const enum STUDIO_COMMANDREPLAY_FLAGS {
    /** Standard behavior. */
    NORMAL = 0x00000000,
    /** Normally the playback will release any created resources when it stops, unless this flag is set. */
    SKIP_CLEANUP = 0x00000001,
    /** Play back at maximum speed, ignoring the timing of the original replay */
    FAST_FORWARD = 0x00000002,
    /** Skips commands related to bank loading. */
    SKIP_BANK_LOAD = 0x00000004
}

export const enum STUDIO_EVENT_CALLBACK_TYPE {
    /** Called when an instance is fully created. Parameters = unused.  */
    CREATED = 0x00000001,
    /** Called when an instance is just about to be destroyed. Parameters = unused.  */
    DESTROYED = 0x00000002,
    /** Called when an instance is preparing to start. Parameters = unused */
    STARTING = 0x00000004,
    /** Called when an instance starts playing. Parameters = unused. */
    STARTED = 0x00000008,
    /** Called when an instance is restarted. Parameters = unused. */
    RESTARTED = 0x00000010,
    /** Called when an instance stops. Parameters = unused.  */
    STOPPED = 0x00000020,
    /** Called when an instance did not start, e.g. due to polyphony. Parameters = unused.  */
    START_FAILED = 0x00000040,
    /** Called when a programmer sound needs to be created in order to play a programmer instrument. 
     * Parameters = FMOD_STUDIO_PROGRAMMER_SOUND_PROPERTIES.  */
    CREATE_PROGRAMMER_SOUND = 0x00000080,
    /** FMOD_STUDIO_EVENT_CALLBACK_DESTROY_PROGRAMMER_SOUND Called when a programmer sound needs to be destroyed. 
     * Parameters = FMOD_STUDIO_PROGRAMMER_SOUND_PROPERTIES. */
    DESTROY_PROGRAMMER_SOUND = 0x00000100,
    /** Called when a DSP plugin instance has just been created. Parameters = FMOD_STUDIO_PLUGIN_INSTANCE_PROPERTIES.  */
    PLUGIN_CREATED = 0x00000200,
    /** Called when a DSP plugin instance is about to be destroyed. Parameters = FMOD_STUDIO_PLUGIN_INSTANCE_PROPERTIES.  */
    PLUGIN_DESTROYED = 0x00000400,
    /** Called when the timeline passes a named marker. Parameters = FMOD_STUDIO_TIMELINE_MARKER_PROPERTIES.  */
    TIMELINE_MARKER = 0x00000800,
    /** Called when the timeline hits a beat in a tempo section. Parameters = FMOD_STUDIO_TIMELINE_BEAT_PROPERTIES.  */
    TIMELINE_BEAT = 0x00001000,
    /** Called when the event plays a sound. Parameters = FMOD::Sound.  */
    SOUND_PLAYED = 0x00002000,
    /** Called when the event finishes playing a sound. Parameters = FMOD::Sound.  */
    SOUND_STOPPED = 0x00004000,
    /** Pass this mask to Studio::EventDescription::setCallback or Studio::EventInstance::setCallback to 
     * receive all callback types. */
    ALL = 0xFFFFFFFF
}

/** Flags passed into Studio loadBank commands to control bank load behaviour.
 * Normal JavaScript: FMOD.STUDIO_BANK_ + the enum value */
export const enum STUDIO_LOAD_BANK_FLAGS {
    /** Standard behavior */
    NORMAL = 0x00000000,
    /** Loading occurs asynchronously (not in HTML5) */
    NONBLOCKING = 0x00000001,
    /** Force samples to decompress into memory when they are loaded, rather than staying compressed */
    DECOMPRESS_SAMPLES = 0x00000002
}

/** These callback types are used with Studio::System::setCallback. */
export const enum STUDIO_SYSTEM_CALLBACK_TYPE {
    /** Called at the start of the main Studio update. For async mode this will be on its own thread.  */
    PREUPDATE = 0x00000001,
    /** Called at the end of the main Studio update. For async mode this will be on its own thread.  */
    POSTUPDATE = 0x00000002,
    /** Called when bank has just been unloaded, after all resources are freed. CommandData will be the bank handle. */
    BANK_UNLOAD = 0x00000004,
    /** Pass this mask to Studio::System::setCallback to receive all callback types. */
    ALL = 0xFFFFFFFF
}
// #endregion Studio Defines //////////////////////////////////////////////////////

/**  */
export const enum STUDIO_INSTANCETYPE {
    NONE,
    SYSTEM,
    EVENTDESCRIPTION,
    EVENTINSTANCE,
    PARAMETERINSTANCE,
    BUS,
    VCA,
    BANK,
    COMMANDREPLAY     
}

/** Specifies how to use the memory buffer passed to Studio::System::loadBankMemory. */
export const enum STUDIO_LOAD_MEMORY_MODE {
    /** Duplicates the memory into its own buffers, memory can be freed after Studio::System::loadBankMemory returns.  */
    MEMORY,
    /** Copies the memory pointer without duplicating the memory into its own buffers, 
     * memory can be freed after receiving a FMOD_STUDIO_SYSTEM_CALLBACK_BANK_UNLOAD callback.  */
    MEMORY_POINT,
}
export interface STUDIO_PARAMETER_ID {
	/**
	 * First half of the ID.
	 */
	data1: number;
	/**
	 * Second half of the ID.
	 */
	data2: number;
}
/** Describes the type of a parameter. */
export const enum STUDIO_PARAMETER_TYPE {
    /** Controlled via the API using Studio::EventInstance::setParameterValue.  */
    GAME_CONTROLLED,
    /** Distance between the event and the listener.  */
    AUTOMATIC_DISTANCE,
    /** Angle between the event's forward vector and the vector pointing from the event to the listener (0 to 180 degrees).  */
    AUTOMATIC_EVENT_CONE_ANGLE,
    /** Horizontal angle between the event's forward vector and listener's forward vector (-180 to 180 degrees).  */
    AUTOMATIC_EVENT_ORIENTATION,
    /** Horizontal angle between the listener's forward vector and the vector pointing from the listener to the event (-180 to 180 degrees).  */
    AUTOMATIC_DIRECTION,
    /** Angle between the listener's XZ plane and the vector pointing from the listener to the event (-90 to 90 degrees).  */
    AUTOMATIC_ELEVATION,
    /** Horizontal angle between the listener's forward vector and the global positive Z axis (-180 to 180 degrees).  */
    AUTOMATIC_LISTENER_ORIENTATION,
    /** Maximum number of parameter types supported */
    MAX    
}

/** Controls how to stop playback of an event instance. */
export const enum STUDIO_STOP_MODE {
    /** Allows AHDSR modulators to complete their release, and DSP effect tails to play out. */
    ALLOWFADEOUT,
    /** Stops the event instance immediately.  */
    IMMEDIATE     
}

/** These definitions describe a user property's type. */
export const enum STUDIO_USER_PROPERTY_TYPE {
    INTEGER,
    BOOLEAN,
    FLOAT,
    STRING   
}


/** Length in bytes of the buffer pointed to by the valuestr argument of FMOD_DSP_GETPARAM_XXXX_CALLBACK functions. DSP plugins should not copy more than this number of bytes into the buffer or memory corruption will occur. */
export const DSP_GETPARAM_VALUESTR_LENGTH = 32;

/** The maximum number of listeners supported */
export const MAX_LISTENERS = 8;

/** List of time types that can be returned by Sound::getLength and used with 
 * Channel::setPosition or Channel::getPosition. */
export const enum TIMEUNIT {
    MS = 0x00000001,
    PCM = 0x00000002,
    PCMBYTES = 0x00000004,
    RAWBYTES = 0x00000008,
    PCMFRACTION = 0x00000010,
    MODORDER = 0x00000100,
    MODROW = 0x00000200,
    MODPATTERN = 0x00000400,
}

// #endregion LOW LEVEL SYSTEM DEFINES

/** These enums denote special types of node within a DSP chain. */
export const enum CHANNELCONTROL_DSP_INDEX {
    HEAD,
    FADER,
    TAIL,
    INDEX,
    FORCEINT
}

/** List of connection types between 2 DSP nodes. */
export const enum DSPCONNECTION_TYPE {
    STANDARD,
    SIDECHAIN,
    SEND,
    SEND_SIDECHAIN,
    MAX,
    FORCEINT
}

/** These values describe the loading status of various objects.  */
export const enum STUDIO_LOADING_STATE{
    /** Currently unloading */
    UNLOADING,
    /** Not loaded */
    UNLOADED,
    /** Loading in progress */
    LOADING,
    /** Loaded and ready to play */
    LOADED,
    /** Failed to load and is now in error state */
    ERROR     
}

/** Bit fields for memory allocation type being passed into FMOD memory callbacks.
 * @description Remember this is a bitfield. You may get more than 1 bit set (ie physical + persistent) so do not simply switch on the types! You must check each bit individually or clear out the bits that you do not want within the callback. Bits can be excluded if you want during Memory_Initialize so that you never get them. */
export const enum MEMORY_TYPE {
    /** Standard memory. */
    MEMORY_NORMAL = 0x00000000,
    /** Stream file buffer, size controllable with System::setStreamBufferSize. */
    MEMORY_STREAM_FILE = 0x00000001,
    /** Stream decode buffer, size controllable with 
     * FMOD_CREATESOUNDEXINFO::decodebuffersize. */
    MEMORY_STREAM_DECODE = 0x00000002,
    /** Sample data buffer. Raw audio data, usually PCM/MPEG/ADPCM/XMA data */
    MEMORY_SAMPLEDATA = 0x00000004,
    /** DSP memory block allocated when more than 1 output exists on a DSP node. */
    MEMORY_DSP_BUFFER = 0x00000008,
    /** Memory allocated by a third party plugin. */
    MEMORY_PLUGIN = 0x00000010,
    /** Requires XPhysicalAlloc / XPhysicalFree.  */
    MEMORY_XBOX360_PHYSICAL = 0x00100000,
    /** Persistent memory. Memory will be freed when System::release is called. */
    MEMORY_PERSISTENT = 0x00200000,
    /** Secondary memory. Allocation should be in secondary memory. 
     * For example RSX on the PS3.  */
    MEMORY_SECONDARY = 0x00400000,
    MEMORY_ALL = 0xFFFFFFFF
}

/** When creating a multichannel sound, FMOD will pan them to their default speaker
 * locations, for example a 6 channel sound will default to one channel per 5.1 output
 * speaker. Another example is a stereo sound. It will default to left = front left, right = front right. */
export const enum CHANNELORDER {
    DEFAULT,
    WAVEFORMAT,
    PROTOOLS,
    ALLMONO,
    ALLSTEREO,
    ALSA,
    MAX,
    FORCEINT
}

/** These values describe the playback state of an event instance. */
export const enum STUDIO_PLAYBACK_STATE {
    /** Currently playing. */
    PLAYING,
    /** The timeline cursor is paused on a sustain point. */
    SUSTAINING,
    /** Not playing.  */
    STOPPED,
    /** Start has been called but the instance is not fully started yet.  */
    STARTING,
    /** Stop has been called but the instance is not fully stopped yet. */
    STOPPING   
}
