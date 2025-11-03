[**aac-voice-api**](../../api-specification.md)

***

# Class: CommandHistory

Defined in: [CommandHistory.ts:28](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/CommandHistory.ts#L28)

CommandHistory keeps track of a chronological log of commands.

This class allows you to:
- Add new commands to the history (if logging is enabled).
- Retrieve all commands or a slice of commands.
- Query the total number of commands logged.
- Enable or disable logging.
- Clear the entire history.

Commands are stored in memory in the order they were added. 
Slices and retrievals return copies of the array to prevent external mutation.
There is no built-in limit on how many commands are stored.

## Methods

### add()

> **add**(`command`): `void`

Defined in: [CommandHistory.ts:78](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/CommandHistory.ts#L78)

Adds a new command to the Command History Log if Logging has been turned on

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `command` | [`CommandLogEntry`](../interfaces/CommandLogEntry.md) | Adds a new command entry to the array |

#### Returns

`void`

***

### clear()

> **clear**(): `void`

Defined in: [CommandHistory.ts:125](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/CommandHistory.ts#L125)

Clears all history

#### Returns

`void`

***

### getAll()

> **getAll**(): [`CommandLogEntry`](../interfaces/CommandLogEntry.md)[]

Defined in: [CommandHistory.ts:89](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/CommandHistory.ts#L89)

Returns all logged Commands

#### Returns

[`CommandLogEntry`](../interfaces/CommandLogEntry.md)[]

returns a copy of the history that is immutable

***

### getSize()

> **getSize**(): `number`

Defined in: [CommandHistory.ts:98](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/CommandHistory.ts#L98)

Returns a number of commands that have been logged

#### Returns

`number`

The number of commands that have been logged

***

### getSlice()

> **getSlice**(`start`, `end?`): [`CommandLogEntry`](../interfaces/CommandLogEntry.md)[]

Defined in: [CommandHistory.ts:113](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/CommandHistory.ts#L113)

Returns a portion of the command history as a new array.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `start` | `number` | Starting position of commands you want to have returned |
| `end?` | `number` | Ending position of the commands you want to have returned |

#### Returns

[`CommandLogEntry`](../interfaces/CommandLogEntry.md)[]

If the starting slice is larger then the end it will return an empty array otherwise it returns a list of the commands from the starting index to the ending index

***

### isEnabled()

> **isEnabled**(): `boolean`

Defined in: [CommandHistory.ts:68](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/CommandHistory.ts#L68)

Returns whether logging is currently enabled.

#### Returns

`boolean`

True if logging is enabled, false otherwise

***

### toggle()

> **toggle**(`enable`): `void`

Defined in: [CommandHistory.ts:59](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/CommandHistory.ts#L59)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `enable` | `boolean` | Turn logging on/off. |

#### Returns

`void`

***

### getInstance()

> `static` **getInstance**(): `CommandHistory`

Defined in: [CommandHistory.ts:46](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/CommandHistory.ts#L46)

Returns the singleton instance of CommandHistory.

#### Returns

`CommandHistory`

The single shared instance.
