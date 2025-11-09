const user_input = document.getElementById("username");
const search_btn = document.getElementById("search-btn");
const username = document.getElementById("name");
const profile_div = document.getElementById("profile");
const img = document.getElementById("avatar");
const bio = document.getElementById("bio");

const followers = document.getElementById("followers");
const repos_div = document.getElementById("repos");
const top_repo = document.getElementById("top-repo");

const profile_link = document.getElementById("profile-link");

async function fetch_data(user_input) {
  const promise = await fetch(`https://api.github.com/users/${user_input}`);
  const parsed_data = await promise.json();
  return parsed_data;
}
async function repos(user_input) {
  const promise = await fetch(
    `https://api.github.com/users/${user_input}/repos`
  );
  const parsed_data = await promise.json();
  return parsed_data;
}

search_btn.addEventListener("click", async () => {
  profile_div.classList.remove("hidden");
  const get_data = await fetch_data(user_input.value);
  console.log("get data: ", get_data);
  img.src = get_data.avatar_url;
  username.innerText = get_data.name;
  bio.innerText = get_data.bio;
  followers.innerText = get_data.followers;

  const repo_count = await repos(user_input.value);
  console.log(repo_count);
  repos_div.innerText = repo_count.length;
  profile_link.href = `https://github.com/${user_input.value}`;

  console.log(typeof repo_count);

  const topRepos = repo_count
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 5);
  //   top_repo.innerText = topRepos;
  top_repo.innerText = topRepos;
});
