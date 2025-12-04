# Integration Tests

---

## Integration Test for Use Case 1 - Voice Recognition



1. Developer runs their game to test it, and starts by clicking "Whisper Init" and activating mic.
2. Developer selects online or offline mode.
3. Developer initializes model.
4. System downloads model module.
5. Developer clicks Start Listening.
6. System begins listening and records the utterance.
7. API transcribes the audio.
8. The transcription is sent back to the game and displayed to the developer.
9. Developer clicks Stop Listening.
10. System stops listening.



### Details

* Runs `SpeechConverterOffline / initializes Whisper module and loads model` unit test.
* Runs `SpeechConverterOffline / initialize and calls StartListening()` unit test.
* Runs `SpeechConverterOffline / StopListening() stops the audio input handler` unit test.
* Runs `SpeechConverterOffline / throws error when startListening() is called without initializing` unit test.
* Runs `SpeechConverterOffline / throws error when stopListening() is called without initializing` unit test.
* Runs `SpeechConverterOffline / throws error on getTranscribedText() is called without initializing` unit test.
* Runs `AudioInputHandler / should create an instance with the callback` unit test.
* Runs `AudioInputHandler / should say that we are listening with true` unit test.
* Runs `AudioInputHandler / should call onAudioChunk when audio data arrives` unit test.
* Runs `AudioInputHandler / should stop listening and clean up resources` unit test.

**Passes if all tests pass.**

---

## Integration Test for Use Case 2 - Extract Commands

1. The system captures AAC board voice input.
2. SpeechConverter transcribes the audio into text (e.g., "jump").
3. The transcription is tokenized by Command Converter.
4. Tokenized transcription is filtered to remove filler words and non-command words.
5. Remaining tokens are mapped to commands (e.g., "jump" → `Jump`).
6. Commands are sent to the game.
7. Game displays and logs the commands.

### Details

* Runs `SpeechConverterOffline / Processes valid transcribed text` unit test.
* Runs `SpeechConverterOffline / ProcessText called with null value` unit test.
* Runs `SpeechConverterOffline / ProcessText called with [BLANK_AUDIO]` unit test.
* Runs `SpeechConverterOffline / ProcessText called with spaces only` unit test.
* Runs `SpeechConverterOffline / Logs transcribed text` unit test.
* Runs `SpeechConverterOffline / Does not log blank audio` unit test.
* Runs `CommandMapping / adds a command and returns success result` unit test.
* Runs `ConfidenceMatcher / findMatch / returns exact match when command exists and is active` unit test.
* Runs `ConfidenceMatcher / findMatch / finds phonetic match when exact match fails` unit test.

**Passes if all tests pass.**

---

## Integration Test for Use Case 3 - Speaker Separation

1. System captures mixed audio with multiple speakers.
2. The speaker-separation model splits the audio stream into streams for each speaker.
3. Model runs on the isolated player streams and transcribes the utterance.
4. Transcription is normalized and mapped to a game command (e.g., "pause" → `PauseGame`).
5. API sends `PauseGame` to the game; UI confirms action.
6. Log command and speaker attribution.

### Exceptions

* Separation uncertain / low confidence

### Details

* Runs `AudioInputHandler / should return a sample rate of 48000` unit test.
* Runs `AudioInputHandler / should call onAudioChunk when audio data arrives` unit test.
* Runs `SpeechConverterOffline / combines chunks of data and returns a single Float32Array` unit test.
* Runs `SpeechConverterOffline / downsample() converts higher sample to a lower sample` unit test.
* Runs `SpeechConverterOffline / Calls setAudio successfully` unit test.
* Runs `CommandHistory / getAll / should return all commands` unit test.

**Passes if all tests pass.**

---

## Integration Test for Use Case 4 - Background Noise Filtering

1. System captures the noisy audio.
2. Noise suppression/denoising module processes the audio to reduce background interference.
3. ASR transcribes the cleaned audio.
4. Transcription is matched to a command (e.g., "left" → `MoveLeft`).
5. If confidence is high, API sends `MoveLeft` to the game and UI shows visual confirmation.
6. Command and environment metadata (noise level) are logged.

### Details

* Runs `SpeechConverterOffline / returns true for silence (RMS below 0.01)` unit test.
* Runs `SpeechConverterOffline / returns false for non-silence (RMS >= 0.01)` unit test.
* Runs `SpeechConverterOffline / returns true for an all-zero waveform` unit test.
* Runs `SpeechConverterOffline / returns false at the threshold (RMS exactly 0.01)` unit test.
* Runs `ConfidenceMatcher / findMatch / returns null when no commands meet threshold` unit test.
* Runs `ConfidenceMatcher / threshold management / sets and gets global threshold` unit test.
* Runs `ConfidenceMatcher / threshold management / throws error for invalid threshold` unit test.

**Passes if all tests pass.**

---

## Integration Test for Use Case 5 - Interpret Synonyms of Commands

1. System captures the utterance and model transcribes it (e.g., "hop").
2. The command-mapping module looks up the token in the synonym table.
3. "hop" is mapped to canonical command `Jump`.
4. API issues `Jump` to the game.
5. Provide visual confirmation, log synonym used, and log mapping confidence.

### Exceptions

* Developer disabled synonym mapping, and non-command words are filtered out.

### Details

