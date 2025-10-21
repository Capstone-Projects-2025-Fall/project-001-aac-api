---
sidebar_position: 5
---

# Sequence Diagrams

### Use Case 1 - Voice Recognition

Actor: Suzy (player / AAC device user)

Triggering event: Suzy opens a supported game and taps the in-game microphone icon (or activates mic).

Preconditions: Game is running and in a state that accepts the Start command; microphone access is granted; network (if required) is available.

Normal flow (happy path):
1. Suzy taps the microphone icon.
2. System checks microphone level and readiness.
3. System begins listening and records the utterance.
4. ASR (speech→text) transcribes the audio.
5. The transcribed text is normalized and matched to the command set; the text maps to the StartGame command.
6. If the command confidence is high, the API sends the StartGame command to the game.
7. The game changes to the playing state and the UI shows confirmation (visual cue like “Game started”).
8. The event is logged in command history.

Alternate flows / exceptions:
1. Low mic level: show prompt “Please increase mic volume / move closer to the device”
2. Low confidence: show prompt “Could you say that again?” → re-listen one retry; if still low, show “Try again later” or offer manual control.
3. Network error: show “Unable to process voice now” and fallback to manual start.

Postconditions: Game has started (or appropriate error/feedback displayed); command logged.

```mermaid
sequenceDiagram
    actor Suzy
    participant Game
    participant System
    participant ASR
    participant API
    
    Suzy->>Game: Tap microphone icon
    activate Game
    Game->>System: Check microphone status
    activate System
    System-->>Game: Microphone ready
    deactivate System

    Game->>System: Begin listening
    activate System
    Note right of System: Records audio input
    System->>ASR: Send audio for transcription
    activate ASR
    ASR-->>System: Return transcribed text
    deactivate ASR

    System->>System: Normalize and match to command set
    Note right of System: Maps to StartGame command
    
    alt High confidence
        System->>API: Send StartGame command
        activate API
        API->>Game: Execute StartGame
        Game->>Game: Change to playing state
        Game-->>Suzy: Show visual confirmation
        API->>System: Log command in history
        deactivate API
    else Low confidence
        System-->>Suzy: "Could you say that again?"
        opt Still low after retry
            System-->>Suzy: "Try again later"
            System-->>Game: Fallback to manual control
        end
    else Network error
        System-->>Suzy: "Unable to process voice now"
        System-->>Game: Fallback to manual start
    end
    deactivate System
    deactivate Game
```

### Use Case 2 - Filter Out Filler Words

Actor: Suzy (player)

Triggering event: Suzy speaks while playing, e.g., “uh jump now.”

Preconditions: Game is in a state that accepts gameplay commands; microphone is active.

Normal flow:
1. The system captures Suzy’s voice.
2. ASR transcribes the audio into text (e.g., “uh jump now”).
3. The pipeline runs a filler-word filter and removes tokens like “uh”, “um”, “now”.
4. Remaining tokens are tokenized and mapped to command(s) (e.g., “jump” → Jump).
5. If mapping confidence is high, the API issues the Jump action to the game immediately.
6. UI gives immediate feedback (visual cue + animation) and logs the command.

Alternate flows / exceptions:
1. Filter removes all meaningful words (e.g., utterance was “uh now”): ask the player to repeat.
2. Multiple possible commands: request quick confirmation (“Did you mean JUMP?”) or choose highest-confidence and log uncertainty.
3. Low confidence: prompt for repeat.

Postconditions: Jump action executed (or user prompted to repeat); command history updated.

