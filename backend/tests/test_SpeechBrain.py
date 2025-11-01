import unittest
from unittest.mock import patch, MagicMock
from SpeechBrainWrapper import SpeechBrain
import numpy as np
import torch


class TestSpeechBrain(unittest.TestCase):
    
    
    @patch('SpeechBrainWrapper.SpeechBrain._SpeechBrain__model_transcribe')
    def test_transcribe_raw_bytes_success(self, mock_model_transcribe):
        
        wrapper = SpeechBrain()
        dummy_array = [0.0, 0.5, -0.5, 1.0, -1.0]
        dummy_bytes = np.array(dummy_array, dtype=np.float32).tobytes()
        dummy_sample_rate = 16000
        
        mock_model_transcribe.transcribe_batch = MagicMock(return_value=["Transcribed Data into words"])
        mock_model_transcribe.normalizer = MagicMock(return_value=torch.tensor(dummy_array, dtype=torch.float32).unsqueeze(0))
        
        
        result = wrapper.transcribe_raw_bytes(dummy_bytes, dummy_sample_rate)
        self.assertEqual(result, "Transcribed Data into words")
        
        mock_model_transcribe.normalizer.assert_called_once()
        mock_model_transcribe.transcribe_batch.assert_called_once()
        
        
    @patch('SpeechBrainWrapper.SpeechBrain._SpeechBrain__model_transcribe')
    def test_transcribe_raw_bytes_handles_runtime_error(self, mock_model_transcribe):
        wrapper = SpeechBrain()
        dummy_array = [0.0, 0.5, -0.5, 1.0, -1.0]
        dummy_bytes = np.array(dummy_array, dtype=np.float32).tobytes()
    
        # Make normalizer raise an error
        mock_model_transcribe.normalizer = MagicMock(side_effect=RuntimeError("Audio processing failed"))
    
        result = wrapper.transcribe_raw_bytes(dummy_bytes, 16000)
    
        # Verify error handling works
        self.assertTrue(result.startswith("[ERROR]"))
        self.assertIn("Audio processing failed", result)
    
    @patch('SpeechBrainWrapper.SpeechBrain._SpeechBrain__model_transcribe')
    def test_transcribe_raw_bytes_handles_Exception(self, mock_model_transcribe):
        wrapper = SpeechBrain()
        dummy_array = [0.0, 0.5, -0.5, 1.0, -1.0]
        dummy_bytes = np.array(dummy_array, dtype=np.float32).tobytes()
        
        # Make transcribe_batch raise a generic exception
        mock_model_transcribe.normalizer = MagicMock(return_value=torch.tensor([[0.0]]))
        mock_model_transcribe.transcribe_batch = MagicMock(
            side_effect=Exception("Something went wrong with transcription")
        )
        
        result = wrapper.transcribe_raw_bytes(dummy_bytes, 16000)
        
        # Verify the exception was caught and formatted correctly
        self.assertTrue(result.startswith("[ERROR] Transcription failed:"))
        self.assertIn("Something went wrong with transcription", result)
        
        
        
    @patch('SpeechBrainWrapper.SpeechBrain._SpeechBrain__model_transcribe')
    def test_bytes_to_tensor(self, mock_model_transcribe):
        #convert bytes to torch.Tensor
        
        wrapper = SpeechBrain()
        dummy_array = [0.0, 0.5, -0.5, 1.0, -1.0]
        dummy_bytes = np.array(dummy_array, dtype=np.float32).tobytes()
        dummy_sample_rate = 16000
        
        
        answer = torch.tensor(dummy_array, dtype=torch.float32).unsqueeze(0)
        result = wrapper._SpeechBrain__bytes_to_tensor(dummy_bytes)
        
        self.assertTrue(torch.equal(result, answer))
        
    
    @patch('SpeechBrainWrapper.SpeechBrain._SpeechBrain__model_sep')
    def test_separate_speech_success(self, mock_model_sep):
        
        wrapper = SpeechBrain()
        dummy_array = [0.0, 0.5, -0.5, 1.0, -1.0]
        dummy_bytes = np.array(dummy_array, dtype=np.float32).tobytes()
        dummy_sample_rate = 16000
        mock_output = torch.randn(1, 2, 160000) * 0.5
        mock_model_sep.separate_batch = MagicMock(return_value=mock_output)
        
        result = wrapper.separate_speech(dummy_bytes, dummy_sample_rate)
        
        self.assertTrue(torch.equal(result, mock_output))
        self.assertEqual(result.shape, mock_output.shape)
    
    @patch('SpeechBrainWrapper.SpeechBrain._SpeechBrain__model_sep')
    def test_transcribe_raw_bytes_handles_runtime_error(self, mock_model_sep):
        wrapper = SpeechBrain()
        dummy_array = [0.0, 0.5, -0.5, 1.0, -1.0]
        dummy_bytes = np.array(dummy_array, dtype=np.float32).tobytes()
    
        # Make normalizer raise an error
        mock_model_sep.separate_batch = MagicMock(
            side_effect=RuntimeError("Something went wrong with speech separation")
        )
    
        result = wrapper.separate_speech(dummy_bytes, 16000)
    
        # Verify error handling works
        self.assertTrue(result.startswith("[ERROR]"))
        self.assertIn("Speech Separation processing failed", result)
    
    @patch('SpeechBrainWrapper.SpeechBrain._SpeechBrain__model_sep')
    def test_separate_speech_handles_Exception(self, mock_model_sep):
        wrapper = SpeechBrain()
        dummy_array = [0.0, 0.5, -0.5, 1.0, -1.0]
        dummy_bytes = np.array(dummy_array, dtype=np.float32).tobytes()
        
        # Make transcribe_batch raise a generic exception
        mock_model_sep.separate_batch = MagicMock(
            side_effect=Exception("Something went wrong with transcription")
        )
        
        result = wrapper.separate_speech(dummy_bytes, 16000)
        
        # Verify the exception was caught and formatted correctly
        self.assertTrue(result.startswith("[ERROR] Separation failed:"))
        self.assertIn("Something went wrong with transcription", result)