const grid = document.getElementById("grid_id");
const search = document.getElementById("search");
const user_input = document.getElementById("user_input");
const brand_id = document.getElementById("brand_id");
const error_text = document.getElementById("error_text");
const errormessage = document.getElementById("errormessage");
const chips = document.querySelectorAll(".chip");
const card_items = document.querySelectorAll(".card-item");
const saved_grid = document.getElementById("saved-grid");
const recipe_modal = document.getElementById("recipe-modal");
const content_container = document.getElementById("content_container");
const sort = document.getElementById("sort");
//  <button class="save-btn" aria-label="Save recipe">
//    💾
//  </button>;
let dish_name = "";

let saved_items = [];

sort.addEventListener("change", () => {
  const location_value = sort.value;
  if (location_value.trim() == "") {
    return;
  }

  fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${location_value}`
  )
    .then((data) => {
      return data.json();
    })
    .then((data) => {
      console.log("data: ", data.meals);
      if (!data || data.length == 0 || !data.meals) {
        grid.innerHTML = "";
        error_text.innerHTML = `Recipe for ${value} is not available`;
        errormessage.classList.remove("hidden");
        return;
      }
      errormessage.classList.add("hidden");
      console.log(data.meals);
      const dishes_list = data.meals;

      for (let i = 0; i < dishes_list.length; i++) {
        let dish = dishes_list[i];
        if (i == 0) {
          featured_dish_card_onreload(dish);
        } else {
          small_dish_card_onreload(dish);
        }
      }
    })
    .catch((e) => e);
});

const retrieve_saved_value =
  JSON.parse(localStorage.getItem("saved_dishes")) || [];

saved_items = retrieve_saved_value;

chips.forEach((element) => {
  user_input.innerHTML = "";
  element.addEventListener("click", () => {
    errormessage.classList.add("hidden");
    localStorage.setItem("dish_name", element.innerHTML);
    get_recipe(element.innerHTML).then((data) => {
      console.log("data: ", data);
      if (!data || data.length == 0 || !data.meals) {
        error_text.innerHTML = `Recipe for ${element.innerHTML} is not available`;
        errormessage.classList.remove("hidden");
        return;
      }
      //   dish_name = element.innerHTML;
      console.log(data.meals);
      const dishes_list = data.meals;

      console.log(dishes_list);

      for (let i = 0; i < dishes_list.length; i++) {
        let dish = dishes_list[i];
        if (i == 0) {
          featured_dish_card_onreload(dish);
        } else {
          small_dish_card_onreload(dish);
        }
      }
    });
  });
});

// for (let i = 0; i < chips.length; i++) {
//   console.log(chips[i]);
//   chips[i].addEventListener("click", () => {
//     get_recipe(chips[i].innerHTML);
//   });
// }
function get_recipe(user_input) {
  return fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${user_input}`
  )
    .then((data) => {
      return data.json();
    })
    .catch((e) => e);
}

// featured and small card

function featured_dish_card_onreload(dish) {
  grid.innerHTML = "";
  const article = document.createElement("article");
  article.classList.add("card-item", "featured");
  const image = document.createElement("img");
  const info = document.createElement("div");
  info.classList.add("info");
  const title = document.createElement("h3");
  const p = document.createElement("p");
  p.classList.add("muted");
  const featured_timing_div = document.createElement("div");
  const category = document.createElement("div");
  const origin = document.createElement("div");
  const save_button = document.createElement("button");
  save_button.classList.add("save-button");

  save_button.dataset.dish = dish.strMeal;

  update_all_save_buttons();

  featured_timing_div.classList.add("featured_timing_div");
  category.classList.add("pill");
  origin.classList.add("pill");

  image.src = dish.strMealThumb;
  title.innerHTML = dish.strMeal;
  p.innerHTML = ` Creamy, comforting and elegant — perfect for weekend dinner.`;
  category.innerHTML = `${dish.strCategory}`;
  origin.innerHTML = `${dish.strArea}`;

  featured_timing_div.appendChild(category);
  featured_timing_div.appendChild(origin);

  info.appendChild(title);
  info.appendChild(p);
  info.appendChild(featured_timing_div);

  article.appendChild(save_button);
  article.appendChild(image);
  article.appendChild(info);
  grid.appendChild(article);
  save_item_function(save_button, dish.strMeal);
  click_card(article, dish);
}

function small_dish_card_onreload(dish) {
  console.log("tHE ON LOAD IS BEING RUN");
  const article = document.createElement("article");
  article.classList.add("card-item");
  const image = document.createElement("img");
  const card_body = document.createElement("div");
  card_body.classList.add("card_body");
  const title = document.createElement("h3");

  const meta = document.createElement("div");
  const category = document.createElement("div");
  const origin = document.createElement("div");
  const save_button = document.createElement("button");
  save_button.classList.add("save-button");

  save_button.dataset.dish = dish.strMeal;

  //   const exists = saved_items.find((e) => e.name == dish.strMeal);
  //   if (exists) {
  //     console.log("////////////////////");
  //     save_button.innerHTML = "⭐";
  //   } else {
  //     console.log("////////////////////");
  //     save_button.innerHTML = "💾";
  //   }

  meta.classList.add("meta");
  category.classList.add("muted");
  origin.classList.add("muted");

  image.src = dish.strMealThumb;
  title.innerHTML = dish.strMeal;
  category.innerHTML = `${dish.strCategory}`;
  origin.innerHTML = `${dish.strArea}`;

  meta.appendChild(category);
  meta.appendChild(origin);
  card_body.appendChild(title);
  card_body.appendChild(meta);

  article.appendChild(save_button);
  article.appendChild(image);
  article.appendChild(card_body);
  grid.appendChild(article);
  save_item_function(save_button, dish.strMeal);
  click_card(article, dish);
  update_all_save_buttons();
}

