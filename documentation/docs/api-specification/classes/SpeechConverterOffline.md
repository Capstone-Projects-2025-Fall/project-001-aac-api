[**aac-voice-api**](../api-specification.md)

***

Defined in: [SpeechConverterOffline.ts:12](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/8ef19aa1ae76b73971ed5e6f21dc113d3ead9745/src/SpeechConverterOffline.ts#L12)

SpeechConverter handles real-time speech-to-text conversion using the Whisper model.
It manages audio input, preprocessing, and transcription directly in the browser.

## Implements

- [`SpeechConverterInterface`](../interfaces/SpeechConverterInterface.md)

## Constructors

### Constructor

```ts
new SpeechConverterOffline(): SpeechConverterOffline;
```

Defined in: [SpeechConverterOffline.ts:23](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/8ef19aa1ae76b73971ed5e6f21dc113d3ead9745/src/SpeechConverterOffline.ts#L23)

#### Returns

`SpeechConverterOffline`

## Methods

### getStatus()

```ts
getStatus(): string;
```

Defined in: [SpeechConverterOffline.ts:299](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/8ef19aa1ae76b73971ed5e6f21dc113d3ead9745/src/SpeechConverterOffline.ts#L299)

Retrieves the current status of the Whisper model.

Returns `"loading"` if the model has not been initialized yet,
otherwise returns the status string provided by the Whisper backend.

#### Returns

`string`

- The current operational status of the Whisper module.

#### Implementation of

[`SpeechConverterInterface`](../interfaces/SpeechConverterInterface.md).[`getStatus`](../interfaces/SpeechConverterInterface.md#getstatus)

***

### getTextLog()

```ts
getTextLog(): string[];
```

Defined in: [SpeechConverterOffline.ts:280](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/8ef19aa1ae76b73971ed5e6f21dc113d3ead9745/src/SpeechConverterOffline.ts#L280)

#### Returns

`string`[]

#### Implementation of

[`SpeechConverterInterface`](../interfaces/SpeechConverterInterface.md).[`getTextLog`](../interfaces/SpeechConverterInterface.md#gettextlog)

***

### getTranscribed()

```ts
getTranscribed(): string;
```

Defined in: [SpeechConverterOffline.ts:234](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/8ef19aa1ae76b73971ed5e6f21dc113d3ead9745/src/SpeechConverterOffline.ts#L234)

Retrieves the latest transcription result from the Whisper model and logs it.

This method calls the underlying Whisper API to obtain the most recently
transcribed text. If any text has been returned from whisper, it logs it.

#### Returns

`string`

- The transcribed text from the current audio chunk.

#### Throws

Throws if the Whisper module has not been initialized.

#### Implementation of

[`SpeechConverterInterface`](../interfaces/SpeechConverterInterface.md).[`getTranscribed`](../interfaces/SpeechConverterInterface.md#gettranscribed)

***

### init()

```ts
init(modelPath, lang): Promise<void>;
```

Defined in: [SpeechConverterOffline.ts:66](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/8ef19aa1ae76b73971ed5e6f21dc113d3ead9745/src/SpeechConverterOffline.ts#L66)

Initializes the Whisper module with the specified model and language.

This method:
1. Creates the Whisper instance asynchronously.
2. Loads the model file into the in-memory filesystem.
3. Initializes Whisper with the model path and language code.

#### Parameters

<table>
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`modelPath`

</td>
<td>

`string`

</td>
<td>

Path or URL to the Whisper model file.

</td>
</tr>
<tr>
<td>

`lang`

</td>
<td>

`string`

</td>
<td>

Language code (e.g., 'en') to configure the model.

</td>
</tr>
</tbody>
</table>

#### Returns

`Promise`\<`void`\>

- Resolves when the Whisper module is fully initialized.

#### Implementation of

[`SpeechConverterInterface`](../interfaces/SpeechConverterInterface.md).[`init`](../interfaces/SpeechConverterInterface.md#init)

***

### startListening()

```ts
startListening(): void;
```

Defined in: [SpeechConverterOffline.ts:152](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/8ef19aa1ae76b73971ed5e6f21dc113d3ead9745/src/SpeechConverterOffline.ts#L152)

Starts listening to the user's microphone input, collects audio chunks,
and feeds them into the Whisper model for transcription in real time.

The method continuously gathers small chunks from `AudioInputHandler`,
combines them into fixed-size blocks, downsamples them to 16kHz (required by Whisper),
and sends them to the model for inference.

#### Returns

`void`

#### Throws

Throws if `init()` was not called before invoking this method.

#### Implementation of

[`SpeechConverterInterface`](../interfaces/SpeechConverterInterface.md).[`startListening`](../interfaces/SpeechConverterInterface.md#startlistening)

***

### stopListening()

```ts
stopListening(): void;
```

Defined in: [SpeechConverterOffline.ts:199](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/8ef19aa1ae76b73971ed5e6f21dc113d3ead9745/src/SpeechConverterOffline.ts#L199)

Stops the audio input stream and halts the real-time transcription process.

This should be called after `startListening()` to stop capturing microphone input
and free up system audio resources.

#### Returns

`void`

#### Throws

Throws if the Whisper module has not been initialized.

#### Implementation of

[`SpeechConverterInterface`](../interfaces/SpeechConverterInterface.md).[`stopListening`](../interfaces/SpeechConverterInterface.md#stoplistening)
