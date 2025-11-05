[**aac-voice-api**](../api-specification.md)

***

Defined in: [SpeechConverterOnline.ts:5](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/8ef19aa1ae76b73971ed5e6f21dc113d3ead9745/src/SpeechConverterOnline.ts#L5)

## Implements

- [`SpeechConverterInterface`](../interfaces/SpeechConverterInterface.md)

## Constructors

### Constructor

```ts
new SpeechConverterOnline(backendURL): SpeechConverterOnline;
```

Defined in: [SpeechConverterOnline.ts:20](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/8ef19aa1ae76b73971ed5e6f21dc113d3ead9745/src/SpeechConverterOnline.ts#L20)

updates the url to point to the correct backend on initialization

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

`backendURL`

</td>
<td>

`string`

</td>
<td>

url of hosted backend

</td>
</tr>
</tbody>
</table>

#### Returns

`SpeechConverterOnline`

## Methods

### getStatus()

```ts
getStatus(): string;
```

Defined in: [SpeechConverterOnline.ts:130](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/8ef19aa1ae76b73971ed5e6f21dc113d3ead9745/src/SpeechConverterOnline.ts#L130)

Is not implemented for this implementation of SpeechConverter

#### Returns

`string`

#### Throws

Method not implemented

#### Implementation of

[`SpeechConverterInterface`](../interfaces/SpeechConverterInterface.md).[`getStatus`](../interfaces/SpeechConverterInterface.md#getstatus)

***

### getTextLog()

```ts
getTextLog(): string[];
```

Defined in: [SpeechConverterOnline.ts:195](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/8ef19aa1ae76b73971ed5e6f21dc113d3ead9745/src/SpeechConverterOnline.ts#L195)

takes the array of objects that hold the transcribed logs 
and converts it into a string of the following format
Timestamp: Transcribed text

#### Returns

`string`[]

Returns an array of transcribed logs

#### Implementation of

[`SpeechConverterInterface`](../interfaces/SpeechConverterInterface.md).[`getTextLog`](../interfaces/SpeechConverterInterface.md#gettextlog)

***

### getTranscribed()

```ts
getTranscribed(): string;
```

Defined in: [SpeechConverterOnline.ts:120](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/8ef19aa1ae76b73971ed5e6f21dc113d3ead9745/src/SpeechConverterOnline.ts#L120)

Retrieves the latest transcription result from the Whisper model and logs it.

This method calls the underlying Whisper API to obtain the most recently
transcribed text. If any text has been returned from whisper, it logs it.

#### Returns

`string`

- The transcribed text from the current audio chunk.

#### Implementation of

[`SpeechConverterInterface`](../interfaces/SpeechConverterInterface.md).[`getTranscribed`](../interfaces/SpeechConverterInterface.md#gettranscribed)

***

### init()

```ts
init(modelPath, lang): Promise<void>;
```

Defined in: [SpeechConverterOnline.ts:31](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/8ef19aa1ae76b73971ed5e6f21dc113d3ead9745/src/SpeechConverterOnline.ts#L31)

Is not implemented for this version, throws an error if called

#### Parameters

<table>
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
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
</tr>
<tr>
<td>

`lang`

</td>
<td>

`string`

</td>
</tr>
</tbody>
</table>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`SpeechConverterInterface`](../interfaces/SpeechConverterInterface.md).[`init`](../interfaces/SpeechConverterInterface.md#init)

***

### startListening()

```ts
startListening(): void;
```

Defined in: [SpeechConverterOnline.ts:48](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/8ef19aa1ae76b73971ed5e6f21dc113d3ead9745/src/SpeechConverterOnline.ts#L48)

Starts listening to the user's microphone input, collects audio chunks,
and feeds them into the backend for transcription in real time.

The method continuously gathers small chunks from `AudioInputHandler`,
combines them into fixed-size blocks and sends them to the model for inference.

#### Returns

`void`

#### Throws

Throws if fetch status is not 200

#### Throws

Throws if Promise fails to resolve

#### Implementation of

[`SpeechConverterInterface`](../interfaces/SpeechConverterInterface.md).[`startListening`](../interfaces/SpeechConverterInterface.md#startlistening)

***

### stopListening()

```ts
stopListening(): void;
```

Defined in: [SpeechConverterOnline.ts:108](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/8ef19aa1ae76b73971ed5e6f21dc113d3ead9745/src/SpeechConverterOnline.ts#L108)

Stops the audio input stream and halts the real-time transcription process.

This should be called after `startListening()` to stop capturing microphone input
and free up system audio resources.

#### Returns

`void`

#### Implementation of

[`SpeechConverterInterface`](../interfaces/SpeechConverterInterface.md).[`stopListening`](../interfaces/SpeechConverterInterface.md#stoplistening)
