[**aac-voice-api**](../api-specification.md)

***

Defined in: [CommandConverter.ts:16](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/8ef19aa1ae76b73971ed5e6f21dc113d3ead9745/src/CommandConverter.ts#L16)

CommandConverter processes transcribed text in real-time, tokenizes it,
and matches words against the CommandLibrary.

This class:
- Tokenizes incoming transcription text into individual words
- Normalizes and cleans tokens (lowercase, trim, remove punctuation)
- Checks each token against the CommandLibrary
- Sends matched commands to CommandHistory with timestamps
- Automatically executes matched commands
- Invokes callback when commands are matched

## Methods

### processTranscription()

```ts
processTranscription(transcription): GameCommand[];
```

Defined in: [CommandConverter.ts:88](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/8ef19aa1ae76b73971ed5e6f21dc113d3ead9745/src/CommandConverter.ts#L88)

Processes new transcription text by tokenizing it and checking
each token against the CommandLibrary.

For each matched command:
- Logs it to the command log with a timestamp
- Automatically executes the command's action/callback function

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

`transcription`

</td>
<td>

`string`

</td>
<td>

The new transcribed text from getTranscribed()

</td>
</tr>
</tbody>
</table>

#### Returns

[`GameCommand`](../interfaces/GameCommand.md)[]

Array of matched commands found in the transcription

***

### getInstance()

```ts
static getInstance(): CommandConverter;
```

Defined in: [CommandConverter.ts:40](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/8ef19aa1ae76b73971ed5e6f21dc113d3ead9745/src/CommandConverter.ts#L40)

Returns the singleton instance of CommandConverter.

#### Returns

`CommandConverter`

The single shared instance.
