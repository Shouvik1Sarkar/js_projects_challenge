import { quiz } from "./quiz_data.js";
const question = document.getElementById("question");
const options = document.getElementsByClassName("options");
console.log(options);
const score_board = document.getElementById("score");

// options.classList.add("inactive");

const optA = document.getElementById("a");
const optB = document.getElementById("b");
const optC = document.getElementById("c");
const optD = document.getElementById("d");
// const next = document.getElementById("next");
const play = document.getElementById("play");
let right_answer;

const total = quiz.length;
score_board.innerHTML = `Score:  /${total}`;

let i = 0;
let score = 0;
// while (i < quiz.length) {
// play.addEventListener("click", () => {
// for (let x = 0; x < options.length; x++) {
//   options[x].classList.add("invisible");
// }
function loadQuestion(i) {
  for (let x = 0; x < options.length; x++) {
    options[x].classList.remove("inactive", "bgwrong", "bgright");
  }
  play.innerHTML = "Next";
  question.innerHTML = `${i + 1}) ` + quiz[i].q;
  optA.innerHTML = `a) ${quiz[i].opt.a}`;
  optB.innerHTML = `b) ${quiz[i].opt.b}`;
  optC.innerHTML = `c) ${quiz[i].opt.c}`;
  optD.innerHTML = `d) ${quiz[i].opt.d}`;
}

for (let j = 0; j < options.length; j++) {
  options[j].addEventListener("click", () => {
    const selected = options[j].id;
    const correct = quiz[i].ans;

    // Disable all options once answered
    for (let x = 0; x < options.length; x++) {
      options[x].classList.remove("inactive");
    }

    if (selected == correct) {
      score++;
      const a = options[j];
      a.classList.add("bgright");
      console.log("right");
      // alert("right");
      score_board.innerHTML = `Score: ${score}/${total}`;
    } else {
      options[j].classList.add("bgwrong");
      document.getElementById(correct).classList.add("bgright");
      // console.log("---", right_answer);
      console.log("wrong");
      // alert("wrong");
    }
  });
}
play.addEventListener("click", () => {
  // for (let x = 0; x < options.length; x++) {
  //   options[x].classList.remove("bgwrong");
  //   options[x].classList.remove("bgright");
  // }
  i += 1;
  if (i < quiz.length) {
    loadQuestion(i);
  } else {
    question.innerHTML = "Comgratulations! You completed the QUIZ🎉";

    for (let x = 0; x < options.length; x++) {
      options[x].classList.add("invisible");
    }
    i = 0;
  }
});

loadQuestion(i);
