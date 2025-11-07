from speechbrain.inference.ASR import EncoderDecoderASR
from speechbrain.inference.separation import SepformerSeparation
import numpy as np
import torch
import torchaudio

# Transcription Models
# "speechbrain/asr-streaming-conformer-librispeech",
# "https://huggingface.co/speechbrain/models",
# "speechbrain/asr-whisper-medium-commonvoice-en",
# speechbrain/asr-wav2vec2-commonvoice-en" - does not work
# "speechbrain/asr-crdnn-rnnlm-librispeech",
# "openai/whisper-medium.en"
# speechbrain/spkrec-ecapa-voxceleb

# Speech Separation Models
# "speechbrain/sepformer-wham",
# speechbrain/sepformer-whamr16k
# speechbrain/asr-transformer-transformerlm-librispeech - works but very slow

class SpeechBrain:
    __model_transcribe = None
    __model_sep = None
    
    #Treats the models as a static instance where they are only loaded once
    def __init__(self):
        if(SpeechBrain.__model_transcribe is None):
            SpeechBrain.__model_transcribe = EncoderDecoderASR.from_hparams(
                source = "speechbrain/asr-crdnn-rnnlm-librispeech",
                savedir = "pretrained_models/asr"
            )
        if(SpeechBrain.__model_sep is None):
            SpeechBrain.__model_sep = SepformerSeparation.from_hparams(
                source ="speechbrain/sepformer-whamr16k",
                savedir = "pretrained_models/separation"
            )
    
    #recieves float32Array.buffer form frontend and transcribes it
    def transcribe_raw_bytes(self, data: bytes, sample_rate: int) -> str:
        try:
            waveform = self._bytes_to_tensor(data)
            wav_lens = torch.tensor([1.0])
            
            #checks for blank audio
            if(self._is_silence(waveform)):
                print("No voice detected")
                return "[BLANK_AUDIO]"

            target_rate= 16000 #model expects this
            waveform = self._resample(sample_rate, target_rate, waveform)
                
            transcribed = SpeechBrain.__model_transcribe.transcribe_batch(waveform, wav_lens)
            print(transcribed[0][0])
            return str(transcribed[0][0])
        
        except RuntimeError as e:  # torchaudio / ffmpeg issues
            return f"[ERROR] Audio processing failed: {e}"
        except Exception as e:
            return f"[ERROR] Transcription failed: {e}"
    
    #Expects the input to be float32Arrary.buffer
    #Outputs a tensor object for furthery processing
    def _bytes_to_tensor(self, data : bytes) -> torch.Tensor:
        audio_data = np.frombuffer(data, dtype=np.float32)
        return torch.tensor(audio_data, dtype=torch.float32).unsqueeze(0)
    
        
    #takes in float32Array.buffer from frontend and performs speech separation
    #returns a tensor that can have multiple audios
    def _separate_speech(self, data:bytes, sample_rate: int) -> tuple:
        try:
            waveform = self._bytes_to_tensor(data)
            
            target_rate= 16000 #model expects this
            if sample_rate != target_rate:
                resampler = torchaudio.transforms.Resample(sample_rate, target_rate)
                waveform = resampler(waveform)
            
            separatedFiles = SpeechBrain.__model_sep.separate_batch(waveform)
            
            return separatedFiles, target_rate
            
        except RuntimeError as e:  # torchaudio / ffmpeg issues
            return (f"[ERROR] Speech Separation processing failed: {e}", None)
        except Exception as e:
            return (f"[ERROR] Separation failed: {e}", None)

    def _transcribe_from_tensor(self, separated_tensor: torch.tensor, sample_rate: int) -> list:
            transcribedText = list()
            wave_lens = torch.tensor([1.0])#tells it to use the full time
            num_sources = separated_tensor.shape[-1] #should always be 2
            
            for i in range(num_sources):
                waveform = separated_tensor[0,:,i].unsqueeze(0)
                
                #checks for blank audio
                if(self._is_silence(waveform)):
                    print("No voice detected")
                    transcribedText.append("[BLANK_AUDIO]")
                else:                   
                    target_rate= 16000 #model expects this
                    waveform = self._resample(sample_rate, target_rate, waveform)    
                    transcription = SpeechBrain.__model_transcribe.transcribe_batch(waveform, wave_lens)    
                    text = transcription[0][0] if isinstance(transcription[0], list) else transcription[0]
                    transcribedText.append(text)
            return transcribedText
        
    def separate_then_transcribe(self, data:bytes, sample_rate: int) -> list:
        
            sep_files, newRate = self._separate_speech(data, sample_rate)
            text = self._transcribe_from_tensor(sep_files, newRate)
            
            return text
    
    #returns true if audio is deemed too quiet for transcription
    def _is_silence(self, waveform: torch.Tensor)->bool:
            audio = torch.sqrt(torch.mean(waveform ** 2))
            if(audio < 0.01):
                print("No voice detected")
                return True
            return False
        
    # resamples audio to target audio if not already in the correct rate   
    def _resample(self, original_rate: int, target_rate: int, waveform:torch.Tensor) -> torch.Tensor:
            if original_rate != target_rate:
                resampler = torchaudio.transforms.Resample(original_rate, target_rate)
                waveform = resampler(waveform)
            return waveform
            
        
            

        
    