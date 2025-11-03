[**aac-voice-api**](../../api-specification.md)

***

# Class: CommandConverter

Defined in: [CommandConverter.ts:16](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/CommandConverter.ts#L16)

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

> **processTranscription**(`transcription`): [`GameCommand`](../../commandLibrary/interfaces/GameCommand.md)[]

Defined in: [CommandConverter.ts:88](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/CommandConverter.ts#L88)

Processes new transcription text by tokenizing it and checking
each token against the CommandLibrary.

For each matched command:
- Logs it to the command log with a timestamp
- Automatically executes the command's action/callback function

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `transcription` | `string` | The new transcribed text from getTranscribed() |

#### Returns

[`GameCommand`](../../commandLibrary/interfaces/GameCommand.md)[]

Array of matched commands found in the transcription

***

### getInstance()

> `static` **getInstance**(): `CommandConverter`

Defined in: [CommandConverter.ts:40](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/CommandConverter.ts#L40)

Returns the singleton instance of CommandConverter.

#### Returns

`CommandConverter`

The single shared instance.
