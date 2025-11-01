from speechbrain.inference.ASR import EncoderDecoderASR, EncoderASR
import numpy as np
import torch
import torchaudio
import tempfile


class SpeechBrain:
    __model = None

    #only allows the model to be loaded once
    def __init__(self):
        if(SpeechBrain.__model is None):
            SpeechBrain.__model = EncoderDecoderASR.from_hparams(
                source ="speechbrain/asr-crdnn-rnnlm-librispeech",
                savedir = self.tmpdir 
            )
    
    #recieves float32Array.buffer form frontend and transcribes it
    def transcribe(self, data: bytes, sample_rate: int) -> str:
        try:
            wave = self.__bytes_to_tensor(data)
            wav_lens = torch.tensor([1.0])
            #resamples
            normalized = SpeechBrain.__model.normalizer(wave, sample_rate)
            transcribed = SpeechBrain.__model.transcribe_batch(normalized, wav_lens)
            
            return transcribed[0] if isinstance(transcribed, list) else transcribed
        
        except RuntimeError as e:  # torchaudio / ffmpeg issues
            return f"[ERROR] Audio processing failed: {e}"
        except Exception as e:
            return f"[ERROR] Transcription failed: {e}"
    
    #converts bytes into a torch.Tensor for speechBrain transcription
    def __bytes_to_tensor(self, data : bytes) -> torch.Tensor:
        audio_data = np.frombuffer(data, dtype=np.float32)
        return torch.tensor(audio_data, dtype=torch.float32).unsqueeze(0)
        
       
        

        
    
        
    