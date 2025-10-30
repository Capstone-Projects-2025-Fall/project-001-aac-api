[**aac-voice-api**](../../api-specification.md)

***

# Interface: CommandLogEntry

Defined in: [CommandHistory.ts:4](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/CommandHistory.ts#L4)

Represents a single entry in the command log.

## Properties

### commandName

> **commandName**: `string`

Defined in: [CommandHistory.ts:8](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/CommandHistory.ts#L8)

The name of the matched command

***

### status

> **status**: `"success"` \| `"failed"`

Defined in: [CommandHistory.ts:10](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/CommandHistory.ts#L10)

Whether the callback executed successfully

***

### timestamp

> **timestamp**: `Date`

Defined in: [CommandHistory.ts:6](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/CommandHistory.ts#L6)

When the command was matched
