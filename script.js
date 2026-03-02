const city = "Kuala Lumpur";
const country = "Malaysia";

function formatTime(time) {
    return time.split(" ")[0];
}

async function loadPrayerTimes() {
    try {
        const response = await fetch(
            `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=11`
        );

        const result = await response.json();

        if (!result.data) {
            throw new Error("Invalid API response");
        }

        const timings = result.data.timings;

        document.getElementById("fajr").innerText = formatTime(timings.Fajr);
        document.getElementById("dhuhr").innerText = formatTime(timings.Dhuhr);
        document.getElementById("asr").innerText = formatTime(timings.Asr);
        document.getElementById("maghrib").innerText = formatTime(timings.Maghrib);
        document.getElementById("isha").innerText = formatTime(timings.Isha);

        document.getElementById("gregorianDate").innerText =
            "Gregorian: " + result.data.date.gregorian.date;

        document.getElementById("hijriDate").innerText =
            "Hijri: " + result.data.date.hijri.date;

    } catch (error) {
        console.error("API ERROR:", error);
        alert("Prayer API failed. Check console.");
    }
}

window.onload = loadPrayerTimes;
