---
sidebar_position: 2
---

# Offline Mode

Offline mode is designed for developers who don’t want or need any additional setup. It allows you to integrate voice controls without relying on any external services or backend configuration.

:::note
Offline mode sacrifices some transcription accuracy and speed for ease of use. If these are critical for your use case, use online mode
:::

## How to use

```ts
const voice = new AACVoiceAPI();

await voice.initiate({
    mode: 'offline',
    modelUrl: 'models/whisper-tiny.bin',
    language: 'en'
});
```
|Parameters|Type|Description|
|:----------:|:-----:|:----------|
|mode        |string |Takes in a string of either 'offline' or 'online'|
|modelUrl    |string | <strong>Two Options</strong><br/><br/>Local Path such as ```'models/whisper-tiny.bin'```<br/>Remote URL such as  ```https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-tiny.bin```|
|language    |string | The language that the model was trained in. Uses ISO 639-1 codes|

All available models to use and download can be found [here](https://huggingface.co/ggerganov/whisper.cpp/tree/main)
:::tip Recommendation
For best real-time speech transcription use the ggml-tiny.bin model
:::

If you would like to find out which mode is currently running during the game in case you have both options available to the user, use the command:

```ts
const voice = new AACVoiceAPI();

voice.getMode();
```
Returns a string containing the word 'online' or 'offline' depending on which one is currently running


