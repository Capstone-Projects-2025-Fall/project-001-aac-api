# Online Mode

Online mode is designed for the users where speed and accuracy is critical for their web application.

- **Higher accuracy** – the cloud model is more robust and up-to-date.  
- **Faster processing** – large or complex audio files are transcribed more quickly.  

## How to use

- **Option 1: Full Control** – Lets you configure all parameters, including `mode`, `modelUrl`, and whether to use speaker separation. Best if you need flexibility.  
- **Option 2: Single Speaker** – Quick setup for transcribing a single speaker, with minimal configuration.  
- **Option 3: Multi-Speaker** – Simplified setup for conversations with multiple speakers, automatically handles speaker separation.  

:::tip Recommendation
It is recommended to set useSpeakerSeparation to ```false``` if speed and accuracy is critical to your app
:::
## Full Control
---
```ts
const voice = new AACVoiceAPI();

await voiceApi.initiate({
    mode: 'online',
    modelUrl: 'http://localhost:8000',
    useSpeakerSeparation: false
});
```
    
|Parameters|Type|Description|
|:----------:|:-----:|:----------|
|mode        |string |Takes in a string of either 'offline' or 'online'|
|modelUrl    |string |The domain name of where the backend is being hosted<br/>During development, you can simply pass in ```http://localhost:PORT``` where PORT = the port it is running on|
|useSpeakerSeparation| boolean | Option for developer to choose whether or not Speech Separation should occur|



## Single Speaker
---
```ts
const voice = new AACVoiceAPI();

await voiceAPI.initiateOnlineSingleSpeaker('http://localhost:8000');
```

|Parameters|Type|Description|
|:----------:|:-----:|:----------|
|modelUrl    | string| The domain name of where the backend is being hosted<br/>During development, you can simply pass in ```http://localhost:PORT``` where PORT = the port it is running on|

## Multi-Speaker
---
```ts
const voice = new AACVoiceAPI();

await voiceAPI.initiateMultiSpeaker('http://localhost:8000');
```

|Parameters|Type|Description|
|:----------:|:-----:|:----------|
|modelUrl    | string| The domain name of where the backend is being hosted<br/>During development, you can simply pass in ```http://localhost:PORT``` where PORT = the port it is running on|
