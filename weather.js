const apiKey = '881746b1804c0ec7d395cd99da1ef8fb';

function fetchWeather(lat, lon) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      if (data.cod !== 200) {
        throw new Error(data.message);
      }
      document.querySelector(".city").textContent = data.name;
      document.querySelector(".weather").textContent = data.weather[0].description.toUpperCase();
      document.querySelector(".temp").textContent = `${Math.round(data.main.temp)}°`;
      document.querySelector(".minTemp").textContent = `${Math.round(data.main.temp_min)}°`;
      document.querySelector(".maxTemp").textContent = `${Math.round(data.main.temp_max)}°`;

      fetchCityName(lat, lon);
    })
    .catch(error => {
      console.error("Error fetching weather data:", error);
      document.querySelector(".city").textContent = "Error";
      document.querySelector(".weather").textContent = "Check API Key";
      document.querySelector(".temp").textContent = "--°";
      document.querySelector(".minTemp").textContent = "--°";
      document.querySelector(".maxTemp").textContent = "--°";
    });
}

function fetchCityName(lat, lon) {
  fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      if (data.length > 0) {
        document.querySelector(".city").textContent = data[0].name || "Unknown Location";
      } else {
        document.querySelector(".city").textContent = "City Not Found";
      }
    })
    .catch(error => {
      console.error("Error fetching city name:", error);
      document.querySelector(".city").textContent = "Error";
    });
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
      position => {
        const { latitude, longitude, accuracy } = position.coords;

        if (accuracy > 500) {
          console.warn(`Low accuracy (${accuracy}m), waiting for a better signal...`);
          return; // Skip fetching if accuracy is beyond 500m
        }

        console.log(`Location fetched: ${latitude}, ${longitude} (Accuracy: ${accuracy}m)`);
        fetchWeather(latitude, longitude);
      },
      error => {
        console.error("Error getting location:", error);
        document.querySelector(".city").textContent = "Location Error";
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
    document.querySelector(".city").textContent = "Not Supported";
  }
}

function updateImageByTime() {
  const hour = new Date().getHours();
  const imgElement = document.querySelector("img");

  if (hour >= 5 && hour < 12) {
    imgElement.src = "morning.png"; // Morning
  } else if (hour >= 12 && hour < 17) {
    imgElement.src = "afternoon.png"; // Afternoon
  } else if (hour >= 17 && hour < 20) {
    imgElement.src = "evening.png"; // Evening
  } else {
    imgElement.src = "night.png"; // Night
  }
}

updateImageByTime();
// Update image every 60 seconds
setInterval(updateImageByTime, 60000);

getLocation();
