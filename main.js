// IP and Location
fetch("https://ipapi.co/json/")
  .then(res => res.json())
  .then(data => {
    document.getElementById("ip").textContent = data.ip;
    document.getElementById("location").textContent = `${data.city}, ${data.region}, ${data.country_name}`;
  })
  .catch(() => {
    document.getElementById("ip").textContent = "Unavailable";
    document.getElementById("location").textContent = "Unavailable";
  });

// Battery
if ('getBattery' in navigator) {
  navigator.getBattery().then(battery => {
    const updateBattery = () => {
      document.getElementById("battery").textContent = `${Math.round(battery.level * 100)}% ${battery.charging ? '(Charging)' : ''}`;
    };
    updateBattery();
    battery.addEventListener('levelchange', updateBattery);
    battery.addEventListener('chargingchange', updateBattery);
  });
} else {
  document.getElementById("battery").textContent = "Battery API not supported";
}

// Connection Info
const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
document.getElementById("connection").textContent = connection
  ? `${connection.effectiveType} (${connection.downlink}Mbps)`
  : "Unavailable";

// Device Info
document.getElementById("device").textContent = navigator.userAgent;

// Browser Detection
const browser = (() => {
  const ua = navigator.userAgent;
  if (ua.includes("Chrome") && !ua.includes("Edg") && !ua.includes("OPR")) return "Chrome";
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
  if (ua.includes("Edg")) return "Edge";
  if (ua.includes("OPR") || ua.includes("Opera")) return "Opera";
  return "Unknown";
})();
document.getElementById("browser").textContent = browser;

// OS Detection
const os = (() => {
  const ua = navigator.userAgent;
  if (ua.includes("Windows")) return "Windows";
  if (ua.includes("Mac")) return "macOS";
  if (ua.includes("Linux")) return "Linux";
  if (ua.includes("Android")) return "Android";
  if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
  return "Unknown";
})();
document.getElementById("os").textContent = os;

// Screen Resolution
document.getElementById("screen").textContent = `${screen.width} x ${screen.height} @ ${window.devicePixelRatio}x`;

// Language
document.getElementById("language").textContent = navigator.language || "Unavailable";

// Cookies
document.getElementById("cookies").textContent = navigator.cookieEnabled ? "Yes" : "No";

// Do Not Track
document.getElementById("dnt").textContent = navigator.doNotTrack === "1" ? "Enabled" : "Disabled";

// Timezone
document.getElementById("timezone").textContent = Intl.DateTimeFormat().resolvedOptions().timeZone;

// Online Status
const updateOnlineStatus = () => {
  document.getElementById("online").textContent = navigator.onLine ? "Online" : "Offline";
};
updateOnlineStatus();
window.addEventListener("online", updateOnlineStatus);
window.addEventListener("offline", updateOnlineStatus);

// Local Storage
document.getElementById("storage").textContent = typeof Storage !== "undefined" ? "Supported" : "Unsupported";

// Platform
document.getElementById("platform").textContent = navigator.platform || "Unknown";

// Geolocation
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(
    position => {
      document.getElementById("geo").textContent = 
        `Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)}`;
    },
    () => {
      document.getElementById("geo").textContent = "Permission denied or unavailable";
    }
  );
} else {
  document.getElementById("geo").textContent = "Not supported";
      }
