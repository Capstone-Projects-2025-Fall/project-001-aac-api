[**aac-voice-api**](../../api-specification.md)

***

# Interface: transcribedLogEntry

Defined in: [SpeechConverter.ts:9](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/SpeechConverter.ts#L9)

Represents a single transcription log entry.
Each entry contains the transcribed text and the time it was captured.

## Properties

### timestamp

> **timestamp**: `Date`

Defined in: [SpeechConverter.ts:11](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/SpeechConverter.ts#L11)

The timestamp indicating when the transcription occurred.

***

### transcribedText

> **transcribedText**: `string`

Defined in: [SpeechConverter.ts:13](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/681b1bef6f4d46f8f7614169d87f151ce783205a/src/SpeechConverter.ts#L13)

The text that was transcribed at the given timestamp.
