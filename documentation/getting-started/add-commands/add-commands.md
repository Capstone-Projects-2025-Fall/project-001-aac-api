# Adding Voice Commands


:::note
Returns true if the command has successfully been added.
:::


```ts
const voice = new AACVoiceAPI();

voice.addVoiceCommand(
    'jump',
    () => console.log('player jumped'),
    {
        description:'displays a message that the player jumped',
        active: true
    }
)
```
or
```ts
const voice = new AACVoiceAPI();

voice.addVoiceCommand(
    'jump',
    () => console.log('player jumped'),
)
```
or 
```ts
const voice = new AACVoiceAPI();

voice.addVoiceCommand(
    'jump',
    () => console.log('player jumped'),
    {
        description:'displays a message that the player jumped'
    }
)
```


|Parameters|Type|Description|
|:----------:|:-----:|:----------|
|name|string|the voice command that needs to be said for action to occur|
|action| Function | A function that the developer passes to the library to be executed any time the voice command is recognized|
|Option| Object (optional)| **description** (optional) value that allows the developer to describe what the command does in more detail<br/>**active** (optional) - Turns on or off voice command. Defaults to true if user does not supply a value.|

