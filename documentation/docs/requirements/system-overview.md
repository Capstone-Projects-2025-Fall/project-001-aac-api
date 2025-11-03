---
sidebar_position: 1
---

# System Overview

## Project Abstract

This application programming interface (API) supports AAC games. The API allows users to play AAC games like StoryQuest through external AAC board interaction, rather than relying on an embedded AAC board in the game. Users can relay game inputs by either speaking verbally or speaking through the board. The API will enable audio-controlled games, which will promote social and communication skills in children who use AAC devices by enabling AAC users to play games alongside non-AAC users.

## Conceptual Design

The proposed solution is a client side Typescript API designed for integration into new or existing web based games for Augmentative and Alternative Communication (AAC) users. The API leverages standard browser technologies to ensure wide compatibility with most machines. The core audio processing pipeline uses Web Speech API for speech to text. Web Audio API and RNNoise will be used to clean the audio. This process isolates the user's AAC device audio from ambient sound and other voices. The API is structured for reusability. A game developer integrates the library by initializing with a config object. The object serves as a developer defined dictionary, mapping voice commands (eg "jump") to specific callback functions within the games existing code.

## Background

Augmentative and Alternate Communication (AAC) devices provide essential communication capabilities for individuals with significant speech impairments caused by conditions such as autism spectrum disorder, cerebral palsy, and ALS. While effective for structured expression, these devices often present challenges in the fast-paced, interactive context of video games. This technological gap can lead to frustrating user experiences and social exclusion for AAC users. AAC games are being developed to address this issue, but currently rely on an integrated AAC board, which require all users to learn a new, game specific interface rather than using their own AAC device. This project addresses this limitation by developing a reusable software tool, a developer focused API which allows game interaction through audio. This approach improves upon the current model by allowing direct input from the users' personal devices. The goal is to provide a solution that game developers can integrate into any new or existing web based application. 