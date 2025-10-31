from speechbrain.inference.ASR import EncoderDecoderASR
import torchaudio
import tempfile


class SpeechBrain:
    __model = None
    __tmpdir = None
    __tmpfiles = None
    
    def __init__(self):
        if(SpeechBrain._model is None):
            self.tmpdir = tempfile.mkdtemp()
            EncoderDecoderASR._model = EncoderDecoderASR.from_hparams(
                source ="speechbrain/asr-crdnn-rnnlm-librispeech",
                savedir = self.tmpdir 
            )
    
    
    def transcribe(audioFile: str):
        pass
    
        
    