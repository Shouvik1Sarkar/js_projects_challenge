function featured_dish(dish) {
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
  save_button.innerHTML = "💾";

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
}

function small_dish_card(dish) {
  console.log("THIS ONE");
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
  save_button.innerHTML = "💾";

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
}
