const user_value = document.getElementById("user_input");
const button = document.getElementById("click_me");
const result = document.getElementById("result");
const computer = document.getElementById("computer");
const points = document.getElementById("points");

let trial = 0;
let user_point = 0;
let computer_point = 0;

button.addEventListener("click", () => {
  trial += 1;
  const user_input = user_value.value;
  user_value.value = "";
  console.log("user_input: ", user_input);

  const element = ["rock", "paper", "scissor"];
  const number = Math.floor(Math.random() * 3);

  const computer_pick = element[number];
  console.log("computer_input: ", computer_pick);

  computer.innerText = `USER: ${user_input} || COMPUTER: ${computer_pick}`;

  if (computer_pick === user_input) {
    console.log("Draw");
    result.innerText = "Draw";
  } else if (
    (computer_pick === "rock" && user_input === "paper") ||
    (computer_pick === "paper" && user_input === "scissor") ||
    (computer_pick === "scissor" && user_input === "rock")
  ) {
    console.log("user won");
    result.innerText = "user won";
    user_point += 1;
  } else if (
    (computer_pick === "rock" && user_input === "scissor") ||
    (computer_pick === "paper" && user_input === "rock") ||
    (computer_pick === "scissor" && user_input === "paper")
  ) {
    console.log("computer won");
    result.innerText = "computer won";
    computer_point += 1;
  }

  points.innerHTML = `USER POINT: ${user_point} || COMPUTER POINT: ${computer_point} `;

  if (trial == 5) {
    button.disabled = true;
    user_value.disabled = true;
    setTimeout(() => {
      if (computer_point > user_point) {
        alert("COMPUTER WON");
      } else if (computer_point < user_point) {
        alert("USER WON");
      } else {
        alert("DRAW");
      }
    }, 2000);
    console.log(
      `USER POINT: ${user_point} || COMPUTER POINT: ${computer_point}`
    );
  }
});
