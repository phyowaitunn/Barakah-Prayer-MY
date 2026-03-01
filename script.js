const KAABA_LAT = 21.4225;
const KAABA_LON = 39.8262;

const prayerNames = ["Fajr","Dhuhr","Asr","Maghrib","Isha"];

function loadPrayerTimes(lat, lon) {
    fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=11`)
    .then(res=>res.json())
    .then(data=>{
        const timings = data.data.timings;

        let html="";
        prayerNames.forEach(name=>{
            html+=`
            <div class="card">
                <h3>${name}</h3>
                <p id="${name}">${timings[name]}</p>
            </div>`;
        });

        document.getElementById("prayerContainer").innerHTML=html;

        document.getElementById("gregorianDate").innerText =
            "Gregorian: "+data.data.date.gregorian.date;

        document.getElementById("hijriDate").innerText =
            "Hijri: "+data.data.date.hijri.date;
    });
}

function calculateQibla(lat, lon){
    const dLon=(KAABA_LON-lon)*Math.PI/180;
    const y=Math.sin(dLon)*Math.cos(KAABA_LAT*Math.PI/180);
    const x=Math.cos(lat*Math.PI/180)*Math.sin(KAABA_LAT*Math.PI/180)
      -Math.sin(lat*Math.PI/180)*Math.cos(KAABA_LAT*Math.PI/180)*Math.cos(dLon);
    let brng=Math.atan2(y,x)*180/Math.PI;
    brng=(brng+360)%360;
    document.getElementById("qiblaDirection").innerText=
      brng.toFixed(2)+"° from North";
}

function loadSurahList(){
    fetch("https://api.aladhan.com/v1/surah")
    .then(res=>res.json())
    .then(data=>{
        let html="<select id='surahSelect'>";
        data.data.forEach(s=>{
            html+=`<option value="${s.number}">${s.number}. ${s.englishName}</option>`;
        });
        html+="</select> <button onclick='loadSurah()'>Load</button>";
        document.getElementById("surahList").innerHTML=html;
    });
}

function loadSurah(){
    const num=document.getElementById("surahSelect").value;
    fetch(`https://api.aladhan.com/v1/surah/${num}`)
    .then(res=>res.json())
    .then(data=>{
        let text="";
        data.data.ayahs.forEach(a=>{
            text+=a.numberInSurah+". "+a.text+"<br><br>";
        });
        document.getElementById("quranText").innerHTML=text;
    });
}

function init(){
    navigator.geolocation.getCurrentPosition(pos=>{
        const lat=pos.coords.latitude;
        const lon=pos.coords.longitude;

        document.getElementById("location").innerText=
            "Lat:"+lat.toFixed(2)+" Lon:"+lon.toFixed(2);

        loadPrayerTimes(lat,lon);
        calculateQibla(lat,lon);
    });
    loadSurahList();
}

document.getElementById("themeToggle").onclick=()=>{
    document.body.classList.toggle("dark");
}


window.onload=init;
