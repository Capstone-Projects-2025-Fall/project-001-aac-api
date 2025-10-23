import { vi } from "vitest";

export const mockCommandConverter = {
    processTranscription: vi.fn(),
}
export const CommandConverter = {
    getInstance: vi.fn(() => mockCommandConverter),
    
}