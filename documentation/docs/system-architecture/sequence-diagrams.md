---
sidebar_position: 5
---

# Sequence Diagrams

### Sequence Diagram 1 - Voice Recognition

```mermaid
sequenceDiagram
    actor AAC Game Developer
    participant Game
    participant API
    
    AAC Game Developer->>Game: Click Init
    activate Game
    Game->>API: Download speech-to-text model
    activate API
    API-->>Game: Model downloaded
    Game-->>AAC Game Developer: Model initalized
        
    alt STT model not initialized
        API-->>Game: STT module not downloaded
        deactivate API
        Game-->> AAC Game Developer: Init failed
        deactivate Game
    end

    AAC Game Developer->>Game: Start listening
    activate Game
    Game-->>AAC Game Developer: Started listening
    loop every two seconds
        AAC Game Developer ->> Game: Open audio stream
        activate Game
        Game->>API: Captured audio data 
        activate API
        API->>API: Transcribe text
        API-->>Game: Transcribed text
        deactivate API
        Game-->>AAC Game Developer: Display transcribed text
    end
    AAC Game Developer->>Game: Stop listening
    Game-->>AAC Game Developer: Close audio stream
    deactivate Game
    Game-->>AAC Game Developer: Stopped listening
    deactivate Game
```

### Sequence Diagram 2 - Extract Commands

```mermaid
sequenceDiagram
    actor AAC Player
    participant Game
    participant SpeechConverter
    participant CommandConverter
    
    AAC Player->>Game: "please jump now"
    activate Game
    Game->>SpeechConverter: transcribe audio
    activate SpeechConverter
    SpeechConverter->>CommandConverter: Normalize and tokenize transcription
    activate CommandConverter
    CommandConverter->>CommandConverter: Check for commands in Commandlibrary
    CommandConverter-->>SpeechConverter: Return command match
    deactivate CommandConverter

    SpeechConverter-->>Game: Return game commands
    deactivate SpeechConverter
    activate Game
    Game->>Game: Execute callback function
    deactivate Game
    Game-->>AAC Player: Changed game state and logs
    alt Filter removes all words
        Game-->>AAC Player: No change to game state
    else Multiple possible commands
        Game-->>AAC Player: "Did you mean JUMP?"
    end
    deactivate Game
```

### Sequence Diagram 3 - Speaker Seperation

```mermaid
sequenceDiagram
    actor AAC Player
    actor Non-player
    participant Game
    participant API

    Note over Game: Multiple speaker mode activated
    activate Game

    par AAC Player speaks
        AAC Player->>Game: "Pause game"
    and Non-player speaks
        Non-player->>Game: "A potato flew around my room"
    end
    
    Game->>API: Process audio data
    activate API
    API->>API: Split audio stream into two audio streams
    loop for each audio stream
        API->>API: Transcribe audio
        API->>API: Tokenize and filter out non-command words
    end
    API-->>Game: Return game commands
    deactivate API
    activate Game
    Game->>Game: Execute callback functions
    deactivate Game
    Game-->>AAC Player: Changed game state and logs
    
    alt Uncertain speaker separation
        Game-->>AAC Player: "Did you say 'pause'?"
        AAC Player->>Game: Confirm command
        Game->>Game: Execute pause action
        Game-->>AAC Player: Game paused
    else Overlapping identical words
        Game->>Game: Check confidence 
        alt Can resolve with confidence
            Game->>Game: Execute pause action
            Game-->>AAC Player: Game paused
        else Cannot resolve
            Game-->>AAC Player: Request confirmation
        end
    end
    deactivate Game
```

### Sequence Diagram 4 - Background Noise Filtering

```mermaid
sequenceDiagram
    actor AAC Player
    participant Game
    participant API
    
    AAC Player->>Game: Speak command in noisy environment
    activate Game
    Game->>API: Audio data
    activate API
    API->>API: Remove background noise with NoiseFilter
    API->>API: Isolate command through audio processing pipeline (See Diagram 2)
    API-->>Game: Return command
    deactivate API
    activate Game
    Game->>Game: Execute callback functions
    deactivate Game
    Game-->>AAC Player: Changed game state and logs
    deactivate Game
```

