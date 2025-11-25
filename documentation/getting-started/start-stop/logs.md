# Transcription Logs


To get a list of all words that have been transcribed speech, simply use:

```ts
const voice = new AACVoiceAPI();

voice.getTranscriptionLogs();
```
Returns a list of strings of each chunk of audio that has been processed.