<div align="center">

# AACcommodate API

[![Report Issue on Jira](https://img.shields.io/badge/Report%20Issues-Jira-0052CC?style=flat&logo=jira-software)](https://temple-cis-projects-in-cs.atlassian.net/jira/software/c/projects/AAC/issues?jql=project%20%3D%20%22AAC%22%20ORDER%20BY%20created%20DESC)
[![Deploy Docs](https://github.com/ApplebaumIan/tu-cis-4398-docs-template/actions/workflows/deploy.yml/badge.svg)](https://github.com/Capstone-Projects-2025-Fall/project-001-aac-api/actions/workflows/deploy.yml)
[![Documentation Website Link](https://img.shields.io/badge/-Documentation%20Website-brightgreen)](https://capstone-projects-2025-fall.github.io/project-001-aac-api/docs/requirements/system-overview)

</div>

## Getting Started

### Installing the API

How to download the [NPM package](https://www.npmjs.com/package/aac-voice-api) to use in your own project.

To install the npm package in your project, open a terminal and enter the following command:

```npm install aac-voice-api``` 

Once you have installed the npm package, you'll want to add the Whisper model to your project. The link to the model can be found [here](https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-tiny.bin)
Then, using vite, add the following lines to your project code:

```'Cross-Origin-Opener-Policy': 'same-origin',```
```'Cross-Origin-Embedder-Policy': 'require-corp',```

To see a sample of the API in another project, go to [this repository](https://github.com/Russo903/aac-voice-api-milestone-demo-1.git) and clone it locally. Run the following commands:

```npm install```

```npm run dev```

You are now hosting the game locally.

Here is an example of how to add game commands to your project.

## Example

```ts
import { AACVoiceAPI } from 'aac-voice-api';

// Create an instance of the voice API
const voice = new AACVoiceAPI();

// Add a voice command
voice.addVoiceCommand({
  name: "jump",
  action: () => console.log("player jumped"),
  description: "Activates the jump command",
  active: true,
});

// Initialize the API
// Whisper Models can be found at https://huggingface.co/ggerganov/whisper.cpp/tree/main
voice.initiate("url", "en");

// Start listening for voice commands
voice.start();
```

## Project Abstract

This application programming interface (API) supports AAC games. The API allows users to play AAC games like StoryQuest through external AAC board interaction, rather than relying on an embedded AAC board in the game. Users can relay game inputs by either speaking verbally or speaking through the board. The API will enable audio-controlled games, which will promote social and communication skills in children who use AAC devices by enabling AAC users to play games alongside non-AAC users.

## High Level Requirement

The API must convert voice input into game action and be able to define game commands. Users can play previous AAC games using our API. The API must be able to interpret synonyms of commands as valid inputs. The API should allow game developers to update a list of known game commands.

## Conceptual Design

The proposed solution is a client side Typescript API designed for integration into new or existing web based games for Augmentative and Alternative Communication (AAC) user's. The API leverages standard browser technologies to ensure wide compatibility with most machines. The core audio processing pipeline uses Web Speech API for speech to text. Web Audio API and RNNoise will be used to clean the audio. This process isolates the users AAC device from ambient sound and other voices. The API is structured for reusability. A game developer integrates the library by initializing with a config object. THe object serves as a developer defined dictionary, mapping voice commands (eg "jump") to specific callback functions within the games existing code.

## Background

Augmentative and Alternate Communication (AAC) devices provide essential communication capabilities for individuals with significant speech impairments resulting from conditions such as Autism Spectrum Disorder, Cerebral Palsy, or ALS. While effective for structured expression, these devices often present challenges in the fast paced, interactive context of video games. This technological gap can lead to frustrating user experience and social exclusion for AAC users. Current solutions for this issue generally look like this. Involving in game, simulated AAC boards, which require users to learn a new, game specific interface rather than using their own familiar device. This project addresses these limitations by developing a reusable software tool, a developer focused API, rather than a single, standalone game. The goal is to provide a solution that game developers can integrate into any new or exisiting web based application. This approach improves upon the current model by allowing direct input from the users personal devices.

## Collaborators

<div align="center">

[//]: # 'Replace with your collaborators'

[Ian Tyler Applebaum](https://github.com/ApplebaumIan) • [Kyle Dragon Lee](https://github.com/leekd99) • [Tam Trang](https://github.com/HolyGodEze) • [Michael Colbert](https://github.com/colbert95) • [Jessica Hutchison](https://github.com/jesshutchison) • [Gino Russo](https://github.com/Russo903) • [Hena Patel](https://github.com/Hena3124)

</div>
