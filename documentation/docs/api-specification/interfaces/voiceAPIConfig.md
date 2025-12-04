[**aac-voice-api**](../api-specification.md)

***

Defined in: [AACVoiceAPI.ts:36](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/a499d4999cefb5304bcc22b147407d7750156d6f/src/AACVoiceAPI.ts#L36)

AACVoiceAPI is a facade class that provides a simplified interface
to multiple underlying classes and modules related to voice processing.

This class wraps functionalities such as audio input handling, 
speech-to-text conversion, and command history management, 
exposing them through a single, easy-to-use API.

## Examples

```ts
// Offline
const api = new AACVoiceAPI();
await api.initiate({
 mode: 'offline',
 modelUrl: 'models/whisper-tiny.bin',
 language: 'en'
 });

*
```

```ts
// Online
const api = new AACVoiceAPI();
await api.initiate({
 mode: 'online',
 backendUrl: 'http://localhost:8000'
 });

@class
```

## Properties

### language?

```ts
optional language: string;
```

Defined in: [AACVoiceAPI.ts:39](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/a499d4999cefb5304bcc22b147407d7750156d6f/src/AACVoiceAPI.ts#L39)

***

### mode

```ts
mode: "offline" | "online";
```

Defined in: [AACVoiceAPI.ts:37](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/a499d4999cefb5304bcc22b147407d7750156d6f/src/AACVoiceAPI.ts#L37)

***

### modelUrl

```ts
modelUrl: string;
```

Defined in: [AACVoiceAPI.ts:38](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/a499d4999cefb5304bcc22b147407d7750156d6f/src/AACVoiceAPI.ts#L38)

***

### useSpeakerSeparation?

```ts
optional useSpeakerSeparation: boolean;
```

Defined in: [AACVoiceAPI.ts:40](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/blob/a499d4999cefb5304bcc22b147407d7750156d6f/src/AACVoiceAPI.ts#L40)
