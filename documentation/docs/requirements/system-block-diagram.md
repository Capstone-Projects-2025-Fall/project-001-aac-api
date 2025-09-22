---
sidebar_position: 2
---

# System Block Diagram

![System Block Diagram](/img/AAC_API_diagram.png)
**Figure 1** High level design of AACommodate API 

## Description

### AudioHandler

AudioHandler is responsible for managing microphone permissions and ensuring that the application has the necessary access to capture audio. It filters out background noise to improve the clarity of the input, processes the audio signals from the microphone, and converts the captured speech into text for further use by the system.

### Developer Tools

Developer Tools allow game developers to add custom game commands and define synonyms that map to these commands, providing flexibility in how players can interact with the game and ensuring a more intuitive user experience.

### Command Converter
Command Converter acts as an intermediary between the audio input system and the game logic. It receives transcribed text from the AudioHandler and executes the callback function specified by the game developer, allowing custom game commands to be triggered based on user speech.

### Accessibility Tools
Accessibility tools will be provided to allow the caretaker to manually control the amount of visual stimulation displayed on the screen. This includes elements such as command history and any other potentially visually overstimulating content.
	