search.addEventListener("click", () => {
  if (user_input.value.trim() == "") return;
  const value = user_input.value;
  get_recipe(value).then((data) => {
    console.log("data: ", data.meals);
    if (!data || data.length == 0 || !data.meals) {
      grid.innerHTML = "";
      error_text.innerHTML = `Recipe for ${value} is not available`;
      errormessage.classList.remove("hidden");
      return;
    }
    errormessage.classList.add("hidden");
    console.log(data.meals);
    const dishes_list = data.meals;

    for (let i = 0; i < dishes_list.length; i++) {
      let dish = dishes_list[i];
      if (i == 0) {
        featured_dish_card_onreload(dish);
      } else {
        small_dish_card_onreload(dish);
      }
    }
  });
  localStorage.setItem("dish_name", value);
  user_input.value = "";
});

brand_id.addEventListener("click", () => {
  localStorage.removeItem("dish_name");
  get_recipe("sweet").then((data) => {
    console.log("data: ", data.meals);

    const dishes_list = data.meals;

    for (let i = 0; i < dishes_list.length; i++) {
      let dish = dishes_list[i];
      if (i == 0) {
        featured_dish_card_onreload(dish);
      } else {
        small_dish_card_onreload(dish);
      }
    }
  });
});
// function error_message() {}

window.addEventListener("load", () => {
  console.log("hiiiiii: ", saved_items);
  const retrieved_value = localStorage.getItem("dish_name") || "sweet";
  console.log("-", typeof retrieved_value);
  console.log("-", retrieved_value);
  const x = "Data";
  console.log(x);
  saved_grid.innerHTML = "";

  get_recipe(retrieved_value).then((data) => {
    if (!data || data.length == 0 || !data.meals) {
      error_text.innerHTML = `Recipe for ${retrieved_value} is not available`;
      errormessage.classList.remove("hidden");
      return;
    }
    console.log("data: ", data);
    console.log("data: ", data.meals);

    const dishes_list = data.meals;

    for (let i = 0; i < dishes_list.length; i++) {
      let dish = dishes_list[i];
      if (i == 0) {
        featured_dish_card_onreload(dish);
      } else {
        small_dish_card_onreload(dish);
      }
      //   saved_dish_card(dish);
      //   const exists = saved_items.find((e) => e.name == dish.strMeal);
      //   if (exists) {
      //     saved_dish_card(dish);
      //   }
    }
  });
  for (const e of saved_items) {
    get_recipe(e.name)
      .then((data) => {
        console.log("WHAT THE HELL IS SAVED???", data);
        saved_dish_card(data.meals[0]);
      })
      .catch((e) => {
        console.log("ERROR: ", e);
      });
  }
});

// card_items.forEach((element) => {
//   element.addEventListener("click", () => {

//   });
// });
function save_item_function(save_button, title) {
  save_button.addEventListener("click", (e) => {
    const item_data = {};
    item_data.name = title;

    e.stopPropagation();

    const exists = saved_items.find((e) => e.name == title);

    if (!exists) {
      save_button.innerHTML = "⭐";
      saved_items.push(item_data);
      //   localStorage.setItem("saved_dishes", JSON.stringify(saved_items));
      // saved_item_display();
      console.log("TITLE: ", title);
      get_recipe(title).then((dish) => {
        console.log("ELEMENT: ", dish);
        saved_dish_card(dish.meals[0]);
      });
    } else {
      save_button.innerHTML = "💾";
      saved_items = saved_items.filter((e) => e.name != title);
      saved_grid.innerHTML = "";

      saved_items.forEach((e) => {
        get_recipe(e.name)
          .then((data) => {
            saved_dish_card(data.meals[0]);
          })
          .catch((e) => {
            console.log("ERROR: ", e);
          });
      });
      //   window.onload();
    }
    localStorage.setItem("saved_dishes", JSON.stringify(saved_items));

    update_all_save_buttons();
  });
}
// small_dish_card(dish);

