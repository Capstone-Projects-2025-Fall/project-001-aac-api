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
    participant API
    
    AAC Player->>Game: "please jump now"
    activate Game
    Game->>API: transcribe audio
    activate API
    API->>API: Tokenize and filter out non-command words
    API-->>Game: Return game commands
    deactivate API
    Game->>Game: Execute callback function

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
    actor Suzy
    participant Game
    participant System
    participant NoiseFilter
    participant API
    
    Note over Suzy,System: Noisy environment (e.g., TV playing)
    Suzy->>System: Speak command "left"
    activate System
    
    System->>NoiseFilter: Process noisy audio
    activate NoiseFilter
    Note right of NoiseFilter: Apply noise suppression/<br/>filtering
    NoiseFilter-->>System: Return cleaned audio
    deactivate NoiseFilter
    
    System->>API: Transcribe cleaned audio
    activate API
    API-->>System: Return transcribed text
    deactivate API
    
    System->>System: Match to command
    Note right of System: Maps to MoveLeft command
    
    alt High confidence
        System->>API: Send MoveLeft command
        activate API
        API->>Game: Execute move action
        activate Game
        Game-->>Suzy: Show visual confirmation
        deactivate Game
        API->>System: Log command with noise metrics
        deactivate API
    else Noise overwhelms voice
        System-->>Suzy: "Can't hear you"
        Note right of System: Record noise level metrics
        opt Adaptive response
            System-->>Suzy: "Try push-to-talk mode"
            System->>System: Switch to push-to-talk
        end
    else Low confidence due to noise
        System-->>Suzy: "Please repeat command"
        opt After multiple failures
            System-->>Suzy: "Move closer to mic"
        end
    end
    
    System->>System: Record environment metadata
    Note right of System: Log noise levels for debugging
    deactivate System
```

### Sequence Diagram 5 - Interpret Synonyms of Commands

```mermaid
sequenceDiagram
    actor Suzy
    actor AAC Game Developer
    participant Game
    participant System
    participant ASR
    participant SynonymMapper
    participant API
    
    Note over AAC Game Developer: Previously configured<br/>synonym mappings
    
    Suzy->>System: Speak command "hop"
    activate System
    System->>ASR: Process audio
    activate ASR
    ASR-->>System: Return transcribed text
    deactivate ASR
    
    System->>SynonymMapper: Look up "hop" in synonym table
    activate SynonymMapper
    SynonymMapper-->>System: Map to "Jump" command
    deactivate SynonymMapper
    
    alt High confidence mapping
        System->>API: Send Jump command
        activate API
        API->>Game: Execute Jump action
        activate Game
        Game-->>Suzy: Show visual confirmation
        deactivate Game
        API->>System: Log command with synonym info
        deactivate API
    else Unknown synonym
        System-->>Suzy: "Did you mean JUMP?"
        Suzy->>System: Confirm command
        System->>API: Send Jump command
        API->>Game: Execute Jump action
        Game-->>Suzy: Show visual feedback
    
    else Multiple possible matches
        System->>System: Check confidence scores
        alt High confidence match exists
            System->>API: Send highest confidence command
            API->>Game: Execute action
            Game-->>Suzy: Show visual feedback
        else No clear match
            System-->>Suzy: Request command confirmation
        end
    else Synonym mapping disabled
        System-->>Suzy: "Command not recognized"
        System-->>AAC Game Developer: Option to enable synonym mapping
    end
    
    System->>System: Log synonym usage and confidence
    deactivate System
```

### Sequence Diagram 6 - Register Game Commands

```mermaid
sequenceDiagram
    actor AAC Game Developer
    participant APIToolkit
    participant CommandLibrary
    participant System
    
    AAC Game Developer->>APIToolkit: Open API toolkit
    activate APIToolkit
        
    loop Add Common Game Commands
        AAC Game Developer->>APIToolkit: Add command
        APIToolkit->>CommandLibrary: Register command 
    end
    
    AAC Game Developer->>APIToolkit: Map commands to game actions
    APIToolkit->>CommandLibrary: Store command mappings
    activate CommandLibrary

    CommandLibrary-->>APIToolkit: Confirm successful registration
    deactivate CommandLibrary
    
    AAC Game Developer->>APIToolkit: Test command recognition
    activate APIToolkit
    APIToolkit->>System: Turn on microphone
    activate System
    System-->>APIToolkit: Microphone ready
    deactivate System
    APIToolkit-->>AAC Game Developer: Ready to listen for commands
    AAC Game Developer->>System: Speak Command
    activate System
    System->>System: Process audio input
    Note over System, CommandLibrary: Handled by API (see Sequence Diagram 1)
    System-->>CommandLibrary: Transcribed command
    deactivate System
    activate CommandLibrary
    CommandLibrary->>CommandLibrary: Match text to command
    CommandLibrary-->>APIToolkit: Command recognized
    deactivate CommandLibrary
    APIToolkit-->>AAC Game Developer: Command recognized
    deactivate APIToolkit
    APIToolkit-->>AAC Game Developer: Setup complete
    deactivate APIToolkit
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