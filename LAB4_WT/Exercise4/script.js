const apiKey = 'bd5e378503939ddaee76f12ad7a97608'; 
const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const loadingDiv = document.getElementById('loading');
const messageDiv = document.getElementById('message');

const weatherContainer = document.getElementById('weatherContainer');
const cityNameSpan = document.getElementById('cityName');
const tempSpan = document.getElementById('temp');
const humiditySpan = document.getElementById('humidity');
const conditionSpan = document.getElementById('condition');

let lastSearchedCity = ''; 

searchBtn.onclick = function() {
  const city = cityInput.value.trim();
  if (!city) {
    showMessage('Please enter a city name.');
    return;
  }
  fetchWeather(city);
};

function showLoading(show) {
  loadingDiv.style.display = show ? 'block' : 'none';
}

function showMessage(msg, isError = true) {
  messageDiv.textContent = msg;
  messageDiv.style.color = isError ? 'red' : 'green';
  if (msg) {
    setTimeout(() => { messageDiv.textContent = ''; }, 4000);
  }
}

function fetchWeather(city) {
  showLoading(true);
  weatherContainer.style.display = 'none';
  // Cache last searched city
  lastSearchedCity = city;

  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('City not found.');
        } else {
          throw new Error('Network response was not ok.');
        }
      }
      return response.json();
    })
    .then(data => {
      displayWeather(data);
    })
    .catch(error => {
      showMessage(error.message);
    })
    .finally(() => {
      showLoading(false);
    });
}

function displayWeather(data) {
  document.getElementById('cityName').textContent = data.name;
  document.getElementById('temp').textContent = data.main.temp.toFixed(1);
  document.getElementById('humidity').textContent = data.main.humidity;
  document.getElementById('condition').textContent = data.weather[0].description;

  weatherContainer.style.display = 'block';
}

window.onload = function() {
  if (lastSearchedCity) {
    document.getElementById('cityInput').value = lastSearchedCity;
    fetchWeather(lastSearchedCity);
  }
};