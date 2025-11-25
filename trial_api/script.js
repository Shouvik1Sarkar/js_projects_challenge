const user_input = document.getElementById("user_input");
const click_me = document.getElementById("click_me");

const recipe_cache = {};

function get_recipe(name) {
  if (!name) return Promise.resolve({ meals: null });
  if (recipe_cache[name]) {
    return Promise.resolve(recipe_cache[name]);
  }
  return fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`)
    .then((data) => {
      return data.json();
    })
    .then((data) => {
      console.log("before data", data);
      recipe_cache[name] = data;
      return data;
    })
    .catch((e) => {
      console.log("ERROR: ", e);
      return { meals: null };
    });
}

click_me.addEventListener("click", () => {
  console.log(user_input.value);
  get_recipe(user_input.value)
    .then((data) => {
      console.log("Data: ", data);
      console.log("recipe cache: ", recipe_cache);
    })
    .catch((e) => {
      console.log("data: ", e);
    });
});
