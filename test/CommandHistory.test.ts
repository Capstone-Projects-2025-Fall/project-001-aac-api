import {CommandHistory} from "../src/CommandHistory";
import {describe, it,  beforeEach, expect} from "vitest";

describe('CommandHistory Test', () => {
    let history: CommandHistory;

    beforeEach(() => {
        // @ts-expect-error - accessing private static property for testing
        CommandHistory['instance'] = undefined;

        history = CommandHistory.getInstance();
        history.toggle(true);
        history.clear();
    });


    it('should only ever be once instance', () => {
        const instance1 = CommandHistory.getInstance();
        const instance2 = CommandHistory.getInstance()

        expect(instance1).toBe(instance2);
    });

    describe('toggle', () => {
        it('should add if toggle is true', () => {
            history.add('Jump');
            expect(history.getSize()).toBe(1);
        });

        it('should not add if toggle is false', () => {
            history.toggle(false);
            history.add('Jump');
            expect(history.getSize()).toBe(0);
        });
    });

    describe('getAll', () => {
        it('should return all commands', () => {
            history.add('cmd1');
            history.add('cmd2');
            history.add('cmd3');
            const result = history.getAll()
            expect(result).toEqual(['cmd1','cmd2','cmd3']);
        });
    })

    describe('getSlice', () => {
        beforeEach(() => {
            history.add('cmd0');
            history.add('cmd1');
            history.add('cmd2');
            history.add('cmd3');
            history.add('cmd4');

        });

        it('should return slice from start to end', () => {
            const result = history.getSlice(1, 3);

            expect(result).toEqual(['cmd1', 'cmd2']);
        });

        it('should return slice from start to end of array when end not provided', () => {
            const result = history.getSlice(2);

            // Should return from index 2 to end
            expect(result).toEqual(['cmd2', 'cmd3', 'cmd4']);
        });

        it('should return entire array when start is 0 and no end', () => {
            const result = history.getSlice(0);

            expect(result).toEqual(['cmd0', 'cmd1', 'cmd2', 'cmd3', 'cmd4']);
        });

        it('should return empty array when start >= end', () => {
            const result = history.getSlice(3, 1);

            expect(result).toEqual([]);
        });

        it('should return empty array when start equals end', () => {
            const result = history.getSlice(2, 2);

            expect(result).toEqual([]);
        });
    });

    describe('clear', () => {
        it('should clear empty history without error', () => {
            history.clear();
            expect(history.getSize()).toBe(0);
        });

        it('should clear all commands', () => {
            history.add('cmd1');
            history.add('cmd2');
            history.add('cmd3');

            expect(history.getSize()).toBe(3);

            history.clear();

            expect(history.getSize()).toBe(0);
            expect(history.getAll()).toEqual([]);
        });
    });


    });
