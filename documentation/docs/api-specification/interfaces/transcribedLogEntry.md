[**aac-voice-api**](../api-specification.md)

***

Defined in: [SpeechConverterInterface.ts:7](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/8ef19aa1ae76b73971ed5e6f21dc113d3ead9745/src/SpeechConverterInterface.ts#L7)

Represents a single transcription log entry.
Each entry contains the transcribed text and the time it was captured.

## Properties

### timestamp

```ts
timestamp: Date;
```

Defined in: [SpeechConverterInterface.ts:9](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/8ef19aa1ae76b73971ed5e6f21dc113d3ead9745/src/SpeechConverterInterface.ts#L9)

The timestamp indicating when the transcription occurred.

***

### transcribedText

```ts
transcribedText: string;
```

Defined in: [SpeechConverterInterface.ts:11](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/8ef19aa1ae76b73971ed5e6f21dc113d3ead9745/src/SpeechConverterInterface.ts#L11)

The text that was transcribed at the given timestamp.
