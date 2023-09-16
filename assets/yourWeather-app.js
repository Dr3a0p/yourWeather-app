const OPEN_WEATHER_MAP_API_KEY = `a73de6ba12212b84834873e1b15a767d`;

// Set up URLs to access various weather features. Do not modify this section.
const OPEN_WEATHER_MAP_SERVER_URL = `http://api.openweathermap.org/data/2.5`;
const FORECAST_ENDPOINT = OPEN_WEATHER_MAP_SERVER_URL +
    `/forecast?APPID=${OPEN_WEATHER_MAP_API_KEY}&units=metric&cnt=7&lang=en&q=`;
const WEATHER_ENDPOINT = OPEN_WEATHER_MAP_SERVER_URL +
    `/weather?APPID=${OPEN_WEATHER_MAP_API_KEY}&q=`;



function WeatherForecast() {
  const nyWeather = getWeatherForecastForLocation('Toronto, CA');

  // Example 1: Use weather summary provided by OpenWeathermap.
  let rainyDays = 0;
  for (const date in nyWeather.forecast) {
    const forecast = nyWeather.forecast[date];
    if (forecast.status.summary === 'Rain') {
      rainyDays = rainyDays + 1;
    }
  }
  if (rainyDays > 4) {
    // Add your logic here.
  }

  // Example 2: Check more specific weather parameters.
  let coldDays = 0;
  for (const date in nyWeather.forecast) {
    const forecast = nyWeather.forecast[date];
    if (forecast.snow > 5 && forecast.temperature < 273) {
      coldDays = coldDays + 1;
    }
  }
  if (coldDays > 4) {
    // Add your logic here.
  }
}

/**
 * Make a call to the OpenWeatherMap server.
 *
 * @param {string} endpoint the server endpoint.
 * @param {string} location the location for which weather
 *     information is retrieved.
 * @return {Object} the server response.
 */
function callWeatherServer(endpoint, location) {
  const url = Utilities.formatString('%s%s',
      endpoint,
      encodeURIComponent(location));
  const response = UrlFetchApp.fetch(url);
  if (response.getResponseCode() != 200) {
    throw Utilities.formatString(
        'Error returned by API: %s, Location searched: %s.',
        response.getContentText(), location);
  }
  const result = JSON.parse(response.getContentText());

  // OpenWeatherMap's way of returning errors.
  if (result.cod != 200) {
    throw Utilities.formatString(
        'Error returned by API: %s,  Location searched: %s.',
        response.getContentText(), location);
  }
  return result;
}

/**
 * Parse the weather response from the OpenWeatherMap server.
 *
 * @param {Object} weather the weather information from
 *     OpenWeatherMap server.
 * @return {!Object} the parsed weather response.
 */
function parseWeather(weather) {
  const retval = {
    'rain': 0,
    'temperature': 0,
    'windspeed': 0,
    'snow': 0,
    'clouds': 0,
    'status': {
      'id': 0,
      'summary': '',
      'description': ''
    }
  };

  if (weather.rain) {
    if (typeof weather.rain === 'object' && weather.rain['3h']) {
      retval.rain = weather.rain['3h'];
    } else {
      retval.rain = weather.rain;
    }
  }

  if (weather.snow) {
    if (typeof weather.snow === 'object' && weather.snow['3h']) {
      retval.snow = weather.snow['3h'];
    } else {
      retval.snow = weather.snow;
    }
  }

  if (weather.clouds && weather.clouds.all) {
    retval.clouds = weather.clouds.all;
  }

  if (weather.main) {
    retval.temperature = weather.main.temp.toFixed(2);
  } else if (main.temp) {
    retval.temperature = weather.temp.toFixed(2);
  }

  if (weather.wind) {
    retval.windspeed = weather.wind.speed;
  } else if (weather.speed) {
    retval.windspeed = weather.speed;
  }

  if (weather.weather && weather.weather.length > 0) {
    retval.status.id = weather.weather[0].id;
    retval.status.summary = weather.weather[0].main;
    retval.status.description = weather.weather[0].description;
  }
  return retval;
}

/**
 * Get the weather forecast for a location for the next 7 days.
 *
 * @param {string} location the location for which weather
 *     forecast information is retrieved.
 * @return {!Object} the parsed weather response.
 */
function getWeatherForecastForLocation(location) {
  const result = callWeatherServer(FORECAST_ENDPOINT, location);
  const retval = {
    'name': result.city.name,
    'country': result.city.country,
    'forecast': {
    }
  };
  for (const forecast of result.list) {
    const date = formatDate(forecast.dt);
    retval.forecast[date] = parseWeather(forecast);
  }
  return retval;
}

/**
 * Get the current weather information for a location.
 *
 * @param {string} location the location for which weather
 *     information is retrieved.
 * @return {!Object} the parsed weather response.
 */
function getWeatherForLocation(location) {
  const result = callWeatherServer(WEATHER_ENDPOINT, location);
  return {
    'name': result.name,
    'country': result.sys.country,
    'weather': parseWeather(result)
  };
}

/**
 * Formats the date in yyyyMMdd format.
 *
 * @param {number} dt unix timestamp from OpenWeatherMap server.
 * @return {string} the formatted date.
 */
function formatDate(dt) {
  const date = new Date(dt * 1000);
  return Utilities.formatDate(date, 'GMT', 'yyyyMMdd');
}
