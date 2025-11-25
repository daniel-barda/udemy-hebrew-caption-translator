
// UDEMY PERFECT FONT & OPACITY MATCH

let settings = { rtl: true, fontSize: null, opacity: null };
let lastText = "";
const cache = {};

chrome.storage.sync.get(settings, s => settings = s);

function getOverlay() {

  let container =
    document.querySelector(".captions-display--captions-container--PqdGQ") ||
    document.querySelector('div[data-purpose="captions-display"]');

  if (!container) return null;

  let layer = document.getElementById("udemy-hebrew-overlay");
  if (!layer) {

    if (getComputedStyle(container).position === "static")
        container.style.position = "relative";

    layer = document.createElement("div");
    layer.id = "udemy-hebrew-overlay";
    layer.style.position = "relative";
    layer.style.display = "inline";
    layer.style.pointerEvents = "none";
    layer.style.marginInline = "0.5em";
    layer.style.marginBlockEnd = "1em";

    const inner = document.createElement("div");
    inner.id = "udemy-hebrew-overlay-inner";

    applyUdemyStyle(inner);

    layer.appendChild(inner);
    container.appendChild(layer);
  }

  return document.getElementById("udemy-hebrew-overlay-inner");
}

function applyUdemyStyle(inner) {

  inner.style.display = "inline";
  inner.style.maxWidth = "30em";

  inner.style.backgroundColor = "oklch(20.35% 0.0139 285.09deg)";
  inner.style.color = "oklch(100% 0 0deg)";
  inner.style.lineHeight = "1.4";
  inner.style.marginInline = "0.5em";
  inner.style.marginBlockEnd = "1em";
  inner.style.paddingBlock = "0.2rem";
  inner.style.paddingInline = "0.8rem";
  inner.style.whiteSpace = "pre-line";
  inner.style.unicodeBidi = "plaintext";
  inner.style.boxDecorationBreak = "clone";
  inner.style.webkitBoxDecorationBreak = "clone";
  inner.style.fontFamily = "sans-serif";
  inner.style.writingMode = "horizontal-tb";

  // MATCH EXACT UDEMY DEFAULTS
  inner.style.fontSize = settings.fontSize
      ? settings.fontSize + "px"
      : "1.6rem";

  inner.style.opacity = settings.opacity
      ? settings.opacity
      : 0.75;

  if (settings.rtl) {
    inner.style.direction = "rtl";
    inner.style.textAlign = "right";
  } else {
    inner.style.direction = "ltr";
    inner.style.textAlign = "left";
  }
}

function isHebrew(t) {
  return /[\u0590-\u05FF]/.test(t);
}

function getTechnicalTerms(text) {
  const re = /\b[A-Z0-9]{2,}\b/g;
  const out = [];
  let m;
  while ((m = re.exec(text)) !== null) out.push(m[0]);
  return out;
}

function protectAcronyms(text) {
  return text.replace(/\b([A-Z0-9]{2,})\b/g, "\u200E$1\u200E");
}

function mergeTechnicalTerms(original, translated) {
  const terms = getTechnicalTerms(original);
  let out = translated;
  for (const t of terms) {
    if (!out.includes(t)) out += " \u200E" + t + "\u200E";
  }
  return out;
}

function updateOverlayText(text) {
  const inner = getOverlay();
  if (!inner) return;
  inner.textContent = text;
  applyUdemyStyle(inner);
}

function pollTranscript() {
  const cue = document.querySelector('[data-purpose="transcript-cue-active"] [data-purpose="cue-text"]');
  if (!cue) return;

  const txt = cue.textContent.trim();
  if (!txt || txt === lastText) return;
  lastText = txt;

  if (isHebrew(txt)) {
    updateOverlayText(txt);
    return;
  }

  if (cache[txt]) {
    updateOverlayText(cache[txt]);
    return;
  }

  chrome.runtime.sendMessage({ type: "TRANSLATE", text: txt }, res => {
    let translated = res?.translated || txt;
    translated = mergeTechnicalTerms(txt, translated);
    translated = protectAcronyms(translated);
    cache[txt] = translated;

    const current = document.querySelector('[data-purpose="transcript-cue-active"] [data-purpose="cue-text"]');
    if (current && current.textContent.trim() === txt) {
      updateOverlayText(translated);
    }
  });
}

setInterval(pollTranscript, 300);
