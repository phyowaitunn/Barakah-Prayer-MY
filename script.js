// Splash
setTimeout(()=>{
    document.getElementById("splash").style.display="none";
},2000);

// Sidebar
function toggleMenu(){
    const sidebar=document.getElementById("sidebar");
    sidebar.style.left = sidebar.style.left==="0px" ? "-250px":"0px";
}

// Page Switch
function showPage(id){
    document.querySelectorAll(".page").forEach(p=>p.classList.remove("active-page"));
    document.getElementById(id).classList.add("active-page");
    toggleMenu();
}

// Load Prayer Times
async function loadPrayerTimes(){
    const res = await fetch("https://api.aladhan.com/v1/timingsByCity?city=Kuala Lumpur&country=Malaysia&method=3");
    const data = await res.json();
    const t = data.data.timings;

    document.getElementById("fajr").innerText=t.Fajr;
    document.getElementById("dhuhr").innerText=t.Dhuhr;
    document.getElementById("asr").innerText=t.Asr;
    document.getElementById("maghrib").innerText=t.Maghrib;
    document.getElementById("isha").innerText=t.Isha;

    document.getElementById("gregorianDate").innerText=data.data.date.gregorian.date;
    document.getElementById("hijriDate").innerText=data.data.date.hijri.date+" AH";

    startCountdown(t);
    checkAzan(t);
}

// Countdown
function startCountdown(timings){
    function update(){
        const now=new Date();
        const current=now.getHours()*60+now.getMinutes();

        const prayers=[
            {name:"Fajr",time:timings.Fajr},
            {name:"Dhuhr",time:timings.Dhuhr},
            {name:"Asr",time:timings.Asr},
            {name:"Maghrib",time:timings.Maghrib},
            {name:"Isha",time:timings.Isha}
        ];

        for(let p of prayers){
            let [h,m]=p.time.split(":");
            let minutes=parseInt(h)*60+parseInt(m);
            if(minutes>current){
                let diff=minutes-current;
                let h2=Math.floor(diff/60);
                let m2=diff%60;
                document.getElementById("countdown").innerText=
                    "Next: "+p.name+" in "+h2+"h "+m2+"m";
                break;
            }
        }
    }
    update();
    setInterval(update,60000);
}

// Azan
function checkAzan(timings){
    setInterval(()=>{
        const now=new Date();
        const current=now.getHours()+":"+String(now.getMinutes()).padStart(2,"0");

        Object.values(timings).forEach(time=>{
            if(current===time){
                new Audio("azan.mp3").play();
            }
        });
    },60000);
}

// Service Worker
if("serviceWorker" in navigator){
    navigator.serviceWorker.register("service-worker.js");
}

loadPrayerTimes();
