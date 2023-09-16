function getWeatherData(location) {
    const apiKey = "a73de6ba12212b84834873e1b15a767d";
    const url = 'api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={a73de6ba12212b84834873e1b15a767d}';
    fetch(queryURL)
      .then(response => response.json())
      .then(data => {
        const weatherData = {
          temperature: data.main.temp,
          condition: data.weather[0].main,
          location: data.name,
        };
        return weatherData;
      });
  }
  function updateUI(weatherData) {
    const temperature = document.querySelector("#temperature");
    const condition = document.querySelector("#condition");
    const location = document.querySelector("#location");
  
    temperature.textContent = `${weatherData.temperature}°C`;
    condition.textContent = weatherData.condition;
    location.textContent = weatherData.location;
  }
  
  const searchBtn = document.querySelector("#search-btn");
  const searchBar = document.querySelector("#search-bar");
  
  searchBtn.addEventListener("click", () => {
    const location = searchBar.value;
    getWeatherData(location)
      .then(weatherData => {
        updateUI(weatherData);
      })
      .catch(error => {
        console.log(error);
      });
  });
  $.ajax({
    url: 'http://api.openweathermap.org/data/2.5/forecast', //API Call
    dataType: 'json',
    type: 'GET',
    data: {
      q: city,
      appid: key,
      units: 'metric',
      cnt: '10'
    },
    success: function console.log(data) {
      var weatherData = '' ,
      $.each(data, function(index, val) {
        weatherforcast += '<p><b>' + data.city.name + '</b><img src=http://openweathermap.org/img/w/' + data.list[0].weather.icon + '.png></p>' + data.list[0].main.temp + '&deg;C' + ' | ' + data.list[0].weather.main + ", " + data.list[0].weather.description
  }),
     { 
      $("#showWeatherForcast").html(weatherforcast)
    }
  });
  
  