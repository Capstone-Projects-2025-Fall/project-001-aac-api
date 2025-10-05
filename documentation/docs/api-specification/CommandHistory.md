[**project-001-aac-api**](../../README.md)

***

Defined in: CommandHistory.ts:16

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

## Constructors

### Constructor

> `private` **new CommandHistory**(): `CommandHistory`

Defined in: CommandHistory.ts:27

Private constructor prevents direct instantiation

#### Returns

`CommandHistory`

## Properties

### enabled

> `private` **enabled**: `boolean` = `true`

Defined in: CommandHistory.ts:21

If false, ignore new commands

***

### history

> `private` **history**: `string`[] = `[]`

Defined in: CommandHistory.ts:18

All commands in order — can grow without a cap.

***

### instance

> `private` `static` **instance**: `CommandHistory`

Defined in: CommandHistory.ts:24

The single global instance of CommandHistory

## Methods

### add()

> **add**(`command`): `void`

Defined in: CommandHistory.ts:60

Adds a new command to the Command History Log if Logging has been turned on

#### Parameters

##### command

`string`

Adds a new command to the array

#### Returns

`void`

***

### clear()

> **clear**(): `void`

Defined in: CommandHistory.ts:107

Clears all history

#### Returns

`void`

***

### getAll()

> **getAll**(): `string`[]

Defined in: CommandHistory.ts:71

Returns all logged Commands

#### Returns

`string`[]

returns a copy of the history that is immutable

***

### getSize()

> **getSize**(): `number`

Defined in: CommandHistory.ts:80

Returns a number of commands that have been logged

#### Returns

`number`

The number of commands that have been logged

***

### getSlice()

> **getSlice**(`start`, `end?`): `string`[]

Defined in: CommandHistory.ts:95

Returns a portion of the command history as a new array.

#### Parameters

##### start

`number`

Starting position of commands you want to have returned

##### end?

`number`

Ending position of the commands you want to have returned

#### Returns

`string`[]

If the starting slice is larger then the end it will return an empty array otherwise it returns a list of the commands from the starting index to the ending index

***

### toggle()

> **toggle**(`enable`): `void`

Defined in: CommandHistory.ts:50

#### Parameters

##### enable

`boolean`

Turn logging on/off.

#### Returns

`void`

***

### getInstance()

> `static` **getInstance**(): `CommandHistory`

Defined in: CommandHistory.ts:34

Returns the singleton instance of CommandHistory.

#### Returns

`CommandHistory`

The single shared instance.
