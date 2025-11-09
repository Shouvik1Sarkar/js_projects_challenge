const repos = [
  { stargazers_count: 23, x: 23 },
  { stargazers_count: 231 },
  { stargazers_count: 3 },
  { stargazers_count: 23, x: 2 },
  { stargazers_count: 2 },
  { stargazers_count: 1 },
  { stargazers_count: 24 },
  { stargazers_count: 38 },
  { stargazers_count: 54 },
  { stargazers_count: 7 },
];

const topRepos = repos
  .sort((a, b) => b.stargazers_count - a.stargazers_count)
  .slice(0, 5);

console.log(topRepos);

// const ar = [1, 2, 12, 324, 3, 0, 43, 56, 321];
// ar.sort((a, b) => b - a);
// console.log(ar);
