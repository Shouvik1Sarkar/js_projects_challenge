const user_value = document.getElementById("user_input");

const button = document.getElementById("click_me");

const score_board = document.getElementById("points");

const game_elements = document.getElementsByClassName("element");

const computer_elements = ["rock", "paper", "scissor"];

const winner = document.getElementById("winner");

const user_hands = document.getElementById("user_hand");
const computer_hands = document.getElementById("computer_hand");

let computer_point = 0;
let user_point = 0;

let trial = 0;

for (let i = 0; i < game_elements.length; i++) {
  game_elements[i].addEventListener("click", () => {
    const index = Math.floor(Math.random() * 3);

    const computer_pick = computer_elements[index];
    console.log("computer_pick: ", computer_pick);

    const user_pick = game_elements[i].id;
    console.log("User_Pick: ", user_pick);

    trial += 1;
    let user_hand_emoji;
    let computer_hand_emoji;
    if (user_pick == "rock") {
      user_hand_emoji = "🪨";
    } else if (user_pick == "paper") {
      user_hand_emoji = "📃";
    } else {
      user_hand_emoji = "✂️";
    }
    if (computer_pick == "rock") {
      computer_hand_emoji = "🪨";
    } else if (computer_pick == "paper") {
      computer_hand_emoji = "📃";
    } else {
      computer_hand_emoji = "✂️";
    }

    user_hands.innerHTML = `USER: ${user_hand_emoji}`;
    computer_hands.innerHTML = `COMPUTER: ${computer_hand_emoji}`;

    if (user_pick == computer_pick) {
      winner.innerHTML = "NO POINTS";
    } else if (
      (user_pick == "rock" && computer_pick == "scissor") ||
      (user_pick == "paper" && computer_pick == "rock") ||
      (user_pick == "scissor" && computer_pick == "paper")
    ) {
      user_point += 1;
      //   alert(`user won `);
      winner.innerHTML = "USER GOT A POINT";
    } else {
      computer_point += 1;
      winner.innerHTML = "Computer GOT A POINT";
      //   alert("Computer won");
    }
    setTimeout(() => {
      user_hands.innerHTML = `USER: `;
      computer_hands.innerHTML = `COMPUTER: `;
    }, 2000);
    if (trial == 5) {
      setTimeout(() => {
        alert("game over");
      }, 1000);
    }

    score_board.innerText = `USER: ${user_point} COMPUTER: ${computer_point}`;
  });
}
