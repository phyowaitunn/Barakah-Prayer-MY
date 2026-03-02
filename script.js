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

function startCountdown(timings) {
    const prayers = [
        {name:"Fajr", time: timings.Fajr},
        {name:"Dhuhr", time: timings.Dhuhr},
        {name:"Asr", time: timings.Asr},
        {name:"Maghrib", time: timings.Maghrib},
        {name:"Isha", time: timings.Isha}
    ];

    function updateCountdown() {
        const now = new Date();
        const currentMinutes = now.getHours()*60 + now.getMinutes();

        for (let p of prayers) {
            let [h,m] = p.time.split(":");
            let prayerMinutes = parseInt(h)*60 + parseInt(m);

            if (prayerMinutes > currentMinutes) {
                let diff = prayerMinutes - currentMinutes;
                let hours = Math.floor(diff/60);
                let mins = diff%60;
                document.getElementById("countdown").innerText =
                    "Next Prayer: " + p.name + " in " + hours + "h " + mins + "m";
                break;
            }
        }
    }

    updateCountdown();
    setInterval(updateCountdown,60000);
}

