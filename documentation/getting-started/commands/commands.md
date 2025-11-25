# Managing Voice Commands

## Adding Commands

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


## Getting Voice Commands


```ts

voice.getCommands();

```
Returns a list of all known game commands.

## Removing Commands

### Removes a single command

```ts

voice.removeVoiceCommand('jump');

```
|Parameters|Type|Description|
|:----------:|:-----:|:----------|
|name|string|Takes the commands name as input to remove|

Returns ```true``` if command has been removed successfully.

### Removes all commands

```ts

voice.clearCommands();

```
Removes all commands previously registered withing the library.