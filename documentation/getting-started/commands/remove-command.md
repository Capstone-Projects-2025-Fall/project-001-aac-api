# Removing Commands

## Removes a single command

```ts

voice.removeVoiceCommand('jump');

```
|Parameters|Type|Description|
|:----------:|:-----:|:----------|
|name|string|Takes the commands name as input to remove|

Returns ```true``` if command has been removed successfully.

## Removes all commands

```ts

voice.clearCommands();

```
Removes all commands previously registered withing the library.