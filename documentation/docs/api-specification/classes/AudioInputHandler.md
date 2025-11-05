[**aac-voice-api**](../api-specification.md)

***

Defined in: [AudioInputHandler.ts:12](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/8ef19aa1ae76b73971ed5e6f21dc113d3ead9745/src/AudioInputHandler.ts#L12)

AudioInputHandler is a microphone input handler that:
Captures audio from the user’s microphone.
Processes audio in chunks (Float32Array).
Sends those chunks to a callback function for further processing.
It also provides start/stop control and exposes the audio sample rate.

## Constructors

### Constructor

```ts
new AudioInputHandler(onAudioChunk): AudioInputHandler;
```

Defined in: [AudioInputHandler.ts:33](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/8ef19aa1ae76b73971ed5e6f21dc113d3ead9745/src/AudioInputHandler.ts#L33)

Creates a new AudioInputHandler.

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

`onAudioChunk`

</td>
<td>

(`chunk`) => `void`

</td>
<td>

A callback function that is called whenever
                       an audio chunk is captured. Receives a Float32Array
                       containing the audio samples.

</td>
</tr>
</tbody>
</table>

#### Returns

`AudioInputHandler`

## Properties

### isListening

```ts
isListening: boolean = false;
```

Defined in: [AudioInputHandler.ts:21](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/8ef19aa1ae76b73971ed5e6f21dc113d3ead9745/src/AudioInputHandler.ts#L21)

Flag that checks if startListening has already been called

## Methods

### getSampleRate()

```ts
getSampleRate(): number;
```

Defined in: [AudioInputHandler.ts:43](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/8ef19aa1ae76b73971ed5e6f21dc113d3ead9745/src/AudioInputHandler.ts#L43)

Returns the sample rate of the audio context.

#### Returns

`number`

The sample rate in Hz, or `undefined` if the audio context is not initialized.

***

### startListening()

```ts
startListening(): Promise<void>;
```

Defined in: [AudioInputHandler.ts:57](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/8ef19aa1ae76b73971ed5e6f21dc113d3ead9745/src/AudioInputHandler.ts#L57)

Starts capturing audio from the user's microphone.

- Prompts the user for microphone permissions.
- Creates an AudioContext and a ScriptProcessorNode to process audio in chunks.
- Calls the `onAudioChunk` callback with a Float32Array for each audio buffer.
- Handles errors such as permission denial or missing microphone hardware.

#### Returns

`Promise`\<`void`\>

A Promise that resolves when listening has started.

***

### stopListening()

```ts
stopListening(): void;
```

Defined in: [AudioInputHandler.ts:111](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/8ef19aa1ae76b73971ed5e6f21dc113d3ead9745/src/AudioInputHandler.ts#L111)

Stops capturing audio from the microphone and cleans up resources.

- Disconnects the ScriptProcessorNode from the audio graph.
- Closes the AudioContext.
- Stops all tracks of the MediaStream.
- Updates the `isListening` flag to `false`.

#### Returns

`void`
