---
sidebar_position: 2
---

# System Block Diagram

![System Block Diagram](/img/AAC_API_diagram.png)

## Description

1. The AAC user presses the button for “run” on their device.

2. The AAC device vocalizes the word “run.”

3. The microphone captures this speech input using the Web Audio API.

4. An audio processing API cleans the captured audio to improve quality and raise the confidence level for recognition.

5. The processed audio is sent to the Web Speech API, which transcribes it into text.

6. The transcribed text is matched against a user-defined dictionary of game commands.

7. The system returns a JSON response containing:

    - The chosen game command

    - A confidence level score

8. The game uses this command to control the character or determine the next move.