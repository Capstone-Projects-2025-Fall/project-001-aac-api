from typing import Optional, List, Dict
from fastapi import APIRouter, HTTPException, Body, Header
from pydantic import BaseModel
from backend.SpeechBrainWrapper import SpeechBrain

router = APIRouter(
    prefix='/transcription',
    tags=["transcription"]
)

speech_brain = SpeechBrain()

# Response model for transcription results
class TranscriptionResponse(BaseModel):
    success: bool
    transcription: str
    timestamp: Optional[float] = None
    error: Optional[str] = None

# [Response model for multispeaker transcription]
class SeparatedTranscriptionResponse(BaseModel):
    success: bool
    speakers: List[Dict[str, str]]
    timestamp: Optional[float] = None
    error: Optional[str] = None


@router.post("/", response_model=TranscriptionResponse)
async def transcribe_single_speaker(
        audio_data: bytes = Body(...),
        sample_rate: int = Header(16000, alias="X-Sample-Rate")
):

    try:
        if len(audio_data) == 0:
            raise HTTPException(status_code=400, detail="Empty audio data received")

        transcription = speech_brain.transcribe_raw_bytes(audio_data, sample_rate)

        return TranscriptionResponse(
            success=True,
            transcription=transcription,
            timestamp=None
        )

    except Exception as e:
        return TranscriptionResponse(
            success=False,
            transcription="",
            error=str(e)
        )

@router.post("/separation", response_model=SeparatedTranscriptionResponse)
async def transcribe_multiple_speakers(
        audio_data: bytes = Body(...),
        sample_rate: int = Header(16000, alias="X-Sample-Rate"),
):
    try:
        if len(audio_data) == 0:
            raise HTTPException(status_code=400, detail="Empty audio data received")

        transcriptions = speech_brain.separate_then_transcribe(audio_data, sample_rate)

        speaker_results = []
        for idx, text in enumerate(transcriptions):
            speaker_results.append({
                "speaker_id": str(idx + 1),
                "text": text
            })


        return SeparatedTranscriptionResponse(
            success=True,
            speakers=speaker_results,
            timestamp=None
        )

    except Exception as e:
        return SeparatedTranscriptionResponse(
            success=False,
            speakers=[],
            error=str(e)
        )