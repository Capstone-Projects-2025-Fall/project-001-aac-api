---
sidebar_position: 5
---

# Sequence Diagrams

### Sequence Diagram 1 - Voice Recognition

Normal flow:
    1. Developer selects online or offline mode.
    2. Developer initializes model.
    3. System downloads model module.
    4. Developer clicks Start Listening.
    5. System begins listening and records the utterance.
    6. API transcribes the audio.
    7. The transcription is sent back to the game and displayed to the developer.
    8. Developer clicks Stop Listening.
    9. System stops listening.

Alternate flows / exceptions:
    1. Model package not downloaded: show prompt “Init failed.” 

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

Normal flow:
    1. The system captures AAC board voice input.
    2. SpeechConverter transcribes the audio into text (e.g., “please jump now”).
    3. The transcription is tokenized by Command Converter.
    4. Tokenized transcription is filtered to remove filler words, sounds, and non-command words (e.g., "please" and "now").
    4. Remaining tokens are mapped to commands.
    5. Commands are sent to the game.
    6. Game displays and logs the commands.

Alternate flows / exceptions:
    1. No command, filter removes all meaningful words (e.g., utterance was “uh now”): no game action.
    2. Multiple possible commands: request quick confirmation (“Did you mean JUMP?”) or choose highest-confidence and log uncertainty.

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

Normal flow:
    1. System captures mixed audio with multiple speakers.
    2. The speaker-separation model splits the audio stream into streams for each speaker.
    3. Model runs on the isolated player streams and transcribes the utterance.
    4. Transcription is normalized and mapped to a game command (e.g., PauseGame).
    5. API sends PauseGame to the game; UI confirms action.
    6. Log command and speaker attribution.

Alternate flows / exceptions:
    1. Separation uncertain / low confidence: show a quick confirmation prompt (“Did you say ‘pause’?”). If the player confirms, proceed; otherwise ignore.

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

Normal flow:
    1. System captures the noisy audio.
    2. Noise suppression/denoising module processes the audio to reduce background interference.
    3. ASR transcribes the cleaned audio.
    4. Transcription is matched to a command (e.g., “left” → MoveLeft).
    5. If confidence is high, API sends MoveLeft to the game and UI shows visual confirmation.
    6. Command and environment metadata (noise level) are logged.

Alternate flows / exceptions:
    1. Noise overwhelms voice: Show "no speech detected" note.
    2. Misrecognized phrase due to residual noise: if confidence low, ask for repeat or confirmation.

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

Normal flow:
    1. System captures the utterance and model transcribes it (e.g., “hop”).
    2. The command-mapping module looks up the token in the synonym table.
    3. “hop” is mapped to canonical command Jump.
    4. API issues Jump to the game.
    5. Provide visual confirmation, log synonym used, and log mapping confidence.

Alternate flows / exceptions:
    1. Developer disabled synonym mapping, and non-command words are filtered out.

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

Normal flow:
    1. AAC game developer uses the API toolkit to add commands like Start Game, red, blue, green. 
    2. They tell the API what each command means and map those commands to game actions. 
    3. Developer speaks. The API transcribes and tokenizes the audio.
    4. The game executes and logs the command.

Postconditions: System contains common commands in a command library. All commands for the AAC game are entered in the command library, and can be used by players through the API.

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

Normal flow: 
    1. AAC player's caretaker uses the API window and goes to settings.
    2. The system has toggleable settings for input history.
    3. The caretaker toggles off the input history.
    4. AAC player receives reduced visual stimuli and can comfortably enjoy playing the AAC game.

Alternate flows / exceptions:
    1. Developer has registered a new command and uses the command history to troubleshoot the new command. 
    2. He has confidence that it was registered correctly and working once he is able to see it in the command history.

```mermaid
sequenceDiagram
    actor AAC Game Developer
    participant Game
    participant APIToolkit
    
    AAC Game Developer->>APIToolkit: Download API
    activate APIToolkit
    APIToolkit-->>AAC Game Developer: API package downloaded
    deactivate APIToolkit
    AAC Game Developer->>APIToolkit: Turn on toggleable command history
    AAC Game Developer->>Game: Start AAC game
    activate Game
    AAC Game Developer->>Game: Click command history
    activate Game
    Game-->>AAC Game Developer: Display command history window
    deactivate Game
    AAC Game Developer->>Game: Click on command history again
    activate Game
    Game-->>AAC Game Developer: Hide command history window
    deactivate Game
    deactivate Game
```

### Sequence Diagram 8 - Confidence Level of Interpreted Game Input

Normal flow:
    1. Developer speaks game commands into the microphone.
    2. The game command is interpreted and inputted to the game.
    3. Developer receives a confidence level from the API that determines how confident the API was in choosing that command based on synonyms to a known command. 
    4. This allows him to have control over which commands are recognized as valid game inputs. ensuring that only reliable commands can affect the gameplay.

Alternate flows / exceptions:
    1. The game incorrectly interprets the voice input.
    2. Developer adjusts the code accordingly.

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