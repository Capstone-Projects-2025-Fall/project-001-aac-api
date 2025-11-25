# Using Speaker Separation

:::note
This feature exists only with online mode. If you would like to use this feature, please make sure you have 'online' mode set up.
::::

Speaker separation allows two people to talk simultaneously while splitting their voices into separate audio streams for transcription. The feature works, but results can vary. Although it does successfully isolate each speaker into separate audio chunks, it introduces noticeable processing overhead and increases response time.

That said, the feature is fully supported if you’d like to experiment with it.

To use it, simply enable it during initialization using the `Full Control` with `useSpeakerSeparation` parameter set to `true`:
```ts {6} 
const voice = new AACVoiceAPI();

await voiceApi.initiate({
    mode: 'online',
    modelUrl: 'http://localhost:8000',
    useSpeakerSeparation: true
});
```
or for ease of use, you can use this method:
```ts
const voice = new AACVoiceAPI();

await voiceAPI.initiateMultiSpeaker('http://localhost:8000');
```

We also expose methods that allow the user to switch from speaker separation mode on the fly. to do so, you simply just need to either of these two methods:

```ts
const voice = new AACVoiceAPI();

voice.switchSpeakerMode(true);
```
or
```ts
const voice = new AACVoiceAPI();

voice.toggleSpeakerMode();
```
