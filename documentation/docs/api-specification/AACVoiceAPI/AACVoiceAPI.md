[**aac-voice-api**](../api-specification.md)

***

## Classes

### AACVoiceAPI

Defined in: [AACVoiceAPI.ts:18](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/AACVoiceAPI.ts#L18)

AACVoiceAPI is a facade class that provides a simplified interface
to multiple underlying classes and modules related to voice processing.

This class wraps functionalities such as audio input handling, 
speech-to-text conversion, and command history management, 
exposing them through a single, easy-to-use API.

#### Constructors

##### Constructor

> **new AACVoiceAPI**(): [`AACVoiceAPI`](#aacvoiceapi)

Defined in: [AACVoiceAPI.ts:23](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/AACVoiceAPI.ts#L23)

###### Returns

[`AACVoiceAPI`](#aacvoiceapi)

#### Properties

##### commands

> `private` **commands**: `null` \| [`CommandLibrary`](../commandLibrary/commandLibrary.md#commandlibrary) = `null`

Defined in: [AACVoiceAPI.ts:21](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/AACVoiceAPI.ts#L21)

##### converter

> `private` **converter**: `null` \| [`SpeechConverter`](../SpeechConverter/SpeechConverter.md#speechconverter) = `null`

Defined in: [AACVoiceAPI.ts:20](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/AACVoiceAPI.ts#L20)

#### Methods

##### addVoiceCommand()

> **addVoiceCommand**(`command`): `boolean`

Defined in: [AACVoiceAPI.ts:87](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/AACVoiceAPI.ts#L87)

Adds a voice command to the system.

###### Parameters

###### command

[`GameCommand`](../commandLibrary/commandLibrary.md#gamecommand)

The command object containing:
 - `name`: The name of the command that the user needs to speak.
 - `action`: A callback function that executes when the command is triggered.
 - `description`: A short explanation of what the command does. 
 - `active`: Whether the command is currently active. (true or false)

###### Returns

`boolean`

true if successfully added

##### clearCommands()

> **clearCommands**(): `void`

Defined in: [AACVoiceAPI.ts:121](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/AACVoiceAPI.ts#L121)

Allows user to remove all game commands from system

###### Returns

`void`

##### displayCommandHistory()

> **displayCommandHistory**(): `void`

Defined in: [AACVoiceAPI.ts:74](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/AACVoiceAPI.ts#L74)

Displays all game Commands in a toggleable modal

###### Returns

`void`

##### getCommands()

> **getCommands**(): `undefined` \| [`GameCommand`](../commandLibrary/commandLibrary.md#gamecommand)[]

Defined in: [AACVoiceAPI.ts:114](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/AACVoiceAPI.ts#L114)

Allows user to see a list of all known game commands

###### Returns

`undefined` \| [`GameCommand`](../commandLibrary/commandLibrary.md#gamecommand)[]

a list of all known game commands

##### getTranscribedFull()

> **getTranscribedFull**(): [`transcribedLogEntry`](../SpeechConverter/SpeechConverter.md#transcribedlogentry)[]

Defined in: [AACVoiceAPI.ts:65](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/AACVoiceAPI.ts#L65)

Retrieves the full transcription history from the Whisper module.

###### Returns

[`transcribedLogEntry`](../SpeechConverter/SpeechConverter.md#transcribedlogentry)[]

An array of transcription log entries,
each containing the transcribed text and its corresponding timestamp.

##### initiate()

> **initiate**(`url`, `language`): `void`

Defined in: [AACVoiceAPI.ts:35](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/AACVoiceAPI.ts#L35)

Initializes the API with the specified model and language

###### Parameters

###### url

`string`

Path to URL for the Whipser model file

###### language

`string`

Language code to configure the model (e.g. 'en')

###### Returns

`void`

##### isRegistered()

> **isRegistered**(`name`): `boolean`

Defined in: [AACVoiceAPI.ts:106](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/AACVoiceAPI.ts#L106)

Allows user to check if a game command has already been added

###### Parameters

###### name

`string`

The name of the command that is being checked

###### Returns

`boolean`

true if found

##### removeVoiceCommand()

> **removeVoiceCommand**(`name`): `boolean`

Defined in: [AACVoiceAPI.ts:97](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/AACVoiceAPI.ts#L97)

Allows user to remove a command from the system

###### Parameters

###### name

`string`

The name of the command that is to be removed from the list

###### Returns

`boolean`

true if successfully removed

##### start()

> **start**(): `void`

Defined in: [AACVoiceAPI.ts:44](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/AACVoiceAPI.ts#L44)

Allows the user to start speaking into the microphone and initiate game commands

###### Returns

`void`

##### stop()

> **stop**(): `void`

Defined in: [AACVoiceAPI.ts:55](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/AACVoiceAPI.ts#L55)

Stops all voice recording and transcription

###### Returns

`void`
