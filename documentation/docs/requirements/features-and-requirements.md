---
sidebar_position: 4
---

# Features and Requirements

## Functional Requirements

- The API must convert voice input into game action. (top level requirement)
- The API must be able to define game controls.
- The user can play previous AAC games using our API.
- The API is able to interpret synonyms of commands as valid inputs.
- The API should allow game developers to update a list of known game commands.
- Users will be able to view a toggleable command history, recording all commands voiced by users during the game.
- Developers will be able to view the confidence levels of voice input conversions.
- Developers will have the option to assign new commands in the API library.

## Nonfunctional Requirements

- The API must have a low latency, maximizing game feedback and improving user experience.
- The API will show a quality indicator to help the user determine their voice’s volume and quality when they are speaking.
- The API must parse voice input from filler/noncommand voice input.
- The API must distinguish between multiple voice inputs.
- The API must filter out background noise.
- The API will feature command indicators in the form of visual cues, which caretakers will be able to toggle to increase/reduce in game visual stimuli.