```mermaid
sequenceDiagram
    actor Suzy
    participant Game
    participant System
    participant ASR
    participant API
    participant FillerFilter
    
    Suzy->>System: Speak command "uh jump now"
    activate System
    System->>ASR: Send audio for transcription
    activate ASR
    ASR-->>System: Return transcribed text
    deactivate ASR
    
    System->>FillerFilter: Process text "uh jump now"
    activate FillerFilter
    Note right of FillerFilter: Remove filler words<br/>"uh" and "now"
    FillerFilter-->>System: Return filtered text "jump"
    deactivate FillerFilter
    
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

Actor: Suzy (primary player) and nearby non-player speakers (e.g., parent)

Triggering event: Suzy speaks a command while other people speak at the same time.

Preconditions: Enrolled player voice profile exists; speaker-separation model is enabled.

Normal flow:
1. System captures mixed audio with multiple speakers.
2. The speaker-separation model isolates the enrolled player’s audio stream (prefer enrolled stream).
3. ASR runs on the isolated player stream and transcribes the utterance.
4. Transcription is normalized and mapped to a game command (e.g., PauseGame).
5. If confidence is high, API sends PauseGame to the game; UI confirms action.
6. Log command and speaker attribution.

Alternate flows / exceptions:
1. No enrolled profile available
2. Separation uncertain / low confidence: show a quick confirmation prompt (“Did you say ‘pause’?”). If the player confirms, proceed; otherwise ignore.
3. Overlapping identical words from multiple speakers: use confidence + enrolled preference; if unresolved, request confirmation.

Postconditions: Game paused (if confirmed); system records speaker attribution and confidence.

```mermaid
sequenceDiagram
    actor Suzy
    actor Parent
    participant Game
    participant System
    participant SpeakerSeparation
    participant ASR
    participant API
    
    Note over Suzy,Parent: Both speaking simultaneously
    par Suzy speaks command
        Suzy->>System: Speak "pause game"
    and Parent speaks
        Parent->>System: Speaking other words
    end
    
    activate System
    System->>SpeakerSeparation: Process mixed audio
    activate SpeakerSeparation
    Note right of SpeakerSeparation: Compare with enrolled<br/>player voice profile
    SpeakerSeparation-->>System: Return isolated player audio
    deactivate SpeakerSeparation
    
    System->>ASR: Transcribe isolated audio
    activate ASR
    ASR-->>System: Return transcribed text
    deactivate ASR
    
    System->>System: Normalize and map to command
    Note right of System: Maps to PauseGame command
    
    alt High confidence & clear speaker separation
        System->>API: Send PauseGame command
        activate API
        API->>Game: Execute pause action
        activate Game
        Game-->>Suzy: Show UI confirmation
        deactivate Game
        API->>System: Log command with speaker attribution
        deactivate API
    else No enrolled profile
        System-->>Suzy: "Please enroll voice profile"
    else Uncertain speaker separation
        System-->>Suzy: "Did you say 'pause'?"
        alt User confirms
            Suzy->>System: Confirm command
            System->>API: Send PauseGame command
            API->>Game: Execute pause action
            Game-->>Suzy: Show UI confirmation
        end
    else Overlapping identical words
        System->>System: Check confidence & enrolled preference
        alt Can resolve with confidence
            System->>API: Send command with high confidence
            API->>Game: Execute action
            Game-->>Suzy: Show UI confirmation
        else Cannot resolve
            System-->>Suzy: Request confirmation
        end
    end
    deactivate System
```

### Use Case 4 - Background Noise Filtering

Actor: Suzy (player)

Triggering event: Suzy issues a command in a noisy environment (e.g., TV).

Preconditions: Noise-robust ASR / denoising pipeline active; microphone picks up signal.

Normal flow:
1. System captures the noisy audio.
2. Noise suppression/denoising module processes the audio to reduce background interference.
3. ASR transcribes the cleaned audio.
4. Transcription is matched to a command (e.g., “left” → MoveLeft).
5. If confidence is high, API sends MoveLeft to the game and UI shows visual confirmation.
6. Command and environment metadata (noise level) are logged.

Alternate flows / exceptions:
1. Noise overwhelms voice: prompt the user to repeat or show a “can’t hear” note.
2. Misrecognized phrase due to residual noise: if confidence low, ask for repeat or confirmation.
3. Adaptive fallback: optionally switch to a push-to-talk or require closer mic.

Postconditions: Movement executed (or prompt shown); noise metrics recorded for debugging.

```mermaid
sequenceDiagram
    actor Suzy
    participant Game
    participant System
    participant NoiseFilter
    participant ASR
    participant API
    
    Note over Suzy,System: Noisy environment (e.g., TV playing)
    Suzy->>System: Speak command "left"
    activate System
    
    System->>NoiseFilter: Process noisy audio
    activate NoiseFilter
    Note right of NoiseFilter: Apply noise suppression/<br/>filtering
    NoiseFilter-->>System: Return cleaned audio
    deactivate NoiseFilter
    
    System->>ASR: Transcribe cleaned audio
    activate ASR
    ASR-->>System: Return transcribed text
    deactivate ASR
    
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

Actor: Suzy (player); Developer (configures mapping)

Triggering event: Suzy uses a synonym (e.g., “go” for Move, “hop” for Jump).

Preconditions: Synonym mapping table exists (configured by developer or default set); ASR and command mapper active.

Normal flow:
1. System captures the utterance and ASR produces text (e.g., “hop”).
2. The command-mapping module looks up the token in the synonym table.
3. “hop” is mapped to canonical command Jump.
4. If confidence is high, API issues Jump to the game.
5. Provide visual confirmation and log synonym used and mapping confidence.

Alternate flows / exceptions:
1. Unknown synonym: present developer UI option to register this phrase as a synonym, or prompt the player: “Did you mean JUMP?”
2. Multiple possible canonical matches: prompt for confirmation or use highest confidence mapping.
3. Developer disabled synonym mapping: treat unknown words as unrecognized and prompt to repeat or register command.

Postconditions: Correct canonical command executed or developer/user receives a prompt to resolve ambiguity.

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

