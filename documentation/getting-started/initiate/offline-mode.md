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

## Optional Settings

Along with the mandatory settings mentioned above, there are a few different optional settings you can configure during the initiation.

|Parameters|Type|Description|
|:----------:|:-----:|:----------|
|usePhoneticMatching|boolean| Matches transcribed words and game commands based on how the words sound rather than how they are spelled.<br/><br/>Phonetic Matching will convert each spoken word into a phonetic code using the Double Metaphone algorithm. Depending on how close the two codes are, will determine the confidence level in which they are phonetically the same.|
|confidenceThreshold|number| Takes a number between 0-1 inclusive. 1 being an exact match. The confidence level required to trigger a game command if a word is spoken.|
|logConfidenceScores|boolean|A developer tool that will display confidence levels of words in the console log. Should be turned off in a production environment|

```ts
const voice = new AACVoiceAPI();

await voice.initiate({
    mode: 'offline',
    modelUrl: modelUrl,
    language: 'en',
    usePhoneticMatching: true,
    confidenceThreshold: 0.9,
    logConfidenceScores: false,
});
```
