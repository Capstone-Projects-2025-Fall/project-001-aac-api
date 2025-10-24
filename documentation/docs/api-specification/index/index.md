[**aac-voice-api**](../api-specification.md)

***

This is the main entry point for the npm package `'aac-voice-api'`.
It exports the core classes, functions, and types that
make up the public API of the library.

## Example

```ts
import { AACVoiceAPI } from 'aac-voice-api';

// Create an instance of the voice API
const voice = new AACVoiceAPI();

// Add a voice command
voice.addVoiceCommand({
  name: "jump",
  action: () => console.log("player jumped"),
  description: "Activates the jump command",
  active: true,
});

// Initialize the API
// Whisper Models can be found at https://huggingface.co/ggerganov/whisper.cpp/tree/main
voice.initiate("url", "en");

// Start listening for voice commands
voice.start();
```

## References

### AACVoiceAPI

Re-exports [AACVoiceAPI](../AACVoiceAPI/AACVoiceAPI.md#aacvoiceapi)