### Sequence Diagram 5 - Interpret Synonyms of Commands

```mermaid
sequenceDiagram
    actor AAC Player
    participant Game
    participant SynonymMapper
    participant API
    
    AAC Player->>Game: Speak command "hop"
    activate Game
    Game->>API: Process audio data
    activate API
    API->>API: Transcribe and tokenize audio

    API->>SynonymMapper: Look up "hop" in synonym table
    activate SynonymMapper
    SynonymMapper-->>API: Map to "Jump" command
    deactivate SynonymMapper
    API-->>Game: Return command
    deactivate API
    
    activate Game
    Game->>Game: Execute Jump callback function
    Game-->>AAC Player: Changed game state and logs
    deactivate Game
    alt Synonym mapping disabled by AAC Game Developer
        Game-->>AAC Player: No change to game state
    end
    deactivate Game
```

### Sequence Diagram 6 - Register Game Commands

```mermaid
sequenceDiagram
    actor AAC Game Developer
    participant APIToolkit
    participant CommandLibrary
    
    AAC Game Developer->>APIToolkit: Download API toolkit
    activate APIToolkit
        
    loop Add Game Commands
        AAC Game Developer->>APIToolkit: Add command
        APIToolkit->>CommandLibrary: Register command
        AAC Game Developer->>APIToolkit: Map commands to game actions
        APIToolkit->>CommandLibrary: Store command mappings
        activate CommandLibrary

        CommandLibrary-->>APIToolkit: Confirm successful registration
        deactivate CommandLibrary
    end
    opt Test command recognition
        AAC Game Developer->>Game: Start AAC Game, initialize model
        activate Game
        Game-->>AAC Game Developer: Model initialized
        AAC Game Developer->>Game: Speak commands
        activate Game
        Game->>API: Process audio input
        activate API
        API-->>CommandLibrary: Check tokens with known commands
        activate CommandLibrary
        CommandLibrary->>CommandLibrary: Match token to command
        CommandLibrary-->>API: Matched commands
        deactivate CommandLibrary
        API-->>Game: Return game commands
        deactivate API
        Game-->>AAC Game Developer: Changed gamestate and logs
        deactivate Game
        deactivate Game
    end
```
### Sequence Diagram 7 - Toggle Input History

```mermaid
sequenceDiagram
    actor Caretaker
    actor AAC Game Developer
    participant AAC Game
    
    Stan's Caretaker ->> AAC Game: Access API window
    activate AAC Game
    Stan's Caretaker ->> AAC Game: Navigates to settings
    AAC Game -->> Stan's Caretaker: Displays toggable settings for input history
    Stan's Caretaker ->> AAC Game: Toggle off input history
    
    AAC Game -->> Stan: Reduced visual stimuli
    deactivate AAC Game    
    alt AAC game developer troubleshoots new command registered
        AAC Game Developer ->> AAC Game: Register new command
        activate AAC Game
        AAC Game Developer ->> AAC Game: Checks command history
        AAC Game -->> AAC Game Developer: Displays command history
        Note over AAC Game Developer, AAC Game: Confidence tha command ws registered and working correctly
    end
```

### Sequence Diagram 8 - Confidence Level of Interpreted Game Input

```mermaid
sequenceDiagram
    actor AAC Game Developer
    participant System
    participant Game
    participant API
        
    AAC Game Developer ->> System: Speak into microphone
    activate System
    System ->> Game: Audio data stream
    activate Game
    loop Audio Processing
        Game ->> API: Transcribe, tokenize, and filter commands
        activate API
        API -->> Game: return game commands
        deactivate API
    end
    Game ->> Game: execute game callback function
    Game -->> System: log command, confidence level, and transcription
    deactivate Game
    System -->> AAC Game Developer: display logs
    deactivate System
```