### Use Case 6 - Support Commmon Game Inputs (Incomplete)

Actor: Steven (developer)

Triggering Event: Steven uses the API toolkit to set up the basic commands the game will understand.

Preconditions: Game API has empty command library.

Normal flow:
1. Steven, a game developer, uses the API toolkit, like Start Game, Move Left, Move Right, Jump, Pause, and Shield.
2. They tell the API what each command means and connect those commands to the game’s actions. When a player speaks, the API listens, figures out the right command, and sends it back to the game in a clear format.

Postconditions: System contains common commands in a command library.

```mermaid
sequenceDiagram
    actor Steven
    participant APIToolkit
    participant CommandLibrary
    participant System
    
    Steven->>APIToolkit: Open API toolkit
    activate APIToolkit
        
    par Add Movement Commands
        Steven->>APIToolkit: Add "Move Left" command
        APIToolkit->>CommandLibrary: Register command
        Steven->>APIToolkit: Add "Move Right" command
        APIToolkit->>CommandLibrary: Register command
    and Add Action Commands
        Steven->>APIToolkit: Add "Jump" command
        APIToolkit->>CommandLibrary: Register command
        Steven->>APIToolkit: Add "Shield" command
        APIToolkit->>CommandLibrary: Register command
    and Add Game Control Commands
        Steven->>APIToolkit: Add "Start Game" command
        APIToolkit->>CommandLibrary: Register command
        Steven->>APIToolkit: Add "Pause" command
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

### Use Case 7 - Previous Game Integration

Actor: Steven (developer)

Triggering Event: Suzy wants to play an AAC game she used last semester.

Preconditions: System supports current AAC games.

Normal flow:
1. The developer adds a small connector that uses the API’s standard commands.
2. Suzy’s voice inputs still work in the old game without needing to rewrite the code.

Alternate flows / exceptions:
1. The old game is set up in a way that is not compatible with the API.
2. The old game's code needs to be directly modified.

Postconditions: Suzy is able to play the old AAC games using the API.

### Use Case 8 - Register New Commands

Actor: Steven (developer)

Triggering Event: Steven adds new commands to command library through the API to support new game.

Preconditions: System command library has common commands in command library.

Normal flow:
1. System has the ability to register new commands through the API.
2. Steven enters new commands in command library using the API toolkit.
3. This will allow the API to remain flexible to any future games that require more complex commands that are not currently supported.

Alternate flows / exceptions:
1. The system command log already contains all the needed commands for the game.

Postconditions: All commands for the AAC game are entered in the command library, and can be used by players through the API.

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
### Use Case 9 - Toggle Input History

Actor: Steven (developer); Stan (player)

Triggering Event: Stan is overstimulated by the AAC game.

Preconditions: AAC game is running API and game command history is visible to players.

Normal flow:
1. Stan's caretaker uses the API window and goes to settings.
2. The system has toggleable settings for input history.
3. The caretaker toggles off the input history.
4. Stan receives reduced visual stimuli and can comfortably enjoy playing the AAC game.

Alternate flows / exceptions:
1. Steven has registered a new command and uses the command history to troubleshoot the new command.
2. He has confidence that it was registered correctly and working once he is able to see it in the command history.

Postconditions: AAC game is playable without a visible command history.

```mermaid
sequenceDiagram
    actor Stan
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

### Use Case 10 - Confidence Level of Interpreted Game Input

Actor: Steven (developer):

Triggering Event: Steven is experimenting with API speech input.

Preconditions: Game is in a state that accepts gameplay commands; microphone is active.

Normal flow:
1. Steven speaks game commands into the microphone.
2. The game command is interpreted and inputed to the game.
3. Steven receives a confidence level from the API that determines how confident the API was in choosing that command based on synonyms to a known command.
4. This allows him to have control over which commands are recognized as valid game inputs. ensuring that only reliable commands can affect the gameplay.

Alternate flows / exceptions:
1. The game incorrectly interprets the voice input.
2. Steven adjusts the code accordingly.

Postconditions: Game accurately interprets gameplay commands.

```mermaid
sequenceDiagram
    actor Steven
    participant GameSystem
    
    Note over Steven: Steven is experimenting with API speech input
    Note over GameSystem: Game accepts gameplay commands, microphone is active
    
    Steven ->> GameSystem: Speak game commands into microphone
    activate GameSystem
    GameSystem ->> GameSystem: Interpret and input command into game
    GameSystem -->> Steven: Return confidence level
    deactivate GameSystem
    
    Note over Steven: Control over which commands are valid inputs, ensuring reliable commands affect gameplay
    Note over GameSystem: Game accurately interprets game commands
    
    opt Incorrect voice input
        activate GameSystem
        GameSystem -->> Steven: Incorrectly interpreted voice input
        Steven ->> GameSystem: Adjusts code accordingly
        deactivate GameSystem
    end

```