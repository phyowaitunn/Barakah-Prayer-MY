// Splash Auto Hide
setTimeout(() => {
    document.getElementById("splash").style.display = "none";
}, 3000);

// Sidebar Toggle
function toggleMenu() {
    const sidebar = document.getElementById("sidebar");
    if (sidebar.style.left === "0px") {
        sidebar.style.left = "-250px";
    } else {
        sidebar.style.left = "0px";
    }
}

// Page Switch
function showPage(pageId) {
    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active-page");
    });
    document.getElementById(pageId).classList.add("active-page");
    toggleMenu();
}

// Load Prayer Times
async function loadPrayerTimes() {
    const response = await fetch(
        "https://api.aladhan.com/v1/timingsByCity?city=Kuala Lumpur&country=Malaysia&method=3"
    );

    const data = await response.json();
    const timings = data.data.timings;

    document.getElementById("fajr").innerText = timings.Fajr;
    document.getElementById("dhuhr").innerText = timings.Dhuhr;
    document.getElementById("asr").innerText = timings.Asr;
    document.getElementById("maghrib").innerText = timings.Maghrib;
    document.getElementById("isha").innerText = timings.Isha;

    document.getElementById("gregorianDate").innerText =
        data.data.date.gregorian.date;

    document.getElementById("hijriDate").innerText =
        data.data.date.hijri.date + " AH";
}

loadPrayerTimes();
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}
