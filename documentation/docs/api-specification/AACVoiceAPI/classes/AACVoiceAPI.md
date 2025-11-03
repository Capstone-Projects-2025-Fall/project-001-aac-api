[**aac-voice-api**](../../api-specification.md)

***

# Class: AACVoiceAPI

Defined in: [AACVoiceAPI.ts:17](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/AACVoiceAPI.ts#L17)

AACVoiceAPI is a facade class that provides a simplified interface
to multiple underlying classes and modules related to voice processing.

This class wraps functionalities such as audio input handling, 
speech-to-text conversion, and command history management, 
exposing them through a single, easy-to-use API.

## Constructors

### Constructor

> **new AACVoiceAPI**(): `AACVoiceAPI`

Defined in: [AACVoiceAPI.ts:22](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/AACVoiceAPI.ts#L22)

#### Returns

`AACVoiceAPI`

## Methods

### addVoiceCommand()

> **addVoiceCommand**(`name`, `action`, `options?`): `boolean`

Defined in: [AACVoiceAPI.ts:85](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/AACVoiceAPI.ts#L85)

Adds a voice command to the system.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |
| `action` | () => `void` |
| `options?` | \{ `active?`: `boolean`; `description?`: `string`; \} |
| `options.active?` | `boolean` |
| `options.description?` | `string` |

#### Returns

`boolean`

true if successfully added

***

### clearCommands()

> **clearCommands**(): `void`

Defined in: [AACVoiceAPI.ts:127](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/AACVoiceAPI.ts#L127)

Allows user to remove all game commands from system

#### Returns

`void`

***

### displayCommandHistory()

> **displayCommandHistory**(): `void`

Defined in: [AACVoiceAPI.ts:72](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/AACVoiceAPI.ts#L72)

Displays all game Commands in a toggleable modal

#### Returns

`void`

***

### getCommands()

> **getCommands**(): \[\] \| `string`[]

Defined in: [AACVoiceAPI.ts:120](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/AACVoiceAPI.ts#L120)

Allows user to see a list of all known game commands

#### Returns

\[\] \| `string`[]

a list of all known game commands

***

### getTranscribedFull()

> **getTranscribedFull**(): `string`[]

Defined in: [AACVoiceAPI.ts:63](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/AACVoiceAPI.ts#L63)

Retrieves the full transcription history from the Whisper module.

#### Returns

`string`[]

An array of transcription log entries,
each containing the transcribed text and its corresponding timestamp.

***

### initiate()

> **initiate**(`url`, `language`): `void`

Defined in: [AACVoiceAPI.ts:34](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/AACVoiceAPI.ts#L34)

Initializes the API with the specified model and language

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `url` | `string` | Path to URL for the Whipser model file |
| `language` | `string` | Language code to configure the model (e.g. 'en') |

#### Returns

`void`

***

### isRegistered()

> **isRegistered**(`name`): `boolean`

Defined in: [AACVoiceAPI.ts:112](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/AACVoiceAPI.ts#L112)

Allows user to check if a game command has already been added

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | The name of the command that is being checked |

#### Returns

`boolean`

true if found

***

### removeVoiceCommand()

> **removeVoiceCommand**(`name`): `boolean`

Defined in: [AACVoiceAPI.ts:103](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/AACVoiceAPI.ts#L103)

Allows user to remove a command from the system

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | The name of the command that is to be removed from the list |

#### Returns

`boolean`

true if successfully removed

***

### start()

> **start**(): `void`

Defined in: [AACVoiceAPI.ts:42](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/AACVoiceAPI.ts#L42)

Allows the user to start speaking into the microphone and initiate game commands

#### Returns

`void`

***

### stop()

> **stop**(): `void`

Defined in: [AACVoiceAPI.ts:53](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/AACVoiceAPI.ts#L53)

Stops all voice recording and transcription

#### Returns

`void`
