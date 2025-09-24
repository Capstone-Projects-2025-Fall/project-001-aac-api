import { commandHistory } from "./commandHistory";

/**
 * Opens a modal that shows the latest commands and auto-refreshes every second.
 * Storage is unbounded; UI renders only a window (latest PAGE items) for speed.
 */
export function showHistoryPopup() {
  if (document.getElementById("aac-history-overlay")) return;

  // --- overlay & dialog ---
  const overlay = document.createElement("div");
  overlay.id = "aac-history-overlay";
  overlay.style.position = "fixed";
  overlay.style.inset = "0";
  overlay.style.background = "rgba(0,0,0,0.6)";
  overlay.style.display = "flex";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.zIndex = "9999";

  const dialog = document.createElement("div");
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "true");
  dialog.setAttribute("aria-labelledby", "aac-history-title");
  Object.assign(dialog.style, {
    width: "min(680px, 92vw)",
    maxHeight: "82vh",
    background: "#fff",
    borderRadius: "14px",
    padding: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  } as CSSStyleDeclaration);

  const title = document.createElement("h2");
  title.id = "aac-history-title";
  title.textContent = "Command History";
  title.style.margin = "0 0 4px 0";
  title.style.fontSize = "1.3rem";

  const controls = document.createElement("div");
  Object.assign(controls.style, {
    display: "flex",
    gap: "8px",
    alignItems: "center",
    flexWrap: "wrap",
  } as CSSStyleDeclaration);

  const goLatestBtn = btn("Go to latest");
  const clearBtn = btn("Clear");
  const closeBtn = btn("Close");
  controls.append(goLatestBtn, clearBtn, closeBtn);

  const listWrap = document.createElement("div");
  Object.assign(listWrap.style, {
    flex: "1",
    overflow: "auto",
    background: "#f6f7fb",
    border: "1px solid #e4e6ef",
    borderRadius: "10px",
    padding: "8px",
  } as CSSStyleDeclaration);

  const list = document.createElement("ul");
  list.setAttribute("aria-live", "polite");
  Object.assign(list.style, {
    listStyle: "none",
    margin: "0",
    padding: "0",
    fontSize: "1.1rem",
  } as CSSStyleDeclaration);
  listWrap.appendChild(list);

  dialog.append(title, controls, listWrap);
  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  // --- windowed rendering state ---
  const PAGE = 200; // how many latest items to show in the UI
  let total = commandHistory.size();
  let windowEnd = total; // exclusive index
  let windowStart = Math.max(0, windowEnd - PAGE);
  let followTail = true; // always show the newest PAGE items

  function renderWindow() {
    const items = commandHistory.getSlice(windowStart, windowEnd);
    list.innerHTML = "";
    for (let i = 0; i < items.length; i++) {
      const li = document.createElement("li");
      li.textContent = items[i];
      Object.assign(li.style, {
        padding: "10px 12px",
        margin: "6px 0",
        borderRadius: "8px",
        background: "#fff",
        border: "1px solid #e4e6ef",
        boxShadow: "0 1px 0 rgba(0,0,0,0.03)",
      } as CSSStyleDeclaration);
      list.appendChild(li);
    }
    listWrap.scrollTop = listWrap.scrollHeight; // stick to bottom
  }

  // initial paint
  renderWindow();

  // --- AUTO-REFRESH EVERY SECOND ---
  const timerId = window.setInterval(() => {
    const newTotal = commandHistory.size();
    if (newTotal !== total) {
      total = newTotal;
      if (followTail) {
        windowEnd = total;
        windowStart = Math.max(0, windowEnd - PAGE);
      }
      renderWindow();
    }
  }, 1000);

  // --- controls ---
  goLatestBtn.onclick = () => {
    total = commandHistory.size();
    windowEnd = total;
    windowStart = Math.max(0, windowEnd - PAGE);
    followTail = true;
    renderWindow();
  };

  clearBtn.onclick = () => {
    commandHistory.clear();
    total = 0;
    windowStart = 0;
    windowEnd = 0;
    renderWindow();
  };

  function close() {
    clearInterval(timerId);   // important: stop the 1s refresh
    overlay.remove();
  }
  closeBtn.onclick = close;
  overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
  window.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); }, { once: true });

  function btn(label: string) {
    const b = document.createElement("button");
    b.textContent = label;
    Object.assign(b.style, {
      padding: "8px 12px",
      border: "1px solid #c9cbd6",
      borderRadius: "8px",
      background: "#ffffff",
      cursor: "pointer",
      fontSize: "0.95rem",
    } as CSSStyleDeclaration);
    return b;
  }
}
