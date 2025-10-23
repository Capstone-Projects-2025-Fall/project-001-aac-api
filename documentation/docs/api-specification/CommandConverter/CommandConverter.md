[**aac-voice-api**](../api-specification.md)

***

## Classes

### CommandConverter

Defined in: [CommandConverter.ts:16](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/2e181446a0955d6e69720fafcb5e1ba075e3f20f/src/CommandConverter.ts#L16)

CommandConverter processes transcribed text in real-time, tokenizes it,
and matches words against the CommandLibrary.

This class:
- Tokenizes incoming transcription text into individual words
- Normalizes and cleans tokens (lowercase, trim, remove punctuation)
- Checks each token against the CommandLibrary
- Sends matched commands to CommandHistory with timestamps
- Automatically executes matched commands
- Invokes callback when commands are matched

#### Constructors

##### Constructor

> `private` **new CommandConverter**(): [`CommandConverter`](#commandconverter)

Defined in: [CommandConverter.ts:30](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/2e181446a0955d6e69720fafcb5e1ba075e3f20f/src/CommandConverter.ts#L30)

Private constructor prevents direct instantiation

###### Returns

[`CommandConverter`](#commandconverter)

#### Properties

##### commandHistory

> `private` **commandHistory**: [`CommandHistory`](../CommandHistory/CommandHistory.md#commandhistory)

Defined in: [CommandConverter.ts:21](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/2e181446a0955d6e69720fafcb5e1ba075e3f20f/src/CommandConverter.ts#L21)

Reference to CommandHistory for logging matched commands

##### library

> `private` **library**: [`CommandLibrary`](../commandLibrary/commandLibrary.md#commandlibrary)

Defined in: [CommandConverter.ts:18](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/2e181446a0955d6e69720fafcb5e1ba075e3f20f/src/CommandConverter.ts#L18)

Reference to the CommandLibrary for looking up commands

##### onCommandMatched()?

> `private` `optional` **onCommandMatched**: (`commands`, `transcription`) => `void`

Defined in: [CommandConverter.ts:24](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/2e181446a0955d6e69720fafcb5e1ba075e3f20f/src/CommandConverter.ts#L24)

Callback function invoked when commands are matched

###### Parameters

###### commands

[`GameCommand`](../commandLibrary/commandLibrary.md#gamecommand)[]

###### transcription

`string`

###### Returns

`void`

##### instance

> `private` `static` **instance**: [`CommandConverter`](#commandconverter)

Defined in: [CommandConverter.ts:27](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/2e181446a0955d6e69720fafcb5e1ba075e3f20f/src/CommandConverter.ts#L27)

The single global instance of CommandConverter

#### Methods

##### logCommand()

> `private` **logCommand**(`command`, `originalText`, `status`): `void`

Defined in: [CommandConverter.ts:138](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/2e181446a0955d6e69720fafcb5e1ba075e3f20f/src/CommandConverter.ts#L138)

Logs a matched command to the command log.

###### Parameters

###### command

[`GameCommand`](../commandLibrary/commandLibrary.md#gamecommand)

The matched command

###### originalText

`string`

The original transcription text

###### status

Whether the command callback executed successfully

`"success"` | `"failed"`

###### Returns

`void`

##### normalize()

> `private` **normalize**(`word`): `string`

Defined in: [CommandConverter.ts:55](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/2e181446a0955d6e69720fafcb5e1ba075e3f20f/src/CommandConverter.ts#L55)

Normalizes a word by converting to lowercase, trimming whitespace,
and removing common punctuation marks.

###### Parameters

###### word

`string`

The word to normalize

###### Returns

`string`

The normalized word

##### processTranscription()

> **processTranscription**(`transcription`): [`GameCommand`](../commandLibrary/commandLibrary.md#gamecommand)[]

Defined in: [CommandConverter.ts:88](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/2e181446a0955d6e69720fafcb5e1ba075e3f20f/src/CommandConverter.ts#L88)

Processes new transcription text by tokenizing it and checking
each token against the CommandLibrary.

For each matched command:
- Logs it to the command log with a timestamp
- Automatically executes the command's action/callback function

###### Parameters

###### transcription

`string`

The new transcribed text from getTranscribed()

###### Returns

[`GameCommand`](../commandLibrary/commandLibrary.md#gamecommand)[]

Array of matched commands found in the transcription

##### tokenize()

> `private` **tokenize**(`transcription`): `string`[]

Defined in: [CommandConverter.ts:70](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/2e181446a0955d6e69720fafcb5e1ba075e3f20f/src/CommandConverter.ts#L70)

Tokenizes a transcription string into individual words.
Splits on whitespace and filters out empty tokens.

###### Parameters

###### transcription

`string`

The transcribed text to tokenize

###### Returns

`string`[]

Array of individual word tokens

##### getInstance()

> `static` **getInstance**(): [`CommandConverter`](#commandconverter)

Defined in: [CommandConverter.ts:40](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/2e181446a0955d6e69720fafcb5e1ba075e3f20f/src/CommandConverter.ts#L40)

Returns the singleton instance of CommandConverter.

###### Returns

[`CommandConverter`](#commandconverter)

The single shared instance.
