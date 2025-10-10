import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import { showHistoryPopup } from "../src/showHistoryPopup";
import { CommandHistory } from "../src/CommandHistory";


function getOverlay(): HTMLElement | null {
  return document.getElementById("aac-history-overlay");
}
function getListItems(): string[] {
  const ul = getOverlay()!.querySelector("ul")!;
  return Array.from(ul.querySelectorAll("li")).map(li => li.textContent || "");
}
function getButton(label: string): HTMLButtonElement {
  const btn = Array.from(getOverlay()!.querySelectorAll("button"))
    .find(b => b.textContent?.trim() === label) as HTMLButtonElement | undefined;
  if (!btn) throw new Error(`Button "${label}" not found`);
  return btn;
}

describe("showHistoryPopup (DOM)", () => {
  let history: CommandHistory;

  beforeEach(() => {
    
    document.body.innerHTML = "";
    vi.useFakeTimers();

    // reset the singleton for a clean slate
    // @ts-expect-error – test-only access to private static
    CommandHistory["instance"] = undefined;

    history = CommandHistory.getInstance();
    history.toggle(true);
    history.clear();
  });

  afterEach(() => {
   
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    document.body.innerHTML = "";
  });

  it("creates overlay once (idempotent open)", () => {
    showHistoryPopup();
    showHistoryPopup(); 
    const overlays = document.querySelectorAll("#aac-history-overlay");
    expect(overlays.length).toBe(1);
  });

  it("renders existing commands on first paint", () => {
    history.add("Jump");
    history.add("Shield");
    showHistoryPopup();

    expect(getListItems()).toEqual(["Jump", "Shield"]);
  });

  it("auto-refreshes every second when new commands are added", () => {
    showHistoryPopup();                    
    expect(getListItems()).toEqual([]);

    history.add("StartGame");             
    vi.advanceTimersByTime(1000);         

    expect(getListItems()).toEqual(["StartGame"]);
  });

  it("Clear button empties history and UI", () => {
    history.add("Jump");
    history.add("MoveLeft");
    showHistoryPopup();

    expect(getListItems()).toEqual(["Jump", "MoveLeft"]);

    const clearBtn = getButton("Clear");
    clearBtn.click();

    expect(history.getSize()).toBe(0);
    expect(getListItems()).toEqual([]);
  });

  it("Go to latest jumps to tail after new commands arrive", () => {
    
    for (let i = 0; i < 5; i++) history.add(`cmd${i}`);
    showHistoryPopup();

    history.add("NEW1");
    history.add("NEW2");

   
    expect(getListItems().at(-1)).toBe("cmd4");

    
    const goLatest = getButton("Go to latest");
    goLatest.click();

    expect(getListItems().slice(-2)).toEqual(["NEW1", "NEW2"]);
  });

  it("Close removes overlay and clears interval", () => {
    const clearSpy = vi.spyOn(window, "clearInterval");
    showHistoryPopup();

    const closeBtn = getButton("Close");
    closeBtn.click();

    expect(getOverlay()).toBeNull();
    expect(clearSpy).toHaveBeenCalledTimes(1);
  });
});
