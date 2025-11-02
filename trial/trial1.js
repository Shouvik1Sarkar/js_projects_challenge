const question = document.getElementById("question");
const options = document.getElementsByClassName("options");
const optA = document.getElementById("a");
const optB = document.getElementById("b");
const optC = document.getElementById("c");
const optD = document.getElementById("d");
// const next = document.getElementById("next");
const play = document.getElementById("play");
const quiz = [
  {
    q: "What is the name of your country?",
    opt: {
      a: "India",
      b: "USA",
      c: "Canada",
      d: "Japan",
    },
    ans: "a",
  },
  {
    q: "What is the capital?",
    opt: {
      a: "Delhi",
      b: "Washington",
      c: "Tokyo",
      d: "Morocco",
    },
    ans: "a",
  },
];
// const answer = "a";

// for (let i = 0; i < quiz.length; i++) {
//   console.log(quiz[0].q);
//   console.log(quiz[0].opt);
// }

// let num = 0;

// while (num != 2) {

//   num++;
// }

// question.innerHTML = "1. " + quiz[0].q;
// optA.innerHTML = `a) ${quiz[0].opt.a}`;
// optB.innerHTML = `a) ${quiz[0].opt.b}`;
// optC.innerHTML = `a) ${quiz[0].opt.c}`;
// optD.innerHTML = `a) ${quiz[0].opt.d}`;

// for (let i = 0; i < options.length; i++) {
//   console.log(options[i]);
//   options[i].addEventListener("click", () => {
//     console.log("clicked", options[i].id);
//     if (options[i].id == quiz[0].ans) {
//       console.log("right");
//     } else {
//       console.log("wrong");
//     }
//   });
// }
let i = 0;
// while (i < quiz.length) {
play.addEventListener("click", () => {
  play.innerHTML = "Next";
  question.innerHTML = "1. " + quiz[i].q;
  optA.innerHTML = `a) ${quiz[i].opt.a}`;
  optB.innerHTML = `a) ${quiz[i].opt.b}`;
  optC.innerHTML = `a) ${quiz[i].opt.c}`;
  optD.innerHTML = `a) ${quiz[i].opt.d}`;
  for (let j = 0; j < options.length; j++) {
    console.log(options[j]);
    options[j].addEventListener("click", () => {
      console.log("clicked", options[j].id);
      if (options[j].id == quiz[j].ans) {
        console.log("right");
        alert("right");
      } else {
        console.log("wrong");
        alert("wrong");
      }
    });
  }
  // next.addEventListener("click", () => {
  i += 1;
  // });
});
// }
