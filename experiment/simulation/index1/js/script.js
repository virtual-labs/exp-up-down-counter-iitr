const SEGMENTS_CC = {
  0: 0b00111111,
  1: 0b00000110,
  2: 0b01011011,
  3: 0b01001111,
  4: 0b01100110,
  5: 0b01101101,
  6: 0b01111101,
  7: 0b00000111,
  8: 0b01111111,
  9: 0b01101111,
};

let count = 0;
let codeValidated = false;
let upActive = false;
let downActive = false;
let interval = null;
let showBlockDiagram = false;

const sampleCode = `ORG 0000H
LJMP START

SEG_TAB: DB 0C0H,0F9H,0A4H,0B0H,099H
         DB 092H,082H,0F8H,080H,090H

START:
    MOV R0,#00H

MAIN_LOOP:
    JNB P2.0, CHECK_DOWN
    SJMP CHECK_DOWN2

CHECK_DOWN:
    JNB P2.1, HOLD
    SJMP UP_ACTION

CHECK_DOWN2:
    JNB P2.1, DOWN_ACTION
    SJMP DISPLAY

HOLD:
    SJMP DISPLAY

UP_ACTION:
    INC R0
    CJNE R0,#0AH, SHOW
    MOV R0,#00H
SHOW:
    ACALL DISP_UPDATE
    SJMP MAIN_LOOP

DOWN_ACTION:
    CJNE R0,#00H, DECIT
    MOV R0,#09H
    SJMP SHOW
DECIT:
    DEC R0
    SJMP SHOW

DISPLAY:
    MOV DPTR,#SEG_TAB
    MOV A,R0
    MOVC A,@A+DPTR
    MOV P1,A
    SJMP MAIN_LOOP

DISP_UPDATE:
    MOV DPTR,#SEG_TAB
    MOV A,R0
    MOVC A,@A+DPTR
    MOV P1,A
    RET

END`;

// Elements
const codeEditor = document.getElementById("codeEditor");
const validationMessage = document.getElementById("validationMessage");
const sevenSegDisplay = document.getElementById("sevenSegDisplay");
const upBtn = document.getElementById("upBtn");
const downBtn = document.getElementById("downBtn");
const resetBtn = document.getElementById("resetBtn");

// Popups
const samplePopup = document.getElementById("samplePopup");
const sampleCodeBlock = document.getElementById("sampleCodeBlock");
const useCodeBtn = document.getElementById("useCodeBtn");
const closeSampleBtn = document.getElementById("closeSampleBtn");

const circuitPopup = document.getElementById("circuitPopup");
const closeCircuitBtn = document.getElementById("closeCircuitBtn");
const toggleDiagramBtn = document.getElementById("toggleDiagramBtn");
const circuitImageContainer = document.getElementById("circuitImageContainer");

const instructionsPopup = document.getElementById("instructionsPopup");
const closeInstructionsBtn = document.getElementById("closeInstructionsBtn");

const instructionsBtn = document.getElementById("instructionsBtn");
const circuitBtn = document.getElementById("circuitBtn");
const sampleBtn = document.getElementById("sampleBtn");
const checkBtn = document.getElementById("checkBtn");
const downloadBtn = document.getElementById("downloadBtn");

// Helpers

codeEditor.addEventListener("input", () => {
  if (codeEditor.value.trim().length > 0) {
    downloadBtn.className = "btn-blue";
  } else {
    downloadBtn.className = "btn-disabled";
  }
});

function bitsToArray7(bits) {
  return [0, 1, 2, 3, 4, 5, 6].map(i => ((bits >> i) & 1) === 1);
}

function renderSevenSeg() {
  const bits = SEGMENTS_CC[count];
  const on = bitsToArray7(bits);
  const polygons = [
    "12,6 48,6 42,12 18,12",
    "48,6 54,12 54,42 48,48 42,42 42,12",
    "48,52 54,58 54,88 48,94 42,88 42,58",
    "12,88 48,88 42,94 18,94",
    "6,52 12,58 12,88 6,94 0,88 0,58",
    "6,6 12,12 12,42 6,48 0,42 0,12",
    "12,47 18,41 42,41 48,47 42,53 18,53"
  ];

  let svg = `<svg viewBox="0 0 60 100" class="w-24 h-36">`;
  for (let i = 0; i < 7; i++) {
    svg += `<polygon points="${polygons[i]}" style="fill:${on[i]?'#dc2626':'#450a0a'}" />`;
  }
  svg += `</svg>`;
  sevenSegDisplay.innerHTML = svg;
}

