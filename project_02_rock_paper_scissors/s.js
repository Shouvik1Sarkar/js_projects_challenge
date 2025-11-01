const user_elements = document.getElementsByClassName("element");
const computer = document.getElementById("computer");
const result = document.getElementById("result");

const options = ["rock", "paper", "scissor"];

for (let i = 0; i < user_elements.length; i++) {
  // attach listener to each emoji, not to document
  console.log("----", user_elements[i]);
  user_elements[i].addEventListener("click", () => {
    const user_pick = user_elements[i].id;

    // generate computer choice
    const computer_pick = options[Math.floor(Math.random() * 3)];

    console.log(`USER: ${user_pick} || COMPUTER: ${computer_pick}`);

    computer.innerText = `COMPUTER: ${computer_pick} vs USER: ${user_pick}`;

    // determine result
    if (computer_pick === user_pick) {
      result.innerText = "Draw 😐";
    } else if (
      (computer_pick === "rock" && user_pick === "paper") ||
      (computer_pick === "paper" && user_pick === "scissor") ||
      (computer_pick === "scissor" && user_pick === "rock")
    ) {
      result.innerText = "You Win 🎉";
    } else {
      result.innerText = "Computer Wins 💻";
    }
  });
}
