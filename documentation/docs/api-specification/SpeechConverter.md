[**project-001-aac-api**](../../README.md)

***

Defined in: [SpeechConverter.ts:13](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/bc21471f230194581e4f0db915456df0e64b2367/src/SpeechConverter.ts#L13)

SpeechConverter handles real-time speech-to-text conversion using the Whisper model.
It manages audio input, preprocessing, and transcription directly in the browser.

## Constructors

### Constructor

> **new SpeechConverter**(): `SpeechConverter`

Defined in: [SpeechConverter.ts:21](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/bc21471f230194581e4f0db915456df0e64b2367/src/SpeechConverter.ts#L21)

#### Returns

`SpeechConverter`

## Properties

### audioHandler

> `private` **audioHandler**: `null` \| [`AudioInputHandler`](../../AudioInputHandler/classes/AudioInputHandler.md) = `null`

Defined in: [SpeechConverter.ts:17](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/bc21471f230194581e4f0db915456df0e64b2367/src/SpeechConverter.ts#L17)

Used to capture microphone input

***

### transcribedText

> `private` **transcribedText**: `null` \| [`CommandHistory`](../../CommandHistory/classes/CommandHistory.md) = `null`

Defined in: [SpeechConverter.ts:19](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/bc21471f230194581e4f0db915456df0e64b2367/src/SpeechConverter.ts#L19)

Stores all transcribed text segments captured from audio.

***

### whisper

> `private` **whisper**: `null` \| [`WhisperModule`](../../whisper/libstream/interfaces/WhisperModule.md) = `null`

Defined in: [SpeechConverter.ts:15](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/bc21471f230194581e4f0db915456df0e64b2367/src/SpeechConverter.ts#L15)

Reference to the WhisperModule instance for transcribing data

## Methods

### combineChunks()

> `private` **combineChunks**(`buffer`, `blockSize`): `Float32Array`

Defined in: [SpeechConverter.ts:122](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/bc21471f230194581e4f0db915456df0e64b2367/src/SpeechConverter.ts#L122)

Combines multiple smaller Float32Array chunks into a single fixed-size block.
If the combined length is less than oneBlockSamples, it fills up using chunks
sequentially from the buffer until the block is full or the buffer is empty.

#### Parameters

##### buffer

`Float32Array`\<`ArrayBufferLike`\>[]

Array of audio data chunks waiting to be combined

##### blockSize

`number`

Total length of Array that will be returned

#### Returns

`Float32Array`

Returns a single Array of size block size

***

### downSample()

> `private` **downSample**(`input`, `inputRate`, `outputRate`): `Float32Array`

Defined in: [SpeechConverter.ts:84](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/bc21471f230194581e4f0db915456df0e64b2367/src/SpeechConverter.ts#L84)

Takes an input Float32Array and downsamples the data to the given output rate provided

#### Parameters

##### input

`Float32Array`

Audio sample to be downsampled

##### inputRate

`number`

The sample rate that the audio was recorded in

##### outputRate

`number`

The sample rate the audio is being downsampled to

#### Returns

`Float32Array`

The down sampled data in a Float32Array object

***

### getStatus()

> **getStatus**(): `string`

Defined in: [SpeechConverter.ts:262](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/bc21471f230194581e4f0db915456df0e64b2367/src/SpeechConverter.ts#L262)

Retrieves the current status of the Whisper model.

Returns `"loading"` if the model has not been initialized yet,
otherwise returns the status string provided by the Whisper backend.

#### Returns

`string`

- The current operational status of the Whisper module.

***

### getTranscribed()

> **getTranscribed**(): `void`

Defined in: [SpeechConverter.ts:244](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/bc21471f230194581e4f0db915456df0e64b2367/src/SpeechConverter.ts#L244)

Retrieves the latest transcription result from the Whisper model and stores it.

This method calls the underlying Whisper API to obtain the most recently
transcribed text, appends it to the internal transcript list, and returns
the accumulated transcription history.

#### Returns

`void`

- An array containing all transcribed text segments so far.

#### Throws

Throws if the Whisper module has not been initialized.

***

### init()

> **init**(`modelPath`, `lang`): `Promise`\<`void`\>

Defined in: [SpeechConverter.ts:68](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/bc21471f230194581e4f0db915456df0e64b2367/src/SpeechConverter.ts#L68)

Initializes the Whisper module with the specified model and language.

This method:
1. Creates the Whisper instance asynchronously.
2. Loads the model file into the in-memory filesystem.
3. Initializes Whisper with the model path and language code.

#### Parameters

##### modelPath

`string`

Path or URL to the Whisper model file.

##### lang

`string`

Language code (e.g., 'en') to configure the model.

#### Returns

`Promise`\<`void`\>

- Resolves when the Whisper module is fully initialized.

***

### loadModelToFS()

> `private` **loadModelToFS**(`modelPath`): `Promise`\<`string`\>

Defined in: [SpeechConverter.ts:37](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/bc21471f230194581e4f0db915456df0e64b2367/src/SpeechConverter.ts#L37)

Loads a Whisper model from a given path (local or remote) into the in-memory file system.

Fetches the model file, writes it into the MEMFS, and returns the internal path
where the model is stored for later use by the Whisper instance.

#### Parameters

##### modelPath

`string`

The path or URL to the model file to load.

#### Returns

`Promise`\<`string`\>

- The internal file path in MEMFS where the model is stored.

#### Throws

Throws if the Whisper module is not initialized or fetch fails.

***

### setAudio()

> `private` **setAudio**(`index`, `audio`): `number`

Defined in: [SpeechConverter.ts:226](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/bc21471f230194581e4f0db915456df0e64b2367/src/SpeechConverter.ts#L226)

Sets the audio data at a given index for the Whisper model.

This method passes a Float32Array of audio samples
directly to the Whisper backend for processing.

#### Parameters

##### index

`number`

The index position of the audio buffer to set (usually 0 or 1 for channels).

##### audio

The raw audio data to be sent to the Whisper model.

`Float32Array`\<`ArrayBufferLike`\> | `number`[]

#### Returns

`number`

- The status code or result returned by the Whisper backend.

#### Throws

Throws if the Whisper module has not been initialized.

***

### startListening()

> **startListening**(): `void`

Defined in: [SpeechConverter.ts:160](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/bc21471f230194581e4f0db915456df0e64b2367/src/SpeechConverter.ts#L160)

Starts listening to the user's microphone input, collects audio chunks,
and feeds them into the Whisper model for transcription in real time.

The method continuously gathers small chunks from `AudioInputHandler`,
combines them into fixed-size blocks, downsamples them to 16kHz (required by Whisper),
and sends them to the model for inference.

#### Returns

`void`

#### Throws

Throws if `init()` was not called before invoking this method.

***

### stopListening()

> **stopListening**(): `void`

Defined in: [SpeechConverter.ts:206](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/bc21471f230194581e4f0db915456df0e64b2367/src/SpeechConverter.ts#L206)

Stops the audio input stream and halts the real-time transcription process.

This should be called after `startListening()` to stop capturing microphone input
and free up system audio resources.

#### Returns

`void`

#### Throws

Throws if the Whisper module has not been initialized.
