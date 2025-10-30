[**aac-voice-api**](../../api-specification.md)

***

# Class: SpeechConverter

Defined in: [SpeechConverter.ts:23](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/SpeechConverter.ts#L23)

SpeechConverter handles real-time speech-to-text conversion using the Whisper model.
It manages audio input, preprocessing, and transcription directly in the browser.

## Constructors

### Constructor

> **new SpeechConverter**(): `SpeechConverter`

Defined in: [SpeechConverter.ts:34](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/SpeechConverter.ts#L34)

#### Returns

`SpeechConverter`

## Methods

### getLoggedText()

> **getLoggedText**(): `string`[]

Defined in: [SpeechConverter.ts:312](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/SpeechConverter.ts#L312)

#### Returns

`string`[]

***

### getStatus()

> **getStatus**(): `string`

Defined in: [SpeechConverter.ts:332](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/SpeechConverter.ts#L332)

Retrieves the current status of the Whisper model.

Returns `"loading"` if the model has not been initialized yet,
otherwise returns the status string provided by the Whisper backend.

#### Returns

`string`

- The current operational status of the Whisper module.

***

### getTranscribed()

> **getTranscribed**(): `string`

Defined in: [SpeechConverter.ts:266](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/SpeechConverter.ts#L266)

Retrieves the latest transcription result from the Whisper model and logs it.

This method calls the underlying Whisper API to obtain the most recently
transcribed text. If any text has been returned from whisper, it logs it.

#### Returns

`string`

- The transcribed text from the current audio chunk.

#### Throws

Throws if the Whisper module has not been initialized.

***

### init()

> **init**(`modelPath`, `lang`): `Promise`\<`void`\>

Defined in: [SpeechConverter.ts:81](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/SpeechConverter.ts#L81)

Initializes the Whisper module with the specified model and language.

This method:
1. Creates the Whisper instance asynchronously.
2. Loads the model file into the in-memory filesystem.
3. Initializes Whisper with the model path and language code.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `modelPath` | `string` | Path or URL to the Whisper model file. |
| `lang` | `string` | Language code (e.g., 'en') to configure the model. |

#### Returns

`Promise`\<`void`\>

- Resolves when the Whisper module is fully initialized.

***

### startListening()

> **startListening**(): `void`

Defined in: [SpeechConverter.ts:173](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/SpeechConverter.ts#L173)

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

Defined in: [SpeechConverter.ts:229](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/SpeechConverter.ts#L229)

Stops the audio input stream and halts the real-time transcription process.

This should be called after `startListening()` to stop capturing microphone input
and free up system audio resources.

#### Returns

`void`

#### Throws

Throws if the Whisper module has not been initialized.
