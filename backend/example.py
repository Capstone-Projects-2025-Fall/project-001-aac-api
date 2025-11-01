# transcribe.py
from speechbrain.inference.ASR import EncoderDecoderASR
import torchaudio
import tempfile

def main():
    # Load the pretrained ASR model
    tmpdir = tempfile.mkdtemp()
    asr_model = EncoderDecoderASR.from_hparams(
        source="speechbrain/asr-crdnn-rnnlm-librispeech", #"speechbrain/asr-crdnn-rnnlm-librispeech",
        savedir=tmpdir #"pretrained_models/asr",
        
    )

    # Path to your audio file (must be WAV, mono, 16 kHz recommended)
    audio_file = "example.wav"
    waveform, orig_src = torchaudio.load(audio_file)
    
    resampler = torchaudio.transforms.Resample(orig_freq=orig_src, new_freq=16000)
    waveform_16k = resampler(waveform)
    torchaudio.save("temp.wav", waveform_16k, 16000)
    
    # Transcribe the audio
    print("Transcribing audio...")
    transcription = asr_model.transcribe_file("temp.wav")
    print("Transcription:", transcription)
    

if __name__ == "__main__":
    main()
