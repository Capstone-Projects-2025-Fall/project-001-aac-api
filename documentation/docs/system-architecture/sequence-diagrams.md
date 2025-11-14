---
sidebar_position: 5
---

# Sequence Diagrams

### Use Case 1 - Voice Recognition

```mermaid
sequenceDiagram
    actor AAC Game Developer
    participant Game
    participant System
    participant API
    
    activate Game
    AAC Game Developer->>Game: Click Whisper Init
    activate Game
    Game->>System: Download whisper module
    activate System
    System-->>Game: Whisper downloaded
    Game-->>AAC Game Developer: Whisper initalized.
        
    alt Whisper not initialized
        System-->>Game: Whisper module not downloaded
        deactivate System
        Game-->> AAC Game Developer: Whisper init failed.
        deactivate Game
    end

    AAC Game Developer->>Game: Start listening
    activate Game
    Game->>System: Open audio stream
    activate System
    Game-->>AAC Game Developer: Started Listening.
    Note right of System: Audio input stream
    loop every two seconds
        System->>API: Send audio for transcription
        activate API
        API->>API: Transcribe text
        API-->>Game: Transcribed text
        deactivate API
        Game-->>AAC Game Developer: Display transcribed text
    end
    AAC Game Developer->>Game: Stop listening
    Game->>System: Close audio stream
    deactivate System
    Game-->>AAC Game Developer: Stopped Listening.
    deactivate Game
```

### Use Case 2 - Filter Out Filler Words

```mermaid
sequenceDiagram
    actor Suzy
    participant Game
    participant System
    participant API
    
    Suzy->>System: Speak command "uh jump now"
    activate System
    System->>API: Send audio for transcription
    activate API
    API-->>System: Return transcribed text
    deactivate API
    
    System->>API: Process text "uh jump now"
    activate API
    API-->>System: Return filtered text "jump"
    deactivate API
    
    System->>System: Tokenize and map to command
    Note right of System: Maps to Jump command
    
    alt High confidence mapping
        System->>API: Send Jump command
        activate API
        API->>Game: Execute Jump action
        activate Game
        Game-->>Suzy: Show visual feedback + animation
        deactivate Game
        API->>System: Log command
        deactivate API
    else Filter removes all words
        System-->>Suzy: "Please repeat command"
    else Multiple possible commands
        System-->>Suzy: "Did you mean JUMP?"
        alt User confirms
            Suzy->>System: Confirm command
            System->>API: Send Jump command
            API->>Game: Execute Jump action
            Game-->>Suzy: Show visual feedback
        end
    else Low confidence
        System-->>Suzy: "Please repeat command"
    end
    deactivate System
```

### Use Case 3 - Speaker Seperation

```mermaid
sequenceDiagram
    actor Suzy
    actor Parent
    participant Game
    participant API
    
    Note over Suzy,Parent: Both speaking simultaneously
    par Suzy speaks command
        Suzy->>Game: Speak "pause game"
    and Parent speaks
        Parent->>Game: Speaking other words
    end
    
    activate Game
    Game->>API: Process mixed audio
    activate API
    API-->>Game: Return isolated player audio
    deactivate API
    
    Game->>API: Transcribe isolated audio
    activate API
    API-->>Game: Return transcribed text
    deactivate API
    
    Game->>Game: Normalize and map to command
    Note right of Game: Maps to PauseGame command
    
    alt High confidence & clear speaker separation
        Game->>API: Send PauseGame command
        activate API
        API->>Game: Execute pause action
        activate Game
        Game-->>Suzy: Show UI confirmation
        deactivate Game
        API->>Game: Log command with speaker attribution
        deactivate API
    else Uncertain speaker separation
        Game-->>Suzy: "Did you say 'pause'?"
        alt User confirms
            Suzy->>Game: Confirm command
            Game->>API: Send PauseGame command
            API->>Game: Execute pause action
            Game-->>Suzy: Show UI confirmation
        end
    else Overlapping identical words
        Game->>Game: Check confidence & enrolled preference
        alt Can resolve with confidence
            Game->>API: Send command with high confidence
            API->>Game: Execute action
            Game-->>Suzy: Show UI confirmation
        else Cannot resolve
            Game-->>Suzy: Request confirmation
        end
    end
    deactivate Game
```

### Use Case 4 - Background Noise Filtering

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

### Use Case 5 - Interpret Synonyms of Commands

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

### Use Case 6 - Register Game Commands

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
    Note over System, CommandLibrary: Handled by API (see Use Case 1)
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
### Use Case 7 - Toggle Input History

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
    Note over Stan: Stan can now comfortably enjoy playing the game
    Note over Stan's Caretaker, AAC Game: AAC Game is playable without visible command history
    
    alt AAC game developer troubleshoots new command registered
        AAC Game Developer ->> AAC Game: Register new command
        activate AAC Game
        AAC Game Developer ->> AAC Game: Checks command history
        AAC Game -->> AAC Game Developer: Displays command history
        Note over AAC Game Developer, AAC Game: Confidence tha command ws registered and working correctly
    end
```

### Use Case 9 - Confidence Level of Interpreted Game Input

```mermaid
sequenceDiagram
    actor AAC Game Developer
    participant GameSystem
    
    Note over GameSystem: microphone is active
    
    AAC Game Developer ->> GameSystem: Speak game commands into microphone
    activate GameSystem
    GameSystem ->> GameSystem: Interpret and input command into game
    GameSystem -->> AAC Game Developer: Return confidence level
    deactivate GameSystem
    
    Note over GameSystem: Game accurately interprets game commands
    
    opt Incorrect voice input
        activate GameSystem
        GameSystem -->> AAC Game Developer: Incorrectly interpreted voice input
        AAC Game Developer ->> GameSystem: Adjusts code accordingly
        deactivate GameSystem
    end

```