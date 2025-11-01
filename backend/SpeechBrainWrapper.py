from speechbrain.inference.ASR import EncoderDecoderASR
from speechbrain.inference.separation import SepformerSeparation
import numpy as np
import torch
import torchaudio
import tempfile


class SpeechBrain:
    __model_transcribe = None
    __model_sep = None
    
    #only allows the model to be loaded once
    def __init__(self):
        if(SpeechBrain.__model_transcribe is None):
            SpeechBrain.__model_transcribe = EncoderDecoderASR.from_hparams(
                source ="speechbrain/asr-crdnn-rnnlm-librispeech",
                savedir = "pretrained_models/asr"
            )
        if(SpeechBrain.__model_sep is None):
            SpeechBrain.__model_sep = SepformerSeparation.from_hparams(
                source ="speechbrain/sepformer-wham",
                savedir = "pretrained_models/separation"
            )
    
    #recieves float32Array.buffer form frontend and transcribes it
    def transcribe_raw_bytes(self, data: bytes, sample_rate: int) -> str:
        try:
            wave = self.__bytes_to_tensor(data)
            wav_lens = torch.tensor([1.0])
            #resamples
            normalized = SpeechBrain.__model_transcribe.normalizer(wave, sample_rate)
            transcribed = SpeechBrain.__model_transcribe.transcribe_batch(normalized, wav_lens)
            
            return transcribed[0] if isinstance(transcribed, list) else transcribed
        
        except RuntimeError as e:  # torchaudio / ffmpeg issues
            return f"[ERROR] Audio processing failed: {e}"
        except Exception as e:
            return f"[ERROR] Transcription failed: {e}"
    
    #converts bytes into a torch.Tensor for speechBrain transcription
    def __bytes_to_tensor(self, data : bytes) -> torch.Tensor:
        audio_data = np.frombuffer(data, dtype=np.float32)
        return torch.tensor(audio_data, dtype=torch.float32).unsqueeze(0)
        
    #takes in float32Array.buffer from frontend and performs speech separation
    #returns a tensor that can have multiple audios
    def separate_speech(self, data:bytes, sample_rate: int) -> torch.tensor:
        try:
            wave = self.__bytes_to_tensor(data)
            separatedFiles = SpeechBrain.__model_sep.separate_batch(wave)
            return separatedFiles
            
        except RuntimeError as e:  # torchaudio / ffmpeg issues
            return f"[ERROR] Speech Separation processing failed: {e}"
        except Exception as e:
            return f"[ERROR] Separation failed: {e}"

    def transcribe_from_tensor(separated_tensor: torch.tensor) -> list:
            transcribedText = list()
            for audioSample in separated_tensor:
                length = audioSample.shape[-1]
                transcribedText.append(SpeechBrain.__model_transcribe.transcribe_batch(audioSample, length))
            return transcribedText
            

        
    