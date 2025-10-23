[**aac-voice-api**](../api-specification.md)

***

## Classes

### AACVoiceAPI

Defined in: [AACVoiceAPI.ts:16](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/2e181446a0955d6e69720fafcb5e1ba075e3f20f/src/AACVoiceAPI.ts#L16)

AACVoiceAPI is a facade class that provides a simplified interface
to multiple underlying classes and modules related to voice processing.

This class wraps functionalities such as audio input handling, 
speech-to-text conversion, and command history management, 
exposing them through a single, easy-to-use API.

#### Constructors

##### Constructor

> **new AACVoiceAPI**(): [`AACVoiceAPI`](#aacvoiceapi)

Defined in: [AACVoiceAPI.ts:21](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/2e181446a0955d6e69720fafcb5e1ba075e3f20f/src/AACVoiceAPI.ts#L21)

###### Returns

[`AACVoiceAPI`](#aacvoiceapi)

#### Properties

##### converter

> `private` **converter**: `null` \| [`SpeechConverter`](../SpeechConverter/SpeechConverter.md#speechconverter) = `null`

Defined in: [AACVoiceAPI.ts:18](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/2e181446a0955d6e69720fafcb5e1ba075e3f20f/src/AACVoiceAPI.ts#L18)

#### Methods

##### displayCommandHistory()

> **displayCommandHistory**(): `void`

Defined in: [AACVoiceAPI.ts:60](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/2e181446a0955d6e69720fafcb5e1ba075e3f20f/src/AACVoiceAPI.ts#L60)

This will display all game Commands in a toggleable modal

###### Returns

`void`

##### initiate()

> **initiate**(`url`, `language`): `void`

Defined in: [AACVoiceAPI.ts:32](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/2e181446a0955d6e69720fafcb5e1ba075e3f20f/src/AACVoiceAPI.ts#L32)

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

##### start()

> **start**(): `void`

Defined in: [AACVoiceAPI.ts:41](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/2e181446a0955d6e69720fafcb5e1ba075e3f20f/src/AACVoiceAPI.ts#L41)

This will allow the user to start speaking into the microphone and initiate game commands

###### Returns

`void`

##### stop()

> **stop**(): `void`

Defined in: [AACVoiceAPI.ts:52](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/2e181446a0955d6e69720fafcb5e1ba075e3f20f/src/AACVoiceAPI.ts#L52)

This will stop recording of the microphone

###### Returns

`void`
