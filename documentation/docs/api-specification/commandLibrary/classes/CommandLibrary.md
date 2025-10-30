[**aac-voice-api**](../../api-specification.md)

***

# Class: CommandLibrary

Defined in: [commandLibrary.ts:59](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/commandLibrary.ts#L59)

CommandLibrary contains a HashMap that:
Can be called by CommandMapper.
Maps a String command to the corresponding GameCommand.

## Constructors

### Constructor

> **new CommandLibrary**(): `CommandLibrary`

Defined in: [commandLibrary.ts:64](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/commandLibrary.ts#L64)

#### Returns

`CommandLibrary`

## Methods

### add()

> **add**(`command`): `boolean`

Defined in: [commandLibrary.ts:83](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/commandLibrary.ts#L83)

Add a command (returns false if name already exists)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `command` | [`GameCommand`](../interfaces/GameCommand.md) |

#### Returns

`boolean`

***

### clear()

> **clear**(): `void`

Defined in: [commandLibrary.ts:113](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/commandLibrary.ts#L113)

Clear all commands

#### Returns

`void`

***

### get()

> **get**(`name`): `undefined` \| [`GameCommand`](../interfaces/GameCommand.md)

Defined in: [commandLibrary.ts:103](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/commandLibrary.ts#L103)

Get a command by name

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |

#### Returns

`undefined` \| [`GameCommand`](../interfaces/GameCommand.md)

***

### has()

> **has**(`name`): `boolean`

Defined in: [commandLibrary.ts:98](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/commandLibrary.ts#L98)

Check if a command exists

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |

#### Returns

`boolean`

***

### list()

> **list**(): [`GameCommand`](../interfaces/GameCommand.md)[]

Defined in: [commandLibrary.ts:108](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/commandLibrary.ts#L108)

List all commands

#### Returns

[`GameCommand`](../interfaces/GameCommand.md)[]

***

### remove()

> **remove**(`name`): `boolean`

Defined in: [commandLibrary.ts:93](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/commandLibrary.ts#L93)

Remove a command by name

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |

#### Returns

`boolean`

***

### getInstance()

> `static` **getInstance**(): `CommandLibrary`

Defined in: [commandLibrary.ts:71](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/commandLibrary.ts#L71)

#### Returns

`CommandLibrary`

The singleton instance of CommandLibrary.
