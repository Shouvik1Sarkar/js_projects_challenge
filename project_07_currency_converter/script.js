import { api_key } from "../api_key.js";

let asked_currency = "USD";
let convert_currency = "USD";
let currencyData;

const from_currency = document.getElementById("from-currency");
const to_currency = document.getElementById("to-currency");
const convert_btn = document.getElementById("convert-btn");
const amount = document.getElementById("amount");
const display = document.getElementById("result");
const converted_amount = document.getElementById("converted-amount");
const rate = document.getElementById("rate");
const updated_time = document.getElementById("updated-time");
const error_div = document.getElementById("error");
const swap_button = document.getElementById("swap");

console.log(".....: ", from_currency);

from_currency.addEventListener("change", (e) => {
  asked_currency = e.target.value;
  console.log("ASKED CURRENCY: ", asked_currency);
});
to_currency.addEventListener("change", (e) => {
  convert_currency = e.target.value;
  console.log("CONVERT CURRENCY: ", convert_currency);
});

function add_values_to_drop_downs(value) {
  const from_option = document.createElement("option");
  from_option.value = value;
  from_option.innerHTML = value;
  from_option.classList.add("from_option");
  from_currency.appendChild(from_option);
  //   console.log("0000: ", from_currency);

  const to_option = document.createElement("option");
  to_option.value = value;
  to_option.innerHTML = value;
  to_option.classList.add("to_option");
  to_currency.appendChild(to_option);

  from_currency.value = asked_currency;
  to_currency.value = convert_currency;
}
function api_data(asked_currency) {
  const api_url = `https://v6.exchangerate-api.com/v6/${api_key}/latest/${asked_currency}`;
  return fetch(api_url)
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      console.log("result121212: ", result);
      // ⚠️ Check if the API itself reports an error
      if (result.result === "error") {
        // Handle specific error types gracefully
        error_div.classList.remove("hidden");

        if (result["error-type"] === "quota-reached") {
          error_div.innerHTML =
            "API quota reached — please try again tomorrow or use a new API key.";
          throw new Error(
            "API quota reached — please try again tomorrow or use a new API key."
          );
        } else if (result["error-type"] === "unsupported-code") {
          error_div.innerHTML =
            "Unsupported currency code — please select another currency.";
          throw new Error(
            "Unsupported currency code — please select another currency."
          );
        } else {
          error_div.innerHTML = `API Error: ${result["error-type"]}`;
          throw new Error(`API Error: ${result["error-type"]}`);
        }
      }

      console.log("result121212: ", result);
      return result;
    })
    .catch((err) => {
      console.log("ERROR: ", err);
      error_div.classList.remove("hidden");
      error_div.innerHTML = `${err.message}`;
    });
}
function init() {
  api_data(asked_currency).then((data) => {
    if (!data) return;

    const currency_names = Object.keys(data.conversion_rates);
    console.log("CURRENCY NAMES: ", currency_names);

    // Clear old options before repopulating
    from_currency.innerHTML = "";
    to_currency.innerHTML = "";

    for (const key in currency_names) {
      add_values_to_drop_downs(currency_names[key]);
    }

    from_currency.value = asked_currency;
    to_currency.value = convert_currency;
  });
}

function convert_it() {
  const get_amount = amount.value;

  if (!get_amount || isNaN(get_amount)) {
    error_div.classList.remove("hidden");
    error_div.innerText = "Please enter a valid amount.";
    return;
  }

  api_data(asked_currency)
    .then((result) => {
      const answer = get_amount * result.conversion_rates[convert_currency];

      display.classList.remove("hidden");
      //   display.innerText = `${get_amount} ${asked_currency} = ${answer} ${convert_currency}`;
      converted_amount.innerText = `${get_amount} ${asked_currency} = ${(
        get_amount * result.conversion_rates[convert_currency]
      ).toFixed(2)} ${convert_currency}`;

      // converted_amount.innerText = convert_currency;
      // rate.innerText = answer;
      // updated_time.innerText = `Last updated: ${result.time_last_update_utc.slice(
      //   0,
      //   17
      // )}`;
      display.appendChild(converted_amount);
      // display.appendChild(rate);
      display.appendChild(updated_time);
    })
    .catch((err) => {
      //   alert("ERROR: ", err);

      error_div.innerHTML = `---${err.message}`;
    });
}
convert_btn.addEventListener("click", () => {
  convert_it();
});
swap_button.addEventListener("click", () => {
  let variable = convert_currency;

  convert_currency = asked_currency;
  asked_currency = variable;

  from_currency.value = asked_currency;
  to_currency.value = convert_currency;
  convert_it();
});

// action();
init();
// response is not defined
