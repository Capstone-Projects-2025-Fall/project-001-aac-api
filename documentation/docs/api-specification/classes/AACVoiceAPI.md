[**aac-voice-api**](../api-specification.md)

***

Defined in: [AACVoiceAPI.ts:18](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/8ef19aa1ae76b73971ed5e6f21dc113d3ead9745/src/AACVoiceAPI.ts#L18)

AACVoiceAPI is a facade class that provides a simplified interface
to multiple underlying classes and modules related to voice processing.

This class wraps functionalities such as audio input handling, 
speech-to-text conversion, and command history management, 
exposing them through a single, easy-to-use API.

## Constructors

### Constructor

```ts
new AACVoiceAPI(): AACVoiceAPI;
```

Defined in: [AACVoiceAPI.ts:23](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/8ef19aa1ae76b73971ed5e6f21dc113d3ead9745/src/AACVoiceAPI.ts#L23)

#### Returns

`AACVoiceAPI`

## Methods

### addVoiceCommand()

```ts
addVoiceCommand(
   name, 
   action, 
   options?): boolean;
```

Defined in: [AACVoiceAPI.ts:86](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/8ef19aa1ae76b73971ed5e6f21dc113d3ead9745/src/AACVoiceAPI.ts#L86)

Adds a voice command to the system.

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

`name`

</td>
<td>

`string`

</td>
</tr>
<tr>
<td>

`action`

</td>
<td>

() => `void`

</td>
</tr>
<tr>
<td>

`options?`

</td>
<td>

\{ `active?`: `boolean`; `description?`: `string`; \}

</td>
</tr>
<tr>
<td>

`options.active?`

</td>
<td>

`boolean`

</td>
</tr>
<tr>
<td>

`options.description?`

</td>
<td>

`string`

</td>
</tr>
</tbody>
</table>

#### Returns

`boolean`

true if successfully added

***

### clearCommands()

```ts
clearCommands(): void;
```

Defined in: [AACVoiceAPI.ts:128](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/8ef19aa1ae76b73971ed5e6f21dc113d3ead9745/src/AACVoiceAPI.ts#L128)

Allows user to remove all game commands from system

#### Returns

`void`

***

### displayCommandHistory()

```ts
displayCommandHistory(): void;
```

Defined in: [AACVoiceAPI.ts:73](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/8ef19aa1ae76b73971ed5e6f21dc113d3ead9745/src/AACVoiceAPI.ts#L73)

Displays all game Commands in a toggleable modal

#### Returns

`void`

***

### getCommands()

```ts
getCommands(): string[] | [];
```

Defined in: [AACVoiceAPI.ts:121](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/8ef19aa1ae76b73971ed5e6f21dc113d3ead9745/src/AACVoiceAPI.ts#L121)

Allows user to see a list of all known game commands

#### Returns

`string`[] \| \[\]

a list of all known game commands

***

### getTranscriptionLogs()

```ts
getTranscriptionLogs(): string[];
```

Defined in: [AACVoiceAPI.ts:64](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/8ef19aa1ae76b73971ed5e6f21dc113d3ead9745/src/AACVoiceAPI.ts#L64)

Retrieves the full transcription history from the Whisper module.

#### Returns

`string`[]

An array of transcription log entries,
each containing the transcribed text and its corresponding timestamp.

***

### initiate()

```ts
initiate(url, language): void;
```

Defined in: [AACVoiceAPI.ts:35](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/8ef19aa1ae76b73971ed5e6f21dc113d3ead9745/src/AACVoiceAPI.ts#L35)

Initializes the API with the specified model and language

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

`url`

</td>
<td>

`string`

</td>
<td>

Path to URL for the Whipser model file

</td>
</tr>
<tr>
<td>

`language`

</td>
<td>

`string`

</td>
<td>

Language code to configure the model (e.g. 'en')

</td>
</tr>
</tbody>
</table>

#### Returns

`void`

***

### isRegistered()

```ts
isRegistered(name): boolean;
```

Defined in: [AACVoiceAPI.ts:113](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/8ef19aa1ae76b73971ed5e6f21dc113d3ead9745/src/AACVoiceAPI.ts#L113)

Allows user to check if a game command has already been added

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

`name`

</td>
<td>

`string`

</td>
<td>

The name of the command that is being checked

</td>
</tr>
</tbody>
</table>

#### Returns

`boolean`

true if found

***

### removeVoiceCommand()

```ts
removeVoiceCommand(name): boolean;
```

Defined in: [AACVoiceAPI.ts:104](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/8ef19aa1ae76b73971ed5e6f21dc113d3ead9745/src/AACVoiceAPI.ts#L104)

Allows user to remove a command from the system

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

`name`

</td>
<td>

`string`

</td>
<td>

The name of the command that is to be removed from the list

</td>
</tr>
</tbody>
</table>

#### Returns

`boolean`

true if successfully removed

***

### start()

```ts
start(): void;
```

Defined in: [AACVoiceAPI.ts:43](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/8ef19aa1ae76b73971ed5e6f21dc113d3ead9745/src/AACVoiceAPI.ts#L43)

Allows the user to start speaking into the microphone and initiate game commands

#### Returns

`void`

***

### stop()

```ts
stop(): void;
```

Defined in: [AACVoiceAPI.ts:54](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/8ef19aa1ae76b73971ed5e6f21dc113d3ead9745/src/AACVoiceAPI.ts#L54)

Stops all voice recording and transcription

#### Returns

`void`
