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
let direction = 1; // 1 = UP, -1 = DOWN
let running = false;
let interval = null;
let showBlockDiagram = false;

const sampleCode = `ORG 0000H
LJMP START

ORG 0003H
LJMP INT0_ISR

SEG_TAB: DB 0C0H,0F9H,0A4H,0B0H,099H,092H,082H,0F8H,080H,090H

START:
    MOV P1,#0FFH
    MOV R0,#00H
    MOV R2,#01H
    SETB IT0
    MOV IE,#10000001B

MAIN_LOOP:
    ACALL DISP_UPDATE
    MOV A,R2
    CJNE A,#01H,COUNT_DOWN
    INC R0
    CJNE R0,#0AH,CONT_LOOP
    MOV R0,#00H
    SJMP CONT_LOOP

COUNT_DOWN:
    CJNE R0,#00H,DECIT
    MOV R0,#09H
    SJMP CONT_LOOP
DECIT:
    DEC R0

CONT_LOOP:
    SJMP MAIN_LOOP

DISP_UPDATE:
    MOV DPTR,#SEG_TAB
    MOV A,R0
    MOVC A,@A+DPTR
    MOV P1,A
    RET

INT0_ISR:
    MOV A,R2
    CPL A
    MOV R2,A
    RETI

END`;

// Elements
const codeEditor = document.getElementById("codeEditor");
const validationMessage = document.getElementById("validationMessage");
const sevenSegDisplay = document.getElementById("sevenSegDisplay");

const startBtn = document.getElementById("startBtn");
const intBtn = document.getElementById("intBtn");
const resetBtn = document.getElementById("resetBtn");
const directionText = document.getElementById("directionText");

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

codeEditor.addEventListener("input", () => {
  if (codeEditor.value.trim().length > 0) {
    downloadBtn.className = "btn-blue";
  } else {
    downloadBtn.className = "btn-disabled";
  }
});

// --- Seven Segment Functions ---
function bitsToArray7(bits) {
  return [0, 1, 2, 3, 4, 5, 6].map((i) => ((bits >> i) & 1) === 1);
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
    "12,47 18,41 42,41 48,47 42,53 18,53",
  ];
  let svg = `<svg viewBox="0 0 60 100" class="w-24 h-36">`;
  for (let i = 0; i < 7; i++) {
    svg += `<polygon points="${polygons[i]}" style="fill:${
      on[i] ? "#dc2626" : "#450a0a"
    }" />`;
  }
  svg += `</svg>`;
  sevenSegDisplay.innerHTML = svg;
}

// --- Code Validation ---
function normalize(str) {
  return (str || "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .map((l) =>
      l.replace(/\s*,\s*/g, ",").replace(/\s+/g, " ").toUpperCase()
    )
    .join("\n");
}

function checkUserCode() {
  const expected = normalize(sampleCode);
  const entered = normalize(codeEditor.value);
  if (entered === expected) {
    codeValidated = true;
    validationMessage.textContent =
      "Code validated successfully. Use Start Count to simulate.";
    startBtn.disabled = false;
    startBtn.className = "btn-blue";
    alert("Your code is correct! You can proceed.");
  } else {
    codeValidated = false;
    validationMessage.textContent = "";
    startBtn.disabled = true;
    startBtn.className = "btn-disabled";
    alert("Your code is incorrect! Please check again.");
  }
}

// --- Simulation ---
function startCounting() {
  if (!codeValidated || running) return;
  running = true;
  intBtn.disabled = false;
  intBtn.className = "btn-blue";
  interval = setInterval(() => {
    count += direction;
    if (count > 9) count = 0;
    if (count < 0) count = 9;
    renderSevenSeg();
  }, 500);
}

function toggleDirection() {
  if (!running) return;
  direction *= -1;
  directionText.textContent = direction === 1 ? "UP" : "DOWN";
  directionText.style.color = direction === 1 ? "green" : "red";
}

function resetAll() {
  count = 0;
  running = false;
  codeValidated = false;
  direction = 1;
  directionText.textContent = "UP";
  directionText.style.color = "green";
  codeEditor.value = "";
  validationMessage.textContent = "";
  clearInterval(interval);
  interval = null;
  startBtn.disabled = true;
  startBtn.className = "btn-disabled";
  intBtn.disabled = true;
  intBtn.className = "btn-disabled";
  downloadBtn.className = "btn-disabled";
  renderSevenSeg();
}

// --- Event Listeners ---
startBtn.addEventListener("click", startCounting);
intBtn.addEventListener("click", toggleDirection);
resetBtn.addEventListener("click", resetAll);

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

// Sample code popup
sampleBtn.addEventListener("click", () => {
  samplePopup.classList.remove("hidden");
  sampleCodeBlock.textContent = sampleCode;
});
useCodeBtn.addEventListener("click", () => {
  codeEditor.value = sampleCode;
  samplePopup.classList.add("hidden");
});
closeSampleBtn.addEventListener("click", () =>
  samplePopup.classList.add("hidden")
);

// Instructions popup
instructionsBtn.addEventListener("click", () =>
  instructionsPopup.classList.remove("hidden")
);
closeInstructionsBtn.addEventListener("click", () =>
  instructionsPopup.classList.add("hidden")
);

// Circuit popup
circuitBtn.addEventListener("click", () => {
  circuitPopup.classList.remove("hidden");
  showBlockDiagram = false;
  renderCircuitImage();
});
closeCircuitBtn.addEventListener("click", () =>
  circuitPopup.classList.add("hidden")
);
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
  toggleDiagramBtn.textContent = showBlockDiagram
    ? "View Logic Diagram"
    : "View Block Diagram";
}

// --- Initial render ---
renderSevenSeg();
