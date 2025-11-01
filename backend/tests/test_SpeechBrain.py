import unittest
from unittest.mock import patch, MagicMock
from SpeechBrainWrapper import SpeechBrain
import numpy as np
import torch


class TestSpeechBrain(unittest.TestCase):
    
    
    @patch('SpeechBrainWrapper.SpeechBrain._SpeechBrain__model')
    def test_transcribe_success(self, mock_model):
        
        wrapper = SpeechBrain()
        dummy_array = [0.0, 0.5, -0.5, 1.0, -1.0]
        dummy_bytes = np.array(dummy_array, dtype=np.float32).tobytes()
        dummy_sample_rate = 16000
        
        mock_model.transcribe_batch = MagicMock(return_value=["Transcribed Data into words"])
        mock_model.normalizer = MagicMock(return_value=torch.tensor(dummy_array, dtype=torch.float32).unsqueeze(0))
        
        
        result = wrapper.transcribe(dummy_bytes, dummy_sample_rate)
        self.assertEqual(result, "Transcribed Data into words")
        
        mock_model.normalizer.assert_called_once()
        mock_model.transcribe_batch.assert_called_once()
        
        
    @patch('SpeechBrainWrapper.SpeechBrain._SpeechBrain__model')
    def test_transcribe_handles_runtime_error(self, mock_model):
        wrapper = SpeechBrain()
        dummy_bytes = np.array([0.0], dtype=np.float32).tobytes()
    
        # Make normalizer raise an error
        mock_model.normalizer = MagicMock(side_effect=RuntimeError("Audio processing failed"))
    
        result = wrapper.transcribe(dummy_bytes, 16000)
    
        # Verify error handling works
        self.assertTrue(result.startswith("[ERROR]"))
        self.assertIn("Audio processing failed", result)
    
    @patch('SpeechBrainWrapper.SpeechBrain._SpeechBrain__model')
    def test_transcribe_handles_Exception(self, mock_model):
        wrapper = SpeechBrain()
        dummy_bytes = np.array([0.0], dtype=np.float32).tobytes()
        
        # Make transcribe_batch raise a generic exception
        mock_model.normalizer = MagicMock(return_value=torch.tensor([[0.0]]))
        mock_model.transcribe_batch = MagicMock(
            side_effect=Exception("Something went wrong with transcription")
        )
        
        result = wrapper.transcribe(dummy_bytes, 16000)
        
        # Verify the exception was caught and formatted correctly
        self.assertTrue(result.startswith("[ERROR] Transcription failed:"))
        self.assertIn("Something went wrong with transcription", result)
        
        
        
    @patch('SpeechBrainWrapper.SpeechBrain._SpeechBrain__model')
    def test_bytes_to_tensor(self, mock_model):
        #convert bytes to torch.Tensor
        
        wrapper = SpeechBrain()
        dummy_array = [0.0, 0.5, -0.5, 1.0, -1.0]
        dummy_bytes = np.array(dummy_array, dtype=np.float32).tobytes()
        dummy_sample_rate = 16000
        
        
        answer = torch.tensor(dummy_array, dtype=torch.float32).unsqueeze(0)
        result = wrapper._SpeechBrain__bytes_to_tensor(dummy_bytes)
        
        self.assertTrue(torch.equal(result, answer))
        