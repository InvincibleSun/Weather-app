document.addEventListener("DOMContentLoaded", getCoords);

//date
const timeElem = document.querySelector(".time");
const now = new Date();

function formatDate(date) {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const day = days[date.getDay()];

  let hours = date.getHours();
  if (hours < 10) {
    hours = "0" + hours;
  }

  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  const year = date.getFullYear();

  let month = date.getMonth();
  if (month < 10) {
    month = "0" + month;
  }

  let num = date.getDate();
  if (num < 10) {
    num = "0" + num;
  }

  return `${day} ${hours}:${minutes} | ${num}.${+month + 1}.${year}`;
}
timeElem.textContent = formatDate(now);

//forecast
const title = document.querySelector("h1");
const temp = document.querySelector(".temp");
const signF = document.querySelector("h2 a:last-child");
const signC = document.querySelector(".sign-C");
const findBtn = document.querySelector(".find-city-btn");
const currentBtn = document.querySelector(".current-location-btn");
const input = document.querySelector("input");
const description = document.querySelector(".description");
const humidity = document.querySelector(".humidity b");
const wind = document.querySelector(".wind b");
const icon = document.querySelector(".icon");
const apiKey = "f02aa195f0929b1be058b3a6489e6ae0";
let celsiusTemp;
let fahrenheitTemp;

findBtn.onclick = function (event) {
  event.preventDefault();
  const city = input.value;

  axios
    .get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&exclude=daily&appid=${apiKey}&units=metric`
    )
    .then(displayTemp);

  input.value = "";
};

currentBtn.addEventListener("click", getCoords);

function getCoords(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(retrieveGeolocation);
}

function retrieveGeolocation(position) {
  const lon = position.coords.longitude.toFixed(2);
  const lat = position.coords.latitude.toFixed(2);

  axios
    .get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&exclude=daily&appid=${apiKey}&units=metric`
    )
    .then(displayTemp);
}

function displayTemp(response) {
  console.log(response);
  celsiusTemp = Math.round(response.data.main.temp);
  fahrenheitTemp = Math.round(celsiusTemp * (9 / 5) + 32);
  temp.textContent = celsiusTemp;
  title.textContent = response.data.name;
  description.textContent = response.data.weather[0].description;
  humidity.textContent = response.data.main.humidity + " %";
  wind.textContent = Math.round(response.data.wind.speed) + " m/s";
  icon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  icon.setAttribute("alt", response.data.weather[0].description);
}

signF.onclick = function (event) {
  event.preventDefault();
  temp.textContent = fahrenheitTemp;
  signC.classList.remove("active");
  signF.classList.add("active");
};

signC.onclick = function (event) {
  event.preventDefault();
  temp.textContent = celsiusTemp;
  signF.classList.remove("active");
  signC.classList.add("active");
};
