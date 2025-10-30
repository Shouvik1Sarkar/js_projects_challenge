const number = Math.floor(Math.random() * 99 + 1);
console.log(number);
const user_input = document.getElementById("user_input");
console.log(user_input);
const click_button = document.getElementById("clickMe");
const attempt = document.getElementById("attempt_title");
const playagain = document.getElementById("playagain");
const score = document.getElementById("score");
const emojis = {
  happy:
    "https://i.pinimg.com/originals/0c/ea/69/0cea6998031efcb771759ebfb3500bc1.gif",
  thinking:
    "https://i.pinimg.com/originals/c5/a1/84/c5a18424f6e9abbf12efa591d6f93f36.gif",
  crying:
    "https://i.pinimg.com/originals/13/e3/80/13e3806986148ffd5d6e4f6bde54b02b.gif",
};

const main_content = document.getElementById("main_content");
let num = 0;
let trials = 5;
const attempt_remain = document.getElementById("attempt");
attempt_remain.innerText = trials;
const emoji = document.getElementById("emoji");

function playAgain() {
  window.location.reload();
  console.log("num", num);
}

click_button.addEventListener("click", () => {
  const guessed_number = parseInt(user_input.value);
  if (!guessed_number || guessed_number < 1 || guessed_number > 99) {
    alert("Please enter a number between 1 and 99");
    return;
  }
  const status = document.createElement("h3");
  main_content.append(status);
  user_input.value = "";
  trials -= 1;
  if (guessed_number === number) {
    emoji.src = emojis.happy;
    console.log("yay yay yay");
    click_button.disabled = true;

    score.innerText = trials + 1;
  } else if (guessed_number > number) {
    emoji.src = emojis.crying;

    console.log("Too Big");
    attempt_remain.innerText = trials;
    status.innerHTML = "Too Big. Try smaller number";

    setTimeout(() => {
      status.remove();
    }, 3000);

    num++;
    if (num < 5) {
      setTimeout(() => {
        emoji.src = emojis.thinking;
      }, 3000);
    }
  } else {
    console.log("Too low");
    status.innerHTML = "Too Low. Try Bigger number";
    setTimeout(() => {
      status.remove();
    }, 3000);
    emoji.src = emojis.crying;

    num++;
    attempt_remain.innerText = trials;
    if (num < 5) {
      setTimeout(() => {
        emoji.src = emojis.thinking;
      }, 3000);
    }
  }
  if (num >= 5) {
    click_button.disabled = true;
    emoji.style.height = "500px";
    emoji.src =
      "https://png.pngtree.com/png-clipart/20210311/original/pngtree-game-over-pixel-transparent-background-png-image_5995763.jpg";
    return;
  }
});

playagain.addEventListener("click", () => {
  playAgain();
});
console.log("----");
