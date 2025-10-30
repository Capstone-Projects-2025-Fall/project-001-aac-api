# transcribe.py
from speechbrain.inference import EncoderDecoderASR
import torchaudio

def main():
    # Load the pretrained ASR model
    asr_model = EncoderDecoderASR.from_hparams(
        source="speechbrain/asr-crdnn-rnnlm-librispeech",
        savedir="pretrained_models/asr"
    )

    # Path to your audio file (must be WAV, mono, 16 kHz recommended)
    audio_file = "example.wav"
    waveform, orig_src = torchaudio.load(audio_file)
    print(orig_src)
    resampler = torchaudio.transforms.Resample(orig_freq=orig_src, new_freq=16000)
    waveform_16k = resampler(waveform)
    torchaudio.save("temp_16k.wav", waveform_16k, 16000)
    # Transcribe the audio
    print("Transcribing audio...")
    transcription = asr_model.transcribe_file("temp_16k.wav")
    print("Transcription:", transcription)
    

if __name__ == "__main__":
    main()