* Runs `SynonymResolver / should fetch synonyms from API` unit test.
* Runs `SynonymResolver / should normalize words to lowercase` unit test.
* Runs `SynonymResolver / should cache synonyms after first fetch` unit test.
* Runs `SynonymResolver / should exclude the original word from synonyms` unit test.
* Runs `SynonymResolver / should check if two words are synonyms` unit test.
* Runs `SynonymResolver / should return false when words are not synonyms` unit test.
* Runs `SynonymResolver / should return true when comparing same word` unit test.
* Runs `CommandMapping / Synonym Response / returns synonyms that were mapped` unit test.
* Runs `CommandMapping / getAllSynonymMappings / returns map of commands to synonyms` unit test.
* Runs `CommandMapping / Manual Synonym Operations / adds a single synonym manually` unit test.
* Runs `CommandMapping / Manual Synonym Operations / adds multiple synonyms manually` unit test.
* Runs `CommandMapping / Manual Synonym Operations / gets synonyms for a specific command` unit test.

**Passes if all tests pass.**

---

## Integration Test for Use Case 6 - Register Game Commands

1. AAC game developer uses the API toolkit to add commands like `start`, `red`, `blue`, `green`.
2. They tell the API what each command means and map those commands to game actions.
3. Developer speaks (e.g., "red"). The API transcribes and tokenizes the audio.
4. The game executes and logs the command.

### Details

* Runs `CommandMapping / Basic Command Operations / adds a command and returns success result` unit test.
* Runs `CommandMapping / Basic Command Operations / rejects duplicate commands` unit test.
* Runs `CommandMapping / Basic Command Operations / rejects empty command name` unit test.
* Runs `CommandMapping / Basic Command Operations / removes a command` unit test.
* Runs `CommandMapping / Basic Command Operations / lists all commands` unit test.
* Runs `CommandMapping / Basic Command Operations / clears all commands` unit test.
* Runs `CommandMapping / Synonym Response / returns empty array when fetchSynonyms is false` unit test.
* Runs `CommandMapping / Synonym Response / returns empty array when API returns no synonyms` unit test.
* Runs `CommandMapping / Synonym Response / handles API errors gracefully` unit test.
* Runs `CommandHistory / toggle / should add if toggle is true` unit test.

**Passes if all tests pass.**

---

## Integration Test for Use Case 7 - Toggle Input History

1. AAC player's caretaker uses the API window and goes to settings.
2. The system has toggleable settings for input history.
3. The caretaker toggles off the input history.
4. AAC player receives reduced visual stimuli and can comfortably enjoy playing the AAC game.

### Alternate Flows / Exceptions

* Developer has registered a new command and uses the command history to troubleshoot the new command.
* Developer has confidence that it was registered correctly and working once able to see it in the command history.


### Details

* Runs `CommandHistory / toggle / should add if toggle is true` unit test.
* Runs `CommandHistory / toggle / should not add if toggle is false` unit test.
* Runs `CommandHistory / getAll / should return all commands` unit test.
* Runs `CommandHistory / getSlice / should return slice from start to end` unit test.
* Runs `CommandHistory / getSlice / should return slice from start to end of array when end not provided` unit test.
* Runs `CommandHistory / getSlice / should return entire array when start is 0 and no end` unit test.
* Runs `CommandHistory / getSlice / should return empty array when start >= end` unit test.
* Runs `CommandHistory / getSlice / should return empty array when start equals end` unit test.
* Runs `CommandHistory / clear / should clear empty history without error` unit test.
* Runs `CommandHistory / clear / should clear all commands` unit test.

**Passes if all tests pass.**

---

## Integration Test for Use Case 8 - Confidence Level of Interpreted Game Input

1. Developer speaks game commands into the microphone (e.g., "attack").
2. The game command is interpreted and inputted to the game.
3. Developer receives a confidence level from the API that determines how confident the API was in choosing that command based on synonyms to a known command.
4. This allows the developer to have control over which commands are recognized as valid game inputs, ensuring that only reliable commands can affect the gameplay.

### Details

* Runs `ConfidenceMatcher / constructor and config / uses default config when none provided` unit test.
* Runs `ConfidenceMatcher / constructor and config / accepts partial config override` unit test.
* Runs `ConfidenceMatcher / findMatch / returns exact match when command exists and is active` unit test.
* Runs `ConfidenceMatcher / findMatch / returns null when phonetic matching disabled and no exact match` unit test.
* Runs `ConfidenceMatcher / findMatch / finds phonetic match when exact match fails` unit test.
* Runs `ConfidenceMatcher / findMatch / returns null when no commands meet threshold` unit test.
* Runs `ConfidenceMatcher / threshold management / sets and gets global threshold` unit test.
* Runs `ConfidenceMatcher / threshold management / throws error for invalid threshold` unit test.
* Runs `ConfidenceMatcher / phonetic matching toggle / can enable and disable phonetic matching` unit test.
* Runs `SynonymResolver / should handle API errors gracefully` unit test.
* Runs `SynonymResolver / should handle network errors gracefully` unit test.
* Runs `SynonymResolver / should handle empty API response` unit test.

**Passes if all tests pass.**

---

## On This Page

* [Integration Test for Use Case 1 - Voice Recognition](#integration-test-for-use-case-1---voice-recognition)
* [Integration Test for Use Case 2 - Extract Commands](#integration-test-for-use-case-2---extract-commands)
* [Integration Test for Use Case 3 - Speaker Separation](#integration-test-for-use-case-3---speaker-separation)
* [Integration Test for Use Case 4 - Background Noise Filtering](#integration-test-for-use-case-4---background-noise-filtering)
* [Integration Test for Use Case 5 - Interpret Synonyms of Commands](#integration-test-for-use-case-5---interpret-synonyms-of-commands)
* [Integration Test for Use Case 6 - Register Game Commands](#integration-test-for-use-case-6---register-game-commands)
* [Integration Test for Use Case 7 - Toggle Input History](#integration-test-for-use-case-7---toggle-input-history)
* [Integration Test for Use Case 8 - Confidence Level of Interpreted Game Input](#integration-test-for-use-case-8---confidence-level-of-interpreted-game-input)

---
