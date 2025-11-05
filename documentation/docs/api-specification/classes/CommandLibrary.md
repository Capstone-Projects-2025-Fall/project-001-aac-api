[**aac-voice-api**](../api-specification.md)

***

Defined in: [commandLibrary.ts:59](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/8ef19aa1ae76b73971ed5e6f21dc113d3ead9745/src/commandLibrary.ts#L59)

CommandLibrary contains a HashMap that:
Can be called by CommandMapper.
Maps a String command to the corresponding GameCommand.

## Constructors

### Constructor

```ts
new CommandLibrary(): CommandLibrary;
```

Defined in: [commandLibrary.ts:64](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/8ef19aa1ae76b73971ed5e6f21dc113d3ead9745/src/commandLibrary.ts#L64)

#### Returns

`CommandLibrary`

## Methods

### add()

```ts
add(command): boolean;
```

Defined in: [commandLibrary.ts:83](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/8ef19aa1ae76b73971ed5e6f21dc113d3ead9745/src/commandLibrary.ts#L83)

Add a command (returns false if name already exists)

#### Parameters

<table>
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`command`

</td>
<td>

[`GameCommand`](../interfaces/GameCommand.md)

</td>
</tr>
</tbody>
</table>

#### Returns

`boolean`

***

### clear()

```ts
clear(): void;
```

Defined in: [commandLibrary.ts:113](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/8ef19aa1ae76b73971ed5e6f21dc113d3ead9745/src/commandLibrary.ts#L113)

Clear all commands

#### Returns

`void`

***

### get()

```ts
get(name): undefined | GameCommand;
```

Defined in: [commandLibrary.ts:103](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/8ef19aa1ae76b73971ed5e6f21dc113d3ead9745/src/commandLibrary.ts#L103)

Get a command by name

#### Parameters

<table>
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`name`

</td>
<td>

`string`

</td>
</tr>
</tbody>
</table>

#### Returns

`undefined` \| [`GameCommand`](../interfaces/GameCommand.md)

***

### has()

```ts
has(name): boolean;
```

Defined in: [commandLibrary.ts:98](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/8ef19aa1ae76b73971ed5e6f21dc113d3ead9745/src/commandLibrary.ts#L98)

Check if a command exists

#### Parameters

<table>
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`name`

</td>
<td>

`string`

</td>
</tr>
</tbody>
</table>

#### Returns

`boolean`

***

### list()

```ts
list(): GameCommand[];
```

Defined in: [commandLibrary.ts:108](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/8ef19aa1ae76b73971ed5e6f21dc113d3ead9745/src/commandLibrary.ts#L108)

List all commands

#### Returns

[`GameCommand`](../interfaces/GameCommand.md)[]

***

### remove()

```ts
remove(name): boolean;
```

Defined in: [commandLibrary.ts:93](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/8ef19aa1ae76b73971ed5e6f21dc113d3ead9745/src/commandLibrary.ts#L93)

Remove a command by name

#### Parameters

<table>
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`name`

</td>
<td>

`string`

</td>
</tr>
</tbody>
</table>

#### Returns

`boolean`

***

### getInstance()

```ts
static getInstance(): CommandLibrary;
```

Defined in: [commandLibrary.ts:71](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/8ef19aa1ae76b73971ed5e6f21dc113d3ead9745/src/commandLibrary.ts#L71)

#### Returns

`CommandLibrary`

The singleton instance of CommandLibrary.
