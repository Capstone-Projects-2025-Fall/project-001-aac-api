---
sidebar_position: 5
---

# Sequence Diagrams

### Use Case 1 - Voice Recognition

```mermaid
sequenceDiagram
    actor Steven
    participant Game
    participant System
    participant API
    
    activate Game
    Steven->>Game: Click Whisper Init
    activate Game
    Game->>System: Download whisper module
    activate System
    System-->>Game: Whisper downloaded
    Game-->>Steven: Whisper initalized.
        
    alt Whisper not initialized
        System-->>Game: Whisper module not downloaded
        deactivate System
        Game-->> Steven: Whisper init failed.
        deactivate Game
    end

    Steven->>Game: Start listening
    activate Game
    Game->>System: Open audio stream
    activate System
    Game-->>Steven: Started Listening.
    Note right of System: Audio input stream
    loop every two seconds
        System->>API: Send audio for transcription
        activate API
        API->>API: Transcribe text
        API-->>Game: Transcribed text
        deactivate API
        Game-->>Steven: Display transcribed text
    end
    Steven->>Game: Stop listening
    Game->>System: Close audio stream
    deactivate System
    Game-->>Steven: Stopped Listening.
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
    actor Steven
    participant Game
    participant System
    participant ASR
    participant SynonymMapper
    participant API
    
    Note over Steven: Previously configured<br/>synonym mappings
    
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
        System-->>Steven: Option to enable synonym mapping
    end
    
    System->>System: Log synonym usage and confidence
    deactivate System
```

### Use Case 6 - Support Commmon Game Inputs

```mermaid
sequenceDiagram
    actor Steven
    participant APIToolkit
    participant CommandLibrary
    participant System
    
    Steven->>APIToolkit: Open API toolkit
    activate APIToolkit
        
    loop Add Common Game Commands
        Steven->>APIToolkit: Add command
        APIToolkit->>CommandLibrary: Register command 
    end
    
    Steven->>APIToolkit: Map commands to game actions
    APIToolkit->>CommandLibrary: Store command mappings
    activate CommandLibrary

    CommandLibrary-->>APIToolkit: Confirm successful registration
    deactivate CommandLibrary
    
    Steven->>APIToolkit: Test command recognition
    activate APIToolkit
    APIToolkit->>System: Turn on microphone
    activate System
    System-->>APIToolkit: Microphone ready
    deactivate System
    APIToolkit-->>Steven: Ready to listen for commands
    Steven->>System: Speak "Move Left"
    activate System
    System->>System: Process audio input
    Note over System, CommandLibrary: Handled by API (see Use Case 1)
    System-->>CommandLibrary: Transcribed command
    deactivate System
    activate CommandLibrary
    CommandLibrary->>CommandLibrary: Match text to command
    CommandLibrary-->>APIToolkit: Command recognized
    deactivate CommandLibrary
    APIToolkit-->>Steven: Command recognized: Move Left
    deactivate APIToolkit
    APIToolkit-->>Steven: Setup complete
    deactivate APIToolkit
```

### Use Case 7 - Register New Commands

```mermaid
sequenceDiagram
    actor Steven
    participant AAC Voice API
    participant CommandLibrary
    Note over CommandLibrary: Assume the system command library has common commands in command library by initialization

    Steven ->> AAC Voice API: Enters a new command
    activate AAC Voice API
    AAC Voice API ->> CommandLibrary: Checks if command exists
    activate CommandLibrary
    
    alt Command exists
        CommandLibrary -->> AAC Voice API: Send message back
        deactivate CommandLibrary
        AAC Voice API -->> Steven: Notify command exists
    else Command doesn't exist
        AAC Voice API ->> CommandLibrary: Add new command
        activate CommandLibrary
        CommandLibrary -->> AAC Voice API: Notify confirmation
        deactivate CommandLibrary
        AAC Voice API -->> Steven: Confirms success of adding command
        deactivate AAC Voice API
    end
```
### Use Case 8 - Toggle Input History

```mermaid
sequenceDiagram
    actor Steven
    Note over Stan: AAC game shows command history while running, which makes Stan overstimulated
    actor Stan's Caretaker
    participant AAC Game
    
    Note over Stan's Caretaker, AAC Game: Game is running API, game command history is visible to players.
    Stan's Caretaker ->> AAC Game: Access API window
    activate AAC Game
    Stan's Caretaker ->> AAC Game: Navigates to settings
    AAC Game -->> Stan's Caretaker: Displays toggable settings for input history
    Stan's Caretaker ->> AAC Game: Toggle off input history
    
    AAC Game -->> Stan: Reduced visual stimuli
    deactivate AAC Game
    Note over Stan: Stan can now comfortably enjoy playing the game
    Note over Stan's Caretaker, AAC Game: AAC Game is playable without visible command history
    
    opt Steven troubleshoots new command registered
        Steven ->> AAC Game: Register new command
        activate AAC Game
        Steven ->> AAC Game: Checks command history
        AAC Game -->> Steven: Displays command history
        Note over Steven, AAC Game: Confidence tha command ws registered and working correctly
    end
```

### Use Case 9 - Confidence Level of Interpreted Game Input

```mermaid
sequenceDiagram
    actor Steven
    participant GameSystem
    
    Note over GameSystem: microphone is active
    
    Steven ->> GameSystem: Speak game commands into microphone
    activate GameSystem
    GameSystem ->> GameSystem: Interpret and input command into game
    GameSystem -->> Steven: Return confidence level
    deactivate GameSystem
    
    Note over GameSystem: Game accurately interprets game commands
    
    opt Incorrect voice input
        activate GameSystem
        GameSystem -->> Steven: Incorrectly interpreted voice input
        Steven ->> GameSystem: Adjusts code accordingly
        deactivate GameSystem
    end

```