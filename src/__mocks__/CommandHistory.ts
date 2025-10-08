import { vi } from "vitest";

export const mockCommandHistory = {
    add: vi.fn(),
}

export const CommandHistory = {
    getInstance: vi.fn(() => mockCommandHistory),
};