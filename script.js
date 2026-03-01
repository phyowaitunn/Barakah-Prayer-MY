async function loadSurahList() {
    try {
        const response = await fetch("https://api.aladhan.com/v1");
        const data = await response.json();

        const surahs = data.data.surahs.references;

        let html = "<select id='surahSelect'>";
        surahs.forEach(surah => {
            html += `<option value="${surah.number}">
                ${surah.number}. ${surah.englishName}
            </option>`;
        });

        html += "</select> <button onclick='loadSurah()'>Load</button>";

        document.getElementById("surahList").innerHTML = html;

    } catch (error) {
        console.error("Surah list error:", error);
    }
}

async function loadSurah() {
    const number = document.getElementById("surahSelect").value;

    const response = await fetch(
        `https://api.aladhan.com/v1/surah/${number}`
    );

    const data = await response.json();

    let text = "";
    data.data.ayahs.forEach(a => {
        text += a.numberInSurah + ". " + a.text + "<br><br>";
    });

    document.getElementById("quranText").innerHTML = text;
}

