---
sidebar_position: 5
---

# Use-case descriptions

### Use Case 1 - Voice Recognition

Suzy is a child whose main form of communication is her AAC device. She opens a supported game, taps the in-game microphone icon, and says “start.” The API detects adequate mic level, converts the response to a Start Game command, and the game begins. If confidence is low, Suzy sees a prompt like “Could you say that again?” before the game starts.

### Use Case 2 - Filter Out Filler Words

During play, Suzy says, “uh jump now.” The API removes filler/ non command words “uh,” “now”, recognizes JUMP, and triggers the jump action without delay.

### Use Case 3 - Speaker Seperation

Suzy and her dad speak near the device. When Suzy says “pause,” the API uses speakerseparation to prefer the enrolled player stream and issues PauseGame, ignoring overlapping non-player chatter. If uncertainty remains, the API requests a quick confirmation.

### Use Case 4 - Background Noise Filtering

Suzy’s sibling is talking in the background and a TV is on. Suzy says “left.” The API’s noise filtering suppresses TV chatter, isolates Suzy’s voice, and sends MoveLeft. If noise overwhelms the signal, the API asks for a repeat.

### Use Case 5 - Interpret Synonyms of Commands

Suzy says “go” instead of “move,” and later “hop” instead of “jump.” The API maps recognized synonyms to the fix command set (Move, Jump) defined for the game and executes the correct actions.

### Use Case 6 - Support Commmon Game Inputs

Steven, a game developer, uses the API toolkit to set up the basic commands the game will understand, like Start Game, Move Left, Move Right, Jump, Pause, and Shield. They tell the API what each command means and connect those commands to the game’s actions. When a player speaks, the API listens, figures out the right command, and sends it back to the game in a clear format.

### Use Case 7 - Previous Game Integration

Suzy wants to play an AAC game she used last semester. The developer added a small connector that uses the API’s standard commands, so Suzy’s voice inputs still work in the old game without needing to rewrite its code.

### Use Case 8 - Register New Commands

Steven will also have the ability to register new commands through the API. This will allow the API to remain flexible to any future games that require more complex commands that are not currently supported.

### Use Case 9 - Toggle Input History

Steven will want the ability to toggle the game command history. Especially after he has registered a new command, he will have confidence that it was registered correctly and working once he is able to see it in the command history.

### Use Case 10 - Confidence Level of Interpreted Game Input

Steven receives a confidence level from the API that determines how confident the API was in choosing that command based on synonyms to a known command. This allows him to have control over which commands are recognized as valid game inputs, ensuring that only reliable commands can affect the gameplay.
