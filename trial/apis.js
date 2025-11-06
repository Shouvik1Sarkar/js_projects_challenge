fetch("https://opentdb.com/api.php?amount=10&category=17")
  .then((e) => {
    console.log(",", e);
  })
  .catch(() => {
    console.log("noooo");
  });
