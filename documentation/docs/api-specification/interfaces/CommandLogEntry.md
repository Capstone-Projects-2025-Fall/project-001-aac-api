[**aac-voice-api**](../api-specification.md)

***

Defined in: [CommandHistory.ts:4](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/8ef19aa1ae76b73971ed5e6f21dc113d3ead9745/src/CommandHistory.ts#L4)

Represents a single entry in the command log.

## Properties

### commandName

```ts
commandName: string;
```

Defined in: [CommandHistory.ts:8](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/8ef19aa1ae76b73971ed5e6f21dc113d3ead9745/src/CommandHistory.ts#L8)

The name of the matched command

***

### status

```ts
status: "success" | "failed";
```

Defined in: [CommandHistory.ts:10](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/8ef19aa1ae76b73971ed5e6f21dc113d3ead9745/src/CommandHistory.ts#L10)

Whether the callback executed successfully

***

### timestamp

```ts
timestamp: Date;
```

Defined in: [CommandHistory.ts:6](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/8ef19aa1ae76b73971ed5e6f21dc113d3ead9745/src/CommandHistory.ts#L6)

When the command was matched
