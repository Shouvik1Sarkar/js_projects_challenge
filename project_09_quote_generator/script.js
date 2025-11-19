import { quote_api } from "../api_key.js";

const quote_text = document.getElementById("quote-text");
const author = document.getElementById("quote-author");
const newBtn = document.getElementById("newBtn");
const copyBtn = document.getElementById("copyBtn");
const status = document.getElementById("status");
const select_cat = document.getElementById("select_cat");
let category = "";

let data_base = [];

window.addEventListener("load", () => {
  let local_data = JSON.parse(localStorage.getItem("quote_data")) || [];

  if (local_data.length > 0) {
    data_base = local_data;
    quote_text.innerHTML = local_data[0].quote;
    author.innerHTML = `— ${local_data[0].author_name}`;
  } else {
    quote_text.innerHTML = "Click 👉 New Quote";
    author.innerHTML = "";
  }
});

select_cat.addEventListener("change", () => {
  category = select_cat.value;
});

function fetch_api(category) {
  if (category == "") {
    category = "success";
  }
  return fetch(
    `https://api.api-ninjas.com/v2/randomquotes?categories=${category}`,
    {
      headers: {
        "X-Api-Key": quote_api,
      },
    }
  );
}

newBtn.addEventListener("click", () => {
  const retrieved_data = fetch_api(category);
  retrieved_data
    .then((data) => {
      return data.json();
    })
    .then((data) => {
      console.log("DATA: ", data);

      quote_text.innerHTML = `${data[0].quote}`;
      author.innerHTML = `— ${data[0].author}`;

      let data_object = [{ quote: data[0].quote, author_name: data[0].author }];

      data_base = data_object;

      localStorage.setItem("quote_data", JSON.stringify(data_base));
    })
    .catch((e) => {
      console.log("ERROR", e);
    });
});

copyBtn.addEventListener("click", async () => {
  const txt = `${quote_text.textContent} - ${author.textContent}`.trim();
  try {
    await navigator.clipboard.writeText(txt);
    status.innerHTML = "Copied to the clipboard";
    setTimeout(() => {
      status.innerHTML = "Ready";
    }, 1600);
  } catch (error) {
    status.innerHTML = "Failed to copy";
  }
});
document.getElementById("twitterBtn").addEventListener("click", () => {
  const txt = `"${quote_text.textContent}" \n\n- ${author.textContent}`.trim();
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    txt
  )}`;
  window.open(url, "_blank");
});
