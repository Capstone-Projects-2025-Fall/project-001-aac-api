# Optional Settings

In combination of the settings required to initiate the library into your desired mode, there are a few different optional settings you can configure during the initiation.

|Parameters|Type|Description|
|:----------:|:-----:|:----------|
|usePhoneticMatching|boolean| Matches transcribed words and game commands based on how the words sound rather than how they are spelled.<br/><br/>Phonetic Matching will convert each spoken word into a phonetic code using the Double Metaphone algorithm. Depending on how close the two codes are, will determine the confidence level in which they are phonetically the same.|
|confidenceThreshold|number| Takes a number between 0-1 inclusive. 1 being an exact match. The confidence level required to trigger a game command if a word is spoken.|
|logConfidenceScores|boolean|A developer tool that will display confidence levels of words in the console log. Should be turned off in a production environment|


:::note
Phonetic Matching is turned on by default with a confidence threshold of 0.8 (80%).
:::



Example in ```Offline``` Mode:
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
Example in ```Online``` Mode:
```ts
const voice = new AACVoiceAPI();

await voiceApi.current.initiate({//d4s
    mode: 'online',
    modelUrl: 'http://localhost:8000',
    usePhoneticMatching: true,
    confidenceThreshold: 0.9,
    logConfidenceScores: false,

})
```
