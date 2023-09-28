let citiesArray = [];

const storedCities = localStorage.getItem("cities");

if (storedCities) {
  citiesArray = JSON.parse(storedCities);

  const searchHistoryElement = document.getElementById("search-history");
  citiesArray.forEach((city) => {
    const button = document.createElement("button");
    button.textContent = city;

    button.addEventListener("click", () => {
      fetchWeatherAndForecast(city);
    });

    searchHistoryElement.appendChild(button);

    searchHistoryElement.appendChild(document.createElement("br"));
  });
}

const weatherEmoji = {
  "01d": "☀️",
  "01n": "🌙",
  "02d": "🌤️",
  "02n": "🌙",
  "03d": "🌥️",
  "03n": "🌙",
  "04d": "☁️",
  "04n": "🌙",
  "09d": "🌧️",
  "09n": "🌧️",
  "10d": "🌧️",
  "10n": "🌧️",
  "11d": "⛈️",
  "11n": "⛈️",
  "13d": "❄️",
  "13n": "❄️",
  "50d": "🌫️",
  "50n": "🌫️",
};

document.getElementById("search-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const city = document.getElementById("city-input").value;
  citiesArray.push(city);

  localStorage.setItem("cities", JSON.stringify(citiesArray));

  const searchHistoryElement = document.getElementById("search-history");
  const listItem = document.createElement("li");
  listItem.textContent = city;
  searchHistoryElement.appendChild(listItem);
});

async function getFiveDayForecast(city) {
  const apiKey = "2c40a331989ab50a8d3360a566b62cf6";

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast/daily?q=${city}&appid=${apiKey}`
    );
    const data = await response.json();
    displayFiveDayForecast(data.list);
    return data.list;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

document.getElementById("search-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const apiKey = "2c40a331989ab50a8d3360a566b62cf6";

  const city = document.getElementById("city-input").value;

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log("data", data);

      displayCurrentWeather(data);
    })
    .catch((error) => {
      console.error(error);
      alert("An error occurred while fetching weather data.");
    });

  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      displayFiveDayForecast(data.list);
    })
    .catch((error) => {
      console.error(error);
      alert("An error occurred while fetching weather data.");
    });
});

function displayCurrentWeather(data) {
  const currentWeather = document.getElementById("current-weather");
  currentWeather.innerHTML = "";

  const cityName = data.name;
  const date = new Date(data.dt * 1000);
  const temperature = (data.main.temp - 273.15).toFixed(1);
  const humidity = data.main.humidity;
  const windSpeed = data.wind.speed;

  const cityElement = document.createElement("h2");
  cityElement.textContent = `Current Weather in ${cityName}`;

  const emoji = weatherEmoji[data.weather[0].icon];

  const emojiElement = document.createElement("span");
  emojiElement.textContent = emoji;

  const dateElement = document.createElement("p");
  dateElement.textContent = `Date: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  const temperatureElement = document.createElement("p");
  temperatureElement.textContent = `Temperature: ${temperature}°C`;
  const humidityElement = document.createElement("p");
  humidityElement.textContent = `Humidity: ${humidity}%`;
  const windSpeedElement = document.createElement("p");
  windSpeedElement.textContent = `Wind Speed: ${windSpeed} m/s`;

  currentWeather.appendChild(cityElement);
  currentWeather.appendChild(emojiElement);

  currentWeather.appendChild(dateElement);
  currentWeather.appendChild(temperatureElement);
  currentWeather.appendChild(humidityElement);
  currentWeather.appendChild(windSpeedElement);
}

function displayFiveDayForecast(weatherData) {
  const forecastElement = document.getElementById("forecast");

  const cardContainer = document.createElement("div");
  cardContainer.className = "card-container";

  for (let i = 0; i < 40; i = i + 8) {
    const dayData = weatherData[i];
    const card = document.createElement("div");
    card.className = "card";

    const dateElement = document.createElement("p");
    const date = new Date(dayData.dt * 1000);
    dateElement.textContent = `Day: ${date.toLocaleDateString()}`;

    const emoji = weatherEmoji[dayData.weather[0].icon];
    const emojiElement = document.createElement("span");
    emojiElement.textContent = emoji;

    const temperature = (dayData.main.temp - 273.15).toFixed(1);
    const temperatureElement = document.createElement("p");
    temperatureElement.textContent = `Temperature: ${temperature}°C`;

    const humidityElement = document.createElement("p");
    humidityElement.textContent = `Humidity: ${dayData.main.humidity}%`;

    const windElement = document.createElement("p");
    windElement.textContent = `Wind Speed: ${dayData.wind.speed} m/s`;

    card.appendChild(dateElement);
    card.appendChild(emojiElement);

    card.appendChild(temperatureElement);
    card.appendChild(humidityElement);
    card.appendChild(windElement);

    cardContainer.appendChild(card);
  }

  forecastElement.appendChild(cardContainer);
}

function fetchWeatherAndForecast(city) {
  const apiKey = "2c40a331989ab50a8d3360a566b62cf6";

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      displayCurrentWeather(data);
    })
    .catch((error) => {
      console.error(error);
      alert("An error occurred while fetching weather data.");
    });

  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      displayFiveDayForecast(data.list);
    })
    .catch((error) => {
      console.error(error);
      alert("An error occurred while fetching weather data.");
    });
}
