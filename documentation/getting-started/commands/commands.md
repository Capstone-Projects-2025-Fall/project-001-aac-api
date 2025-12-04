# Managing Voice Commands

## Adding Commands

This page explains how to manage voice commands using the AACVoiceAPI library. It covers how to add commands with optional descriptions, activation states, and synonym fetching, showing multiple examples including batch addition of commands. It also explains how to retrieve all registered commands, remove individual or all commands, and check if a command is already registered. The guide provides clear parameter definitions, return formats, and usage examples to help developers integrate and control voice-driven actions in their applications.

|Parameters|Type|Description|
|:----------:|:-----:|:----------|
|name|string|the voice command that needs to be said for action to occur|
|action| Function | A function that the developer passes to the library to be executed any time the voice command is recognized|
|options| Object (optional)| **description** ```Default is ""```<br/> - Value that allows the developer to describe what the command does in more detail<br/>**active** ```Default is true``` <br/> - Turns on or off voice command. Defaults to true if user does not supply a value.<br/>**fetchSynonyms** ```Default is true``` <br/>    - Determines whether to fetch words similar in meaning or sound based on the provided name parameter.<br/>**numberOfSynonyms** ```Default is 3``` <br/>  - The number of synonyms to fetch if fetch synonyms is set to true. |


Returns an object in the format:
```ts
{
    success: boolean,
    commandName: string,
    synonymsMapped: string[],
    synonymCount: number,
}
```
### Examples of how to call the method:

```ts
const voice = new AACVoiceAPI();

voice.addVoiceCommand(
    'jump',
    () => console.log('player jumped'),
    {
        description:'displays a message that the player jumped',
        active: true,
        fetchSynonyms: true,

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

Here is an example of making an array of commands to add to the Command Library:
```ts
const voice = new AACVoiceAPI();

const setupVoiceCommands = () => {

    const commands = [
        {
            name: "blue",
            action: () => changeColor("dodgerblue", "Blue"),
            options:{
                description: "changes color to blue",
                fetchSynonyms: true,
            }
        },
        {
            name: "red",
            action: () => changeColor("darkred", "Red"),
            options:{
                description: "changes color to red",
                fetchSynonyms: true,
            }
        },
        {
            name: "green",
            action: () => changeColor("darkseagreen", "Green"),
            options:{
                description: "changes color to green",
                fetchSynonyms: false,
            }                
        },

    ];

    commands.forEach(async cmd => {
        const added =  await voice.addVoiceCommand(cmd.name, cmd.action, cmd.options);//d12e
        if (added?.success) console.log(`[System] Command added: ${added.commandName} with synonyms ${added.synonymsMapped}`);
    });
};
```



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

### Determine if a command has been registered

```ts

voice.isRegistered('jump');
```

|Parameters|Type|Description|
|:----------:|:-----:|:----------|
|name|string|Takes the name of the command you are checking|

Returns ```true``` if command has already been registered.