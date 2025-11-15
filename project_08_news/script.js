import { news_api_key } from "../api_key.js";

// let api_url = `https://gnews.io/api/v4/{endpoint}?{parameters}&apikey=YOUR_API_KEY`;
const user_input = document.getElementById("search-input");
const click_button = document.getElementById("click_it");
let topic;
function build_url(topic, search) {
  return `https://gnews.io/api/v4/top-headlines?lang=en&category=${topic}&q=${search}&apikey=${news_api_key}`;
}
const error_div = document.getElementById("error_div");

const category = document.getElementsByClassName("category");
const news_container = document.getElementById("news-container");

window.addEventListener("load", () => {
  get_result("", "random");
});

Array.from(category).forEach((element) => {
  element.addEventListener("click", () => {
    topic = element.id;
    get_result(topic, "");
  });
});

click_button.addEventListener("click", () => {
  let search = user_input.value;
  get_result("", search);

  user_input.value = "";
});

function get_data(topic, search) {
  const api_url = build_url(topic, search);
  return fetch(api_url)
    .then((result) => {
      //   if (!result.ok) {
      //     throw new Error(result.statusText);
      //     console.log("result.message: ");
      //   }
      return result.json();
    })

    .then((data) => {
      if (data.errors) {
        throw new Error(data.errors);
      }
      console.log("DATA: ", data.articles);

      return data.articles;
    })
    .catch((err) => {
      console.log("EEEE: ", err);

      throw err;
    });
}
function get_result(topic, search) {
  news_container.innerHTML = "";
  get_data(topic, search)
    .then((result) => {
      for (let key of result) {
        console.log("TITLE: ", key.title);
        console.log("DESCRIPTION: ", key.description);
        console.log("URL: ", key.url);
        console.log("IMAGE: ", key.image);
        console.log(
          "//////////////////////////////////////////////////////////////////////////////////"
        );

        const news_card = document.createElement("div");
        news_card.classList.add("news-card");

        const news_image = document.createElement("img");
        news_image.classList.add("news-img");

        const news_title = document.createElement("h3");
        news_title.classList.add("news-title");

        const news_description = document.createElement("p");
        news_description.classList.add("news-description");

        const maxLength = 200;
        const descriptionText =
          key.description.length > maxLength
            ? key.description.slice(0, maxLength) + "..."
            : key.description;

        const news_link = document.createElement("a");
        news_link.classList.add("news-link");
        news_link.innerHTML = "Read Full Article →";

        news_image.src = key.image;
        news_title.innerText = key.title;
        news_description.innerText =
          descriptionText || "No description available.";
        // news_description.innerText = key.description;
        news_link.href = key.url;
        news_link.target = "_blank";

        news_card.appendChild(news_image);
        news_card.appendChild(news_title);
        news_card.appendChild(news_description);
        news_card.appendChild(news_link);
        news_container.appendChild(news_card);
      }
    })
    .catch((err) => {
      console.log("ERROR88888:", err);
      error_div.innerHTML = err.message;
      throw err;
    });
}

/**
 * Use a rule-based builder instead:

function build_url(topic, search) {
  const base = "https://gnews.io/api/v4/top-headlines";
  const params = new URLSearchParams({
    lang: "en",
    apikey: news_api_key
  });

  if (topic) params.append("category", topic);
  if (search) params.append("q", search);

  return `${base}?${params.toString()}`;
}


Much cleaner + no empty params.
 */
