[**aac-voice-api**](../../api-specification.md)

***

# Interface: GameCommand

Defined in: [commandLibrary.ts:15](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/commandLibrary.ts#L15)

Represents a voice-activated command that can trigger game actions.

 GameCommand

## Example

```typescript
const jumpCommand: GameCommand = {
  name: "jump",
  action: () => player.jump(),
  description: "Makes the player character jump",
  active: true
};
```

## Properties

### action()

> **action**: () => `void`

Defined in: [commandLibrary.ts:32](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/commandLibrary.ts#L32)

The callback function to execute when this command is triggered.
This function contains the game logic that should run when the voice command is recognized.

#### Returns

`void`

#### Example

```ts
() => player.jump()
```

***

### active

> **active**: `boolean`

Defined in: [commandLibrary.ts:50](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/commandLibrary.ts#L50)

Whether this command is currently enabled and can be triggered.
Inactive commands will not respond to voice input.

#### Default

```ts
true
```

***

### description

> **description**: `string`

Defined in: [commandLibrary.ts:41](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/commandLibrary.ts#L41)

A human-readable description of what this command does.
Used for documentation, help menus, or accessibility features.

#### Example

```ts
"Makes the player character jump into the air"
```

***

### name

> **name**: `string`

Defined in: [commandLibrary.ts:23](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/commandLibrary.ts#L23)

The name/trigger phrase for the command.
This is the word or phrase that will be recognized to trigger the action.

#### Example

```ts
"jump", "move left", "fire weapon"
```
