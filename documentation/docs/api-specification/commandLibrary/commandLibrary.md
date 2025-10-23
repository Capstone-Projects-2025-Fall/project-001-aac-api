[**aac-voice-api**](../api-specification.md)

***

## Classes

### CommandLibrary

Defined in: [commandLibrary.ts:21](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/2e181446a0955d6e69720fafcb5e1ba075e3f20f/src/commandLibrary.ts#L21)

CommandLibrary contains a HashMap that:
Can be called by CommandMapper.
Maps a String command to the corresponding GameCommand.

#### Constructors

##### Constructor

> **new CommandLibrary**(): [`CommandLibrary`](#commandlibrary)

Defined in: [commandLibrary.ts:26](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/2e181446a0955d6e69720fafcb5e1ba075e3f20f/src/commandLibrary.ts#L26)

###### Returns

[`CommandLibrary`](#commandlibrary)

#### Properties

##### commandMap

> `private` **commandMap**: `Map`\<`string`, [`GameCommand`](#gamecommand)\>

Defined in: [commandLibrary.ts:22](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/2e181446a0955d6e69720fafcb5e1ba075e3f20f/src/commandLibrary.ts#L22)

##### instance

> `private` `static` **instance**: [`CommandLibrary`](#commandlibrary)

Defined in: [commandLibrary.ts:24](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/2e181446a0955d6e69720fafcb5e1ba075e3f20f/src/commandLibrary.ts#L24)

#### Methods

##### add()

> **add**(`command`): `boolean`

Defined in: [commandLibrary.ts:45](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/2e181446a0955d6e69720fafcb5e1ba075e3f20f/src/commandLibrary.ts#L45)

Add a command (returns false if name already exists)

###### Parameters

###### command

[`GameCommand`](#gamecommand)

###### Returns

`boolean`

##### clear()

> **clear**(): `void`

Defined in: [commandLibrary.ts:75](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/2e181446a0955d6e69720fafcb5e1ba075e3f20f/src/commandLibrary.ts#L75)

Clear all commands

###### Returns

`void`

##### get()

> **get**(`name`): `undefined` \| [`GameCommand`](#gamecommand)

Defined in: [commandLibrary.ts:65](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/2e181446a0955d6e69720fafcb5e1ba075e3f20f/src/commandLibrary.ts#L65)

Get a command by name

###### Parameters

###### name

`string`

###### Returns

`undefined` \| [`GameCommand`](#gamecommand)

##### has()

> **has**(`name`): `boolean`

Defined in: [commandLibrary.ts:60](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/2e181446a0955d6e69720fafcb5e1ba075e3f20f/src/commandLibrary.ts#L60)

Check if a command exists

###### Parameters

###### name

`string`

###### Returns

`boolean`

##### list()

> **list**(): [`GameCommand`](#gamecommand)[]

Defined in: [commandLibrary.ts:70](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/2e181446a0955d6e69720fafcb5e1ba075e3f20f/src/commandLibrary.ts#L70)

List all commands

###### Returns

[`GameCommand`](#gamecommand)[]

##### normalize()

> `private` **normalize**(`name`): `string`

Defined in: [commandLibrary.ts:40](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/2e181446a0955d6e69720fafcb5e1ba075e3f20f/src/commandLibrary.ts#L40)

###### Parameters

###### name

`string`

###### Returns

`string`

##### remove()

> **remove**(`name`): `boolean`

Defined in: [commandLibrary.ts:55](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/2e181446a0955d6e69720fafcb5e1ba075e3f20f/src/commandLibrary.ts#L55)

Remove a command by name

###### Parameters

###### name

`string`

###### Returns

`boolean`

##### getInstance()

> `static` **getInstance**(): [`CommandLibrary`](#commandlibrary)

Defined in: [commandLibrary.ts:33](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/2e181446a0955d6e69720fafcb5e1ba075e3f20f/src/commandLibrary.ts#L33)

###### Returns

[`CommandLibrary`](#commandlibrary)

The singleton instance of CommandLibrary.

## Interfaces

### GameCommand

Defined in: [commandLibrary.ts:2](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/2e181446a0955d6e69720fafcb5e1ba075e3f20f/src/commandLibrary.ts#L2)

#### Properties

##### action()

> **action**: () => `void`

Defined in: [commandLibrary.ts:6](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/2e181446a0955d6e69720fafcb5e1ba075e3f20f/src/commandLibrary.ts#L6)

###### Returns

`void`

##### active

> **active**: `boolean`

Defined in: [commandLibrary.ts:12](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/2e181446a0955d6e69720fafcb5e1ba075e3f20f/src/commandLibrary.ts#L12)

##### description

> **description**: `string`

Defined in: [commandLibrary.ts:8](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/2e181446a0955d6e69720fafcb5e1ba075e3f20f/src/commandLibrary.ts#L8)

##### name

> **name**: `string`

Defined in: [commandLibrary.ts:4](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/2e181446a0955d6e69720fafcb5e1ba075e3f20f/src/commandLibrary.ts#L4)
