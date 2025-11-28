# Transcription Logs


To get a list of all words that have been transcribed speech, simply use:

```ts
const voice = new AACVoiceAPI();

voice.getTranscriptionLogs();
```
Returns a list of strings, each containing the transcribed text from a processed chunk of audio along with the timestamp it was processed.

Example of how the returned array of strings would look like:
```ts
['12:53:28 PM :  Processed text', '12:53:32 PM :  More processed text', '12:53:37 PM : Go Birds']
```