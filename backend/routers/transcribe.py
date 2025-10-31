from typing import Optional, List, Dict

from fastapi import APIRouter, File, UploadFile, HTTPException
from pydantic import BaseModel
from starlette.datastructures import UploadFile

router = APIRouter(
    prefix='/transcription',
    tags=["transcription"]
)

# these are response models that will be sent back to the user
# that the frontend will parse as JSON

# In these pydantic models, we are just adding strong typing, the = means default if they don't pass it in
# also, passing in BaseModel is just required by pydantic so don't let that confuse u

# Response model for transcription results
class TranscriptionResponse(BaseModel):
    success: bool
    transcription: str
    timestamp: Optional[float] = None
    error: Optional[str] = None

# Hi Mike,
# so im not to sure how you want to return the data to the frontend of the users speaking.
# just want to let u know that this does response model does not need to be followed to a tee.
# if u want feel free to change the way it returns this data to the frontend. Right now I have
# so it returns a List of dictionaries. My thought was [{"speaker_id":"1", "text": "what they said..."},{}]
# then we would be able to separate who said what by the speaker id associated with the text. Like I said
# implement however you see necessary because I have no idea what that will actually look like!
# [Response model for multispeaker transcription]
class SeparatedTranscriptionResponse(BaseModel):
    success: bool
    speakers: List[Dict[str, str]]
    timestamp: Optional[float] = None
    error: Optional[str] = None


async def transcribe_audio(wav_data: bytes) -> str:
    """
    Mike will implement this, you can change how this looks, just needs these so my endpoint code doesn't
    reference non defined methods

    :param wav_data: wav formatted audio bytes from convert_float32_to_wav
    :return:
    """
    pass

async def separate_and_transcribe(wav_data):
    """
    Mike will implement speechbrain speaker separation and transcription

    :param wav_data: wav formatted audio bytes
    :return:  List of dictionaries with speaker_id and transcribed text
        Example: [{"speaker_id": "1", "text": "Hello"}, {"speaker_id": "2", "text": "Hi"}]
    """
    pass



async def convert_float32_to_wav(audio_bytes: bytes, sample_rate: int) -> bytes:
    """
    tam will implement conversion from float32array bytes to wav format


    :param audio_bytes: raw bytes from float32array
    :param sample_rate: sample rate of the audio
    :return:  wav formatted audio bytes
    """
    pass


@router.get("/", response_model=TranscriptionResponse)
async def transcribe_single_speaker(
        audio: UploadFile = File(...),
        sample_rate: int = 16000
):
    """
    Transcribe audio from a single speaker without voice seperation
    Expects Float32Array audio data sent as a binary file because that seems to be the simplest way
    to send float32 through http request

    so args are
    audio: audio file (float32array as binary)
    sample_rate: Sample rate of the input audio

    returns a TranscriptionResponse which is modeled at the top of the file
    """
    try:
        audio_bytes = await audio.read()

        if len(audio_bytes) == 0:
            raise HTTPException(status_code=400, detail="Empty audio data received")

        wav_data = await convert_float32_to_wav(audio_bytes, sample_rate) # Tam will implement this

        transcription = await transcribe_audio(wav_data) # Mike will implement this

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

@router.get("/separation", response_model=SeparatedTranscriptionResponse)
async def transcribe_multiple_speakers(
        audio: UploadFile = File(...),
        sample_rate: int = 16000,
        num_speakers: Optional[int] = None # maybe we can have a option on the frontend to select num of expected speakers
):
    """
    Transcribe audio with speaker seperation using speechbrain

    sperates multiple speakers and transcribes each sepearalty
    Expects Float32Array audio data sent as a binary file because that seems to be the simplest way
    to send float32 through http request

    :param audio: audio file (float32array as binary)
    :param sample_rate: sample rate of the input audio default is set to 16000
    :param num_speakers: expected num of speakers (optional, possibly make it easier for us if we do this???)
    :return: separatedTranscription with transcriptions per speaker
    """
    try:
        audio_bytes = await audio.read()

        if len(audio_bytes) == 0:
            raise HTTPException(status_code=400, detail="Empty audio data received")

        wav_data = await convert_float32_to_wav(audio_bytes, sample_rate)

        speaker_transcriptions = await separate_and_transcribe(wav_data)

        return SeparatedTranscriptionResponse(
            success=True,
            speakers=speaker_transcriptions,
            timestamp=None
        )

    except Exception as e:
        return SeparatedTranscriptionResponse(
            success=False,
            speakers=[],
            error=str(e)
        )

    return {"transcription two users":"this endpoint should be"
                                      "accessed when you want"
                                      "speech separation"}