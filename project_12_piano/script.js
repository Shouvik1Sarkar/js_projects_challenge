const keys = document.querySelectorAll(".key");

const notes = {
  A: new Audio("./notes/A2.wav"),
  "A#": new Audio("./notes/Asharp2.wav"),
  B: new Audio("./notes/B2.wav"),
  C: new Audio("./notes/C2.wav"),
  "C#": new Audio("./notes/Csharp2.wav"),
  D: new Audio("./notes/D2.wav"),
  "D#": new Audio("./notes/Dsharp2.wav"),
  E: new Audio("./notes/E2.wav"),
  F: new Audio("./notes/F2.wav"),
  "F#": new Audio("./notes/Fsharp2.wav"),
  G: new Audio("./notes/G2.wav"),
  "G#": new Audio("./notes/Gsharp2.wav"),
  C2: new Audio("./notes/C3.wav"),
};

keys.forEach((key) => {
  key.addEventListener("click", () => {
    const note_id = key.id;
    const note = notes[note_id];
    note.currentTime = 0;
    note.play();
  });
});