function saved_dish_card(dish) {
  const article = document.createElement("article");
  article.classList.add("card-item");
  const image = document.createElement("img");
  const card_body = document.createElement("div");
  card_body.classList.add("card_body");
  const title = document.createElement("h3");

  const meta = document.createElement("div");
  const category = document.createElement("div");
  const origin = document.createElement("div");

  meta.classList.add("meta");
  category.classList.add("muted");
  origin.classList.add("muted");

  image.src = dish.strMealThumb;
  title.innerHTML = dish.strMeal;
  category.innerHTML = `${dish.strCategory}`;
  origin.innerHTML = `${dish.strArea}`;

  meta.appendChild(category);
  meta.appendChild(origin);
  card_body.appendChild(title);
  card_body.appendChild(meta);

  article.appendChild(image);
  article.appendChild(card_body);
  saved_grid.appendChild(article);
  click_card(article, dish);
}

function saved_item_display() {
  for (const dish of saved_items) {
    saved_dish_card(dish);
  }
}

function click_card(article, dish) {
  article.addEventListener("click", () => {
    // recipe_modal.classList.add("show");
    console.log("this is sisiiiiiiiiiiiiiii: ", dish);
    recipe_modal.classList.remove("hidden");

    content_container.classList.add("hidden");

    // --- Bookmark Button ---
    const bookmark_button = document.createElement("button");
    bookmark_button.classList.add("bookmark-btn");
    bookmark_button.dataset.dish = dish.strMeal;
    // bookmark_button.textContent = "💾"; // or ⭐ if already saved

    const exists = saved_items.find((e) => e.name == dish.strMeal);
    if (exists) {
      bookmark_button.innerHTML = "⭐";
    } else {
      bookmark_button.innerHTML = "💾";
    }

    const modal_content = document.createElement("div");
    modal_content.classList.add("modal-content");

    const close_button = document.createElement("button");
    close_button.classList.add("close-btn");
    close_button.innerHTML = "✕";

    const tutorial_title = document.createElement("h3");
    tutorial_title.classList.add("section-title");
    tutorial_title.textContent = "Watch Tutorial";

    const tutorial_link = document.createElement("a");
    tutorial_link.classList.add("tutorial-link");
    tutorial_link.id = "modal-video";
    tutorial_link.href = dish.strYoutube || "#"; // API gives YouTube link
    tutorial_link.target = "_blank";
    tutorial_link.textContent = "▶ Watch on YouTube";

    close_button.addEventListener("click", () => {
      //   recipe_modal.classList.remove("show");
      recipe_modal.classList.add("hidden");
      recipe_modal.innerHTML = "";
      content_container.classList.remove("hidden");
    });
    // dish.strMeasure

    const image = document.createElement("img");
    image.id = "modal-img";

    const title = document.createElement("h2");
    title.id = "modal-title";
    title.innerHTML = dish.strMeal;

    const ingredients_title = document.createElement("h3");
    ingredients_title.innerHTML = "Ingredients";
    ingredients_title.classList.add("section-title");

    const list_container = document.createElement("ul");
    list_container.classList.add("ingredients-list");
    list_container.id = "modal-ingredients";

    const instructions_title = document.createElement("h3");
    instructions_title.classList.add("section-title");
    instructions_title.innerHTML = "Instruction";

    const instructions = document.createElement("p");
    instructions.classList.add("instructions");
    instructions.id = "modal-instructions";
    console.log("------", dish.strInstructions);
    image.src = dish.strMealThumb;
    // list_container.innerHTML = "";
    instructions.innerHTML = dish.strInstructions;

    for (const key in dish) {
      if (key.includes("strMeasure")) {
        if (dish[key].trim().length > 0) {
          const instructions_list = document.createElement("li");
          instructions_list.innerHTML = dish[key];

          list_container.appendChild(instructions_list);
        }
      }
    }

    bookmark_button.addEventListener("click", (e) => {
      //   e.stopPropagation();
      //   save_item_function(bookmark_button, dish.strMeal);
      const exists = saved_items.find((e) => e.name === dish.strMeal);

      if (exists) {
        // REMOVE from saved
        saved_items = saved_items.filter((e) => e.name !== dish.strMeal);
        bookmark_button.innerHTML = "💾";
      } else {
        // ADD to saved
        saved_items.push({ name: dish.strMeal });
        bookmark_button.innerHTML = "⭐";
      }

      localStorage.setItem("saved_dishes", JSON.stringify(saved_items));

      update_all_save_buttons(); // update card buttons
      refresh_saved_section();
    });

    modal_content.appendChild(close_button);
    modal_content.appendChild(image);
    modal_content.appendChild(bookmark_button);
    modal_content.appendChild(title);
    modal_content.appendChild(ingredients_title);
    modal_content.appendChild(list_container);
    modal_content.appendChild(instructions_title);
    modal_content.appendChild(instructions);
    modal_content.appendChild(tutorial_title);
    modal_content.appendChild(tutorial_link);

    recipe_modal.appendChild(modal_content);
  });
}

function update_all_save_buttons() {
  document.querySelectorAll(".save-button").forEach((btn) => {
    const dishName = btn.dataset.dish;
    const exists = saved_items.find((e) => e.name == dishName);

    btn.innerHTML = exists ? "⭐" : "💾";
  });
}
function refresh_saved_section() {
  saved_grid.innerHTML = "";
  saved_items.forEach((e) => {
    get_recipe(e.name).then((data) => {
      saved_dish_card(data.meals[0]);
    });
  });
}
