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

//current weather
const title = document.querySelector("h1");
const temp = document.querySelector(".temp");
const findBtn = document.querySelector(".find-city-btn");
const currentBtn = document.querySelector(".current-location-btn");
const input = document.querySelector("input");
const description = document.querySelector(".description");
const humidity = document.querySelector(".humidity b");
const wind = document.querySelector(".wind b");
const icon = document.querySelector(".icon");
const apiKey = "a33b693cfbefd271b0ed075f9a8f65f0";

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
  temp.textContent = Math.round(response.data.main.temp);
  title.textContent = response.data.name;
  description.textContent = response.data.weather[0].description;
  humidity.textContent = response.data.main.humidity + " %";
  wind.textContent = Math.round(response.data.wind.speed) + " m/s";
  icon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  icon.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord.lat, response.data.coord.lon);
}

//forecast
function getForecast(lat, lon) {
  axios
    .get(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    )
    .then(showForecast);
}

function showForecast(response) {
  console.log(response.data);
  const forecastResponse = response.data.daily;
  const forecastElem = document.querySelector(".forecast");

  let forecastHTML = `<div class="forecast-row">`;
  forecastResponse.forEach(function (day, index) {
    if (index < 7) {
      forecastHTML += `
            <div class="forecast-item">
              <div class="forecast-elem">
                <p class="forecast-day">${formatDay(day.dt)}</p>
                <img src="http://openweathermap.org/img/wn/${
                  day.weather[0].icon
                }@2x.png" alt="icon">
                <div class="forecast-temp"> <span class="forecast-temp-max">${Math.round(
                  day.temp.max
                )}°</span> <span class="forecast-temp-min">${Math.round(day.temp.min)}°</span></div>
              </div>
            </div>`;
    }
  });

  forecastElem.innerHTML = forecastHTML + `</div>`;
}

function formatDay(timestamp) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const date = new Date(timestamp * 1000);
  const day = date.getDay();
  return days[day];
}
