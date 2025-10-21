---
title: Class Diagram
---

# Class Diagram

This diagram illustrates the core architecture of AAC Voice API, showing the relationships between main classes
and their responsibilites 
```mermaid
classDiagram
    class index {
       
    }

    class AACVoiceApi {
        - converter: SpeechConverter
        
        + initiate(url: String, language: String) : void
        + start() : void
        + stop() : void
        + displayCommandHistory() : void
    }

    class AudioInputHandler {
        - stream: MediaStream
        - ctx: AudioContext
        - processor: ScriptProcessorNode
        + isListening: Boolean
        
        + onAudioChunk(chunk: Float32Array) void
        + getSampleRate() number
        + startListening() Promise~void~
        + stopListening() void
        
    }
    
    class CommandHistory {
        - history: string[]
        - enabled: Boolean
        - instance: CommandHistory$ 
        
        + getInstance() CommandHistory$
        + toggle(enable: Boolean) void
        + add(command: string) void
        + getAll() string[]
        + getSize() number
        + getSlice(start: number, end: number) string[]
        + clear() void
    }
    
    class GameCommand {
     <<interface>>
     + name: string
     + description: string
     + active: Boolean
     
     + action() void
    }
    
    class commandLibrary {
        - commandMap: Map<string, GameCommand>
        - instance: CommandLibrary$
        
        + getInstance() CommandLibrary$
        - normalize(name: string) string
        + add(command: GameCommand) Boolean
        + remove(name: string) Boolean
        + has(name: string) Boolean
        + get(name: string) Boolean
        + list() GameCommand[]
        + clear() void
    }
    commandLibrary ..|> GameCommand
    
    class CommandMapping {
        - library: CommandLibrary
        
        - normalize(name: string) string
        + addCommand(name: string, action() void, options(description: string, active: Boolean)) Boolean
        + removeCommand(name: string) Boolean
        + getAllCommands() string[]
        + hasCommand(name: string) Boolean
        + getCommand(name: string) GameCommand | undefined
        + clearAllCommands() void
    }
    
    class showHistoryPopup {
        - commandHistory: CommandHistory
        
        + showHistoryPopup() void
    }
    
    class SpeechConverter {
        - whisper: WhisperModule | null
        - audioHandler: AudioInputHandler | null
        - transcribedText: CommandHistory | null
        - transcriptionInterval: ReturnType<setInterval>
        
        - loadModelToFS(modelPath: string) Promise~string~
        + init(modelPath: string, lang: string) Promise~void~
        - downSample(input: Float32Array, inputRate: number, outputRate: number) Float32Array
        - combineChunks(buffer: Float32Array[], blockSize: number) Float32Array
        + startListening() void
        + stopListening() void
        - setAudio(index: number, audio: Float32Array) number
        + getTranscribed() string
        + getStatus() string
        + createWhisperModule() Promise~WhisperModule~
    }
    
    class WhisperModule {
        <<interface>>
    }
    SpeechConverter ..|> WhisperModule
    class SpeechToText {
        
    }
    SpeechToText: This class is currently empty. Future methods and/or data members will be added here.
    
    class CommandMapper {
       
    }
    CommandMapper: This class is currently empty. Future methods and/or data members will be added here.


    class SpeechSeparation {
       
    }
    SpeechSeparation: This class is currently empty. Future methods and/or data members will be added here.

    SpeechConverter ..> AudioInputHandler
    SpeechConverter ..> CommandHistory
    showHistoryPopup ..> CommandHistory
    AACVoiceApi ..> showHistoryPopup
    AACVoiceApi ..> SpeechConverter
    CommandMapping ..> commandLibrary
    AACVoiceApi *-- AudioHandlerInput : contains
    AACVoiceApi *-- SpeechToText : contains
    AACVoiceApi *-- CommandMapper : contains
    index ..> AACVoiceApi
    index ..> commandLibrary
    AudioHandlerInput *-- SpeechSeparation : contains
```
**Figure 2** Class Architecture of our Api

### AACVoiceApi
The main entry point for the API. This will be a facade and the only class that a developer will have to initialize.
Initializes voice command recognition and manages the lifeycle of voice listening sessions.

### AudioHandlerInput
Handles raw audio stream processing from the users microphone. Manages Web Audio API components and converts audio into processable chunks.

### SpeechToText
Consumes (from AudioHandlerInput) and converts audio chunks into text transcriptions for command recognition.

### CommandMapper
Maps recognized speech text to configured voice commands and triggers the appropriate functions

### SpeechSeperation (Still in Discussion)
Processes audio to separate speech from background noise, improving recognition accuracy

### Key Relationships 
- AACVoiceApi serves as the orchestrator, containing and coordinating all major components
- AudioHandlerInput captures and preprocessors audio before passing it to the speech recognition pipeline