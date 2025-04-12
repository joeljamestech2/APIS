// Get IP address
fetch("https://api64.ipify.org?format=json")
  .then(response => response.json())
  .then(data => {
    document.getElementById("ip").textContent = data.ip;
  });

// Get location
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(position => {
    const lat = position.coords.latitude.toFixed(4);
    const lon = position.coords.longitude.toFixed(4);
    document.getElementById("location").textContent = `${lat}, ${lon}`;
  }, () => {
    document.getElementById("location").textContent = "Permission denied";
  });
} else {
  document.getElementById("location").textContent = "Not supported";
}

// Get battery info
navigator.getBattery?.().then(battery => {
  function updateBattery() {
    const level = Math.round(battery.level * 100);
    const charging = battery.charging ? "Charging" : "Not Charging";
    document.getElementById("battery").textContent = `${level}% - ${charging}`;
  }

  updateBattery();
  battery.addEventListener("levelchange", updateBattery);
  battery.addEventListener("chargingchange", updateBattery);
});
