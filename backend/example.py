# transcribe.py
from SpeechBrainWrapper import SpeechBrain
import numpy as np
import torchaudio, torch
import tempfile


#only have so you dont need data stream of mic input and can test against offline file
def wav_to_bytes(file_path: str) -> bytes:
    """Read a WAV file and return float32 bytes suitable for SpeechBrain."""
    waveform, sample_rate = torchaudio.load(file_path)
    # Flatten waveform to 1D if stereo
    if waveform.shape[0] > 1:
        waveform = waveform.mean(dim=0, keepdim=True)
    # Convert to float32 bytes
    audio_bytes = waveform.numpy().astype(np.float32).tobytes()
    return audio_bytes, sample_rate

def main():
    raw_bytes1, sample_rate1 = wav_to_bytes("audio/speech_sep.wav")
    raw_bytes2, sample_rate2 = wav_to_bytes("audio/example.wav")
    
    speechmodel = SpeechBrain()
        
    text = speechmodel.transcribe_raw_bytes(raw_bytes2, sample_rate2)
    multipleText = speechmodel.separate_then_transcribe(raw_bytes1, sample_rate1)
    mixedText = speechmodel.transcribe_raw_bytes(raw_bytes1, sample_rate1)
    
    print(" only transcribing using example.wav: ", text)
    print("speech sep using speech_sep.wav: ", multipleText)
    print("raw trascribe using doubleSpeaking: ", mixedText)

if __name__ == "__main__":
    main()