[**aac-voice-api**](../api-specification.md)

***

## Classes

### CommandHistory

Defined in: [CommandHistory.ts:28](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/CommandHistory.ts#L28)

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

#### Constructors

##### Constructor

> `private` **new CommandHistory**(): [`CommandHistory`](#commandhistory)

Defined in: [CommandHistory.ts:39](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/CommandHistory.ts#L39)

Private constructor prevents direct instantiation

###### Returns

[`CommandHistory`](#commandhistory)

#### Properties

##### enabled

> `private` **enabled**: `boolean` = `true`

Defined in: [CommandHistory.ts:33](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/CommandHistory.ts#L33)

If false, ignore new commands

##### history

> `private` **history**: [`CommandLogEntry`](#commandlogentry)[] = `[]`

Defined in: [CommandHistory.ts:30](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/CommandHistory.ts#L30)

All commands in order — can grow without a cap.

##### instance

> `private` `static` **instance**: [`CommandHistory`](#commandhistory)

Defined in: [CommandHistory.ts:36](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/CommandHistory.ts#L36)

The single global instance of CommandHistory

#### Methods

##### add()

> **add**(`command`): `void`

Defined in: [CommandHistory.ts:78](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/CommandHistory.ts#L78)

Adds a new command to the Command History Log if Logging has been turned on

###### Parameters

###### command

[`CommandLogEntry`](#commandlogentry)

Adds a new command entry to the array

###### Returns

`void`

##### clear()

> **clear**(): `void`

Defined in: [CommandHistory.ts:125](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/CommandHistory.ts#L125)

Clears all history

###### Returns

`void`

##### getAll()

> **getAll**(): [`CommandLogEntry`](#commandlogentry)[]

Defined in: [CommandHistory.ts:89](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/CommandHistory.ts#L89)

Returns all logged Commands

###### Returns

[`CommandLogEntry`](#commandlogentry)[]

returns a copy of the history that is immutable

##### getSize()

> **getSize**(): `number`

Defined in: [CommandHistory.ts:98](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/CommandHistory.ts#L98)

Returns a number of commands that have been logged

###### Returns

`number`

The number of commands that have been logged

##### getSlice()

> **getSlice**(`start`, `end?`): [`CommandLogEntry`](#commandlogentry)[]

Defined in: [CommandHistory.ts:113](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/CommandHistory.ts#L113)

Returns a portion of the command history as a new array.

###### Parameters

###### start

`number`

Starting position of commands you want to have returned

###### end?

`number`

Ending position of the commands you want to have returned

###### Returns

[`CommandLogEntry`](#commandlogentry)[]

If the starting slice is larger then the end it will return an empty array otherwise it returns a list of the commands from the starting index to the ending index

##### isEnabled()

> **isEnabled**(): `boolean`

Defined in: [CommandHistory.ts:68](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/CommandHistory.ts#L68)

Returns whether logging is currently enabled.

###### Returns

`boolean`

True if logging is enabled, false otherwise

##### toggle()

> **toggle**(`enable`): `void`

Defined in: [CommandHistory.ts:59](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/CommandHistory.ts#L59)

###### Parameters

###### enable

`boolean`

Turn logging on/off.

###### Returns

`void`

##### getInstance()

> `static` **getInstance**(): [`CommandHistory`](#commandhistory)

Defined in: [CommandHistory.ts:46](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/CommandHistory.ts#L46)

Returns the singleton instance of CommandHistory.

###### Returns

[`CommandHistory`](#commandhistory)

The single shared instance.

## Interfaces

### CommandLogEntry

Defined in: [CommandHistory.ts:4](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/CommandHistory.ts#L4)

Represents a single entry in the command log.

#### Properties

##### commandName

> **commandName**: `string`

Defined in: [CommandHistory.ts:8](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/CommandHistory.ts#L8)

The name of the matched command

##### status

> **status**: `"success"` \| `"failed"`

Defined in: [CommandHistory.ts:10](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/CommandHistory.ts#L10)

Whether the callback executed successfully

##### timestamp

> **timestamp**: `Date`

Defined in: [CommandHistory.ts:6](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/CommandHistory.ts#L6)

When the command was matched