// Code validation
function normalize(str) {
  return (str || "")
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.length > 0)
    .map(l => l.replace(/\s*,\s*/g, ",").replace(/\s+/g, " ").toUpperCase())
    .join("\n");
}

function checkUserCode() {
  const expected = normalize(sampleCode);
  const entered = normalize(codeEditor.value);
  if (entered === expected) {
    codeValidated = true;
    validationMessage.textContent = "Code validated successfully. Use UP/DOWN to simulate.";
    upBtn.disabled = false;
    downBtn.disabled = false;
    upBtn.className = "btn-blue";
    downBtn.className = "btn-blue";
    alert("Your code is correct! You can proceed to next step.");
  } else {
    codeValidated = false;
    validationMessage.textContent = "";
    upBtn.disabled = true;
    downBtn.disabled = true;
    upBtn.className = "btn-disabled";
    downBtn.className = "btn-disabled";
    alert("Your code is incorrect! Please check again or view assembly code.");
  }
}

// Interval for counting
function startInterval() {
  if (!codeValidated) return;
  if ((upActive && downActive) || (!upActive && !downActive)) {
    clearInterval(interval);
    interval = null;
    return;
  }
  if (!interval) {
    interval = setInterval(() => {
      if (upActive) count = (count + 1) % 10;
      if (downActive) count = (count + 9) % 10;
      renderSevenSeg();
    }, 500);
  }
}

// UP button
upBtn.addEventListener("click", () => {
  upActive = !upActive;
  if (upActive) {
    upBtn.textContent = "UP (P2.0) (ON)";
    upBtn.className = "btn-green";  // green when ON
  } else {
    upBtn.textContent = "UP (P2.0)";
    upBtn.className = "btn-blue";   // back to normal
  }
  startInterval();
});

// DOWN button
downBtn.addEventListener("click", () => {
  downActive = !downActive;
  if (downActive) {
    downBtn.textContent = "DOWN (P2.1) (ON)";
    downBtn.className = "btn-green"; 
  } else {
    downBtn.textContent = "DOWN (P2.1)";
    downBtn.className = "btn-blue";
  }
  startInterval();
});

// RESET button
resetBtn.addEventListener("click", () => {
  count = 0;
  codeEditor.value = "";
  codeValidated = false;
  upActive = false;
  downActive = false;
  validationMessage.textContent = "";

  clearInterval(interval);
  interval = null;

  // Reset buttons to original state
  upBtn.disabled = true;
  downBtn.disabled = true;
  upBtn.className = "btn-disabled";
  downBtn.className = "btn-disabled";
  downloadBtn.className = "btn-disabled";
  upBtn.textContent = "UP (P2.0)";
  downBtn.textContent = "DOWN (P2.1)";

  renderSevenSeg();
});

checkBtn.addEventListener("click", checkUserCode);

downloadBtn.addEventListener("click", () => {
  if (!codeEditor.value) return;
  const blob = new Blob([codeEditor.value], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "up_down_counter.asm";
  a.click();
  URL.revokeObjectURL(url);
});

sampleBtn.addEventListener("click", () => {
  samplePopup.classList.remove("hidden");
  sampleCodeBlock.textContent = sampleCode;
});

useCodeBtn.addEventListener("click", () => {
  codeEditor.value = sampleCode;
  samplePopup.classList.add("hidden");
});

closeSampleBtn.addEventListener("click", () => samplePopup.classList.add("hidden"));

instructionsBtn.addEventListener("click", () => instructionsPopup.classList.remove("hidden"));
closeInstructionsBtn.addEventListener("click", () => instructionsPopup.classList.add("hidden"));

circuitBtn.addEventListener("click", () => {
  circuitPopup.classList.remove("hidden");
  showBlockDiagram = false;
  renderCircuitImage();
});

closeCircuitBtn.addEventListener("click", () => circuitPopup.classList.add("hidden"));
toggleDiagramBtn.addEventListener("click", () => {
  showBlockDiagram = !showBlockDiagram;
  renderCircuitImage();
});

function renderCircuitImage() {
  const logicImg = "images/dia1.png"; // logic diagram path
  const blockImg = "images/img3.png"; // block diagram path
  const imgSrc = showBlockDiagram ? blockImg : logicImg;
  const caption = showBlockDiagram ? "Block Diagram" : "Logic Diagram";
  circuitImageContainer.innerHTML = `<img src="${imgSrc}" alt="${caption}" style="max-width:100%;max-height:60vh;border-radius:8px;"><p style="text-align:center">Figure: ${caption}</p>`;
  toggleDiagramBtn.textContent = showBlockDiagram ? "View Logic Diagram" : "View Block Diagram";
}

// Initial render
renderSevenSeg();
