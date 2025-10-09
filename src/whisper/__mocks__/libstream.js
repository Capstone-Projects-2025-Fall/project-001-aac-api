import { vi } from "vitest";

export const mockWhisperInstance = {

    FS_createPath:vi.fn(),
    FS_createDataFile: vi.fn(),
    init:vi.fn(),
    set_audio: vi.fn().mockReturnValue(1),
    get_transcribed: vi.fn().mockReturnValue("mock transcript"),
    get_status: vi.fn().mockReturnValue("ready"),
};

const createWhisperModule = vi.fn(async () => mockWhisperInstance);

export default createWhisperModule;
export {mockWhisperInstance as WhisperModule};

// export the **value** explicitly for tests
export const WhisperModuleInstance = mockWhisperInstance;