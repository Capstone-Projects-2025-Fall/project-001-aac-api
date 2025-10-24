[**aac-voice-api**](../api-specification.md)

***

## Classes

### SpeechConverter

Defined in: [SpeechConverter.ts:23](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/SpeechConverter.ts#L23)

SpeechConverter handles real-time speech-to-text conversion using the Whisper model.
It manages audio input, preprocessing, and transcription directly in the browser.

#### Constructors

##### Constructor

> **new SpeechConverter**(): [`SpeechConverter`](#speechconverter)

Defined in: [SpeechConverter.ts:34](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/SpeechConverter.ts#L34)

###### Returns

[`SpeechConverter`](#speechconverter)

#### Properties

##### audioHandler

> `private` **audioHandler**: `null` \| [`AudioInputHandler`](../AudioInputHandler/AudioInputHandler.md#audioinputhandler) = `null`

Defined in: [SpeechConverter.ts:27](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/SpeechConverter.ts#L27)

Used to capture microphone input

##### commandConverter

> `private` **commandConverter**: `null` \| [`CommandConverter`](../CommandConverter/CommandConverter.md#commandconverter) = `null`

Defined in: [SpeechConverter.ts:29](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/SpeechConverter.ts#L29)

Processes transcribed text and matches commands

##### textLog

> `private` **textLog**: `null` \| [`transcribedLogEntry`](#transcribedlogentry)[] = `null`

Defined in: [SpeechConverter.ts:31](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/SpeechConverter.ts#L31)

Keeps a log of all text that has been transcribed

##### transcriptionInterval?

> `private` `optional` **transcriptionInterval**: `Timeout`

Defined in: [SpeechConverter.ts:32](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/SpeechConverter.ts#L32)

##### whisper

> `private` **whisper**: `null` \| [`WhisperModule`](../whisper/libstream/libstream.md#whispermodule) = `null`

Defined in: [SpeechConverter.ts:25](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/SpeechConverter.ts#L25)

Reference to the WhisperModule instance for transcribing data

#### Methods

##### combineChunks()

> `private` **combineChunks**(`buffer`, `blockSize`): `Float32Array`

Defined in: [SpeechConverter.ts:135](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/SpeechConverter.ts#L135)

Combines multiple smaller Float32Array chunks into a single fixed-size block.
If the combined length is less than oneBlockSamples, it fills up using chunks
sequentially from the buffer until the block is full or the buffer is empty.

###### Parameters

###### buffer

`Float32Array`\<`ArrayBufferLike`\>[]

Array of audio data chunks waiting to be combined

###### blockSize

`number`

Total length of Array that will be returned

###### Returns

`Float32Array`

Returns a single Array of size block size

##### downSample()

> `private` **downSample**(`input`, `inputRate`, `outputRate`): `Float32Array`

Defined in: [SpeechConverter.ts:97](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/SpeechConverter.ts#L97)

Takes an input Float32Array and downsamples the data to the given output rate provided

###### Parameters

###### input

`Float32Array`

Audio sample to be downsampled

###### inputRate

`number`

The sample rate that the audio was recorded in

###### outputRate

`number`

The sample rate the audio is being downsampled to

###### Returns

`Float32Array`

The down sampled data in a Float32Array object

##### getLoggedText()

> **getLoggedText**(): [`transcribedLogEntry`](#transcribedlogentry)[]

Defined in: [SpeechConverter.ts:312](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/SpeechConverter.ts#L312)

###### Returns

[`transcribedLogEntry`](#transcribedlogentry)[]

##### getStatus()

> **getStatus**(): `string`

Defined in: [SpeechConverter.ts:324](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/SpeechConverter.ts#L324)

Retrieves the current status of the Whisper model.

Returns `"loading"` if the model has not been initialized yet,
otherwise returns the status string provided by the Whisper backend.

###### Returns

`string`

- The current operational status of the Whisper module.

##### getTranscribed()

> **getTranscribed**(): `string`

Defined in: [SpeechConverter.ts:266](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/SpeechConverter.ts#L266)

Retrieves the latest transcription result from the Whisper model and logs it.

This method calls the underlying Whisper API to obtain the most recently
transcribed text. If any text has been returned from whisper, it logs it.

###### Returns

`string`

- The transcribed text from the current audio chunk.

###### Throws

Throws if the Whisper module has not been initialized.

##### init()

> **init**(`modelPath`, `lang`): `Promise`\<`void`\>

Defined in: [SpeechConverter.ts:81](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/SpeechConverter.ts#L81)

Initializes the Whisper module with the specified model and language.

This method:
1. Creates the Whisper instance asynchronously.
2. Loads the model file into the in-memory filesystem.
3. Initializes Whisper with the model path and language code.

###### Parameters

###### modelPath

`string`

Path or URL to the Whisper model file.

###### lang

`string`

Language code (e.g., 'en') to configure the model.

###### Returns

`Promise`\<`void`\>

- Resolves when the Whisper module is fully initialized.

##### loadModelToFS()

> `private` **loadModelToFS**(`modelPath`): `Promise`\<`string`\>

Defined in: [SpeechConverter.ts:50](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/SpeechConverter.ts#L50)

Loads a Whisper model from a given path (local or remote) into the in-memory file system.

Fetches the model file, writes it into the MEMFS, and returns the internal path
where the model is stored for later use by the Whisper instance.

###### Parameters

###### modelPath

`string`

The path or URL to the model file to load.

###### Returns

`Promise`\<`string`\>

- The internal file path in MEMFS where the model is stored.

###### Throws

Throws if the Whisper module is not initialized or fetch fails.

##### logText()

> `private` **logText**(`text`): `void`

Defined in: [SpeechConverter.ts:298](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/SpeechConverter.ts#L298)

Takes any recognized words from whisper and logs them into an array that contains a timestamp
Excludes the string returned from whisper [BLANK_AUDIO]

###### Parameters

###### text

`string`

transcribed words that have been recognized by whisper

###### Returns

`void`

##### processText()

> `private` **processText**(`text`): `void`

Defined in: [SpeechConverter.ts:285](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/SpeechConverter.ts#L285)

Takes in text and calls CommandConverter for processing and
command matching.

###### Parameters

###### text

`string`

transcribed words that have been recognized by whisper

###### Returns

`void`

##### setAudio()

> `private` **setAudio**(`index`, `audio`): `number`

Defined in: [SpeechConverter.ts:249](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/SpeechConverter.ts#L249)

Sets the audio data at a given index for the Whisper model.

This method passes a Float32Array of audio samples
directly to the Whisper backend for processing.

###### Parameters

###### index

`number`

The index position of the audio buffer to set (usually 0 or 1 for channels).

###### audio

`Float32Array`

The raw audio data to be sent to the Whisper model.

###### Returns

`number`

- The status code or result returned by the Whisper backend.

###### Throws

Throws if the Whisper module has not been initialized.

##### startListening()

> **startListening**(): `void`

Defined in: [SpeechConverter.ts:173](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/SpeechConverter.ts#L173)

Starts listening to the user's microphone input, collects audio chunks,
and feeds them into the Whisper model for transcription in real time.

The method continuously gathers small chunks from `AudioInputHandler`,
combines them into fixed-size blocks, downsamples them to 16kHz (required by Whisper),
and sends them to the model for inference.

###### Returns

`void`

###### Throws

Throws if `init()` was not called before invoking this method.

##### stopListening()

> **stopListening**(): `void`

Defined in: [SpeechConverter.ts:229](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/SpeechConverter.ts#L229)

Stops the audio input stream and halts the real-time transcription process.

This should be called after `startListening()` to stop capturing microphone input
and free up system audio resources.

###### Returns

`void`

###### Throws

Throws if the Whisper module has not been initialized.

## Interfaces

### transcribedLogEntry

Defined in: [SpeechConverter.ts:9](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/SpeechConverter.ts#L9)

Represents a single transcription log entry.
Each entry contains the transcribed text and the time it was captured.

#### Properties

##### timestamp

> **timestamp**: `Date`

Defined in: [SpeechConverter.ts:11](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/SpeechConverter.ts#L11)

The timestamp indicating when the transcription occurred.

##### transcribedText

> **transcribedText**: `string`

Defined in: [SpeechConverter.ts:13](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/SpeechConverter.ts#L13)

The text that was transcribed at the given timestamp.
