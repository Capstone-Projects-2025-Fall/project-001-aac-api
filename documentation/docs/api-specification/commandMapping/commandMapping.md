[**aac-voice-api**](../api-specification.md)

***

## Classes

### CommandMapping

Defined in: [commandMapping.ts:16](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/commandMapping.ts#L16)

CommandMapping provides a simple interface for developers to add and remove
commands from the CommandLibrary.

This class allows you to:
- Create and add new commands to the library.
- Remove commands by name.
- Retrieve all commands or check if a command exists.
- Clear all commands from the library.

Command names are case-insensitive and stored in lowercase.
Commands are stored in the CommandLibrary's HashMap.

#### Constructors

##### Constructor

> **new CommandMapping**(): [`CommandMapping`](#commandmapping)

Defined in: [commandMapping.ts:23](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/commandMapping.ts#L23)

Creates a new CommandMapping instance and connects to the CommandLibrary.

###### Returns

[`CommandMapping`](#commandmapping)

#### Properties

##### library

> `private` **library**: [`CommandLibrary`](../commandLibrary/commandLibrary.md#commandlibrary)

Defined in: [commandMapping.ts:18](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/commandMapping.ts#L18)

Reference to the CommandLibrary singleton

#### Methods

##### addCommand()

> **addCommand**(`name`, `action`, `options?`): `boolean`

Defined in: [commandMapping.ts:50](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/commandMapping.ts#L50)

Creates and adds a new command to the CommandLibrary.

If a command with the same name already exists, it will not be added.
The command name is case-insensitive and will be stored in lowercase.

###### Parameters

###### name

`string`

Command name (case-insensitive)

###### action

() => `void`

Callback function to execute for this command

###### options?

Optional configuration object

###### active?

`boolean`

Whether the command is active (default: true)

###### description?

`string`

Description of what the command does

###### Returns

`boolean`

Returns true if command was added successfully, false if duplicate or invalid

##### clearAllCommands()

> **clearAllCommands**(): `void`

Defined in: [commandMapping.ts:141](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/commandMapping.ts#L141)

Clears all commands from the CommandLibrary.

###### Returns

`void`

##### getAllCommands()

> **getAllCommands**(): `string`[]

Defined in: [commandMapping.ts:112](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/commandMapping.ts#L112)

Retrieves all command names from the CommandLibrary.

###### Returns

`string`[]

Array of all command names

##### getCommand()

> **getCommand**(`name`): `undefined` \| [`GameCommand`](../commandLibrary/commandLibrary.md#gamecommand)

Defined in: [commandMapping.ts:132](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/commandMapping.ts#L132)

Retrieves a specific command from the CommandLibrary by name.

###### Parameters

###### name

`string`

The name of the command to retrieve

###### Returns

`undefined` \| [`GameCommand`](../commandLibrary/commandLibrary.md#gamecommand)

The GameCommand object if found, undefined otherwise

##### hasCommand()

> **hasCommand**(`name`): `boolean`

Defined in: [commandMapping.ts:122](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/commandMapping.ts#L122)

Checks if a command exists in the CommandLibrary.

###### Parameters

###### name

`string`

The name of the command to check

###### Returns

`boolean`

True if command exists, false otherwise

##### normalize()

> `private` **normalize**(`name`): `string`

Defined in: [commandMapping.ts:33](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/commandMapping.ts#L33)

Normalizes a command name to lowercase and trims whitespace.

###### Parameters

###### name

`string`

The command name to normalize

###### Returns

`string`

The normalized command name

##### removeCommand()

> **removeCommand**(`name`): `boolean`

Defined in: [commandMapping.ts:95](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/4f45f27607314e244cc3e3d47559464b42ec5a6c/src/commandMapping.ts#L95)

Removes a command from the CommandLibrary by name.

The command name is case-insensitive.

###### Parameters

###### name

`string`

The name of the command to remove

###### Returns

`boolean`

Returns true if command was removed, false if not found
