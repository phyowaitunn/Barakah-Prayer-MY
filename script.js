// Detect user location automatically
function getLocationAndLoad() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            loadPrayerTimes(lat, lon);
        }, () => {
            // If user blocks location → default Kuala Lumpur
            loadPrayerTimes(3.1390, 101.6869);
        });
    } else {
        loadPrayerTimes(3.1390, 101.6869);
    }
}

async function loadPrayerTimes(lat, lon) {
    try {
        const today = new Date();
        const date = `${today.getDate()}-${today.getMonth()+1}-${today.getFullYear()}`;

        const response = await fetch(
            `https://api.aladhan.com/v1/timings/${date}?latitude=${lat}&longitude=${lon}&method=3`
        );

        const result = await response.json();

        const timings = result.data.timings;

        // Set Prayer Times
        document.getElementById("fajr").innerText = timings.Fajr;
        document.getElementById("dhuhr").innerText = timings.Dhuhr;
        document.getElementById("asr").innerText = timings.Asr;
        document.getElementById("maghrib").innerText = timings.Maghrib;
        document.getElementById("isha").innerText = timings.Isha;

        // Set Dates
        document.getElementById("gregorianDate").innerText =
            result.data.date.gregorian.date;

        document.getElementById("hijriDate").innerText =
            result.data.date.hijri.date + " AH";

        highlightCurrentPrayer(timings);

    } catch (error) {
        console.error("API ERROR:", error);
    }
}

function highlightCurrentPrayer(timings) {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const prayers = [
        { name: "fajr", time: timings.Fajr },
        { name: "dhuhr", time: timings.Dhuhr },
        { name: "asr", time: timings.Asr },
        { name: "maghrib", time: timings.Maghrib },
        { name: "isha", time: timings.Isha }
    ];

    prayers.forEach(prayer => {
        const [hour, minute] = prayer.time.split(":");
        const prayerMinutes = parseInt(hour) * 60 + parseInt(minute);

        if (currentTime >= prayerMinutes) {
            document.getElementById(prayer.name)
                .parentElement.classList.add("active");
        }
    });
}

// Start app
getLocationAndLoad();
