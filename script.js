// Splash
setTimeout(()=>{
document.getElementById("splash").style.display="none";
},2000);

// Sidebar
function toggleMenu(){
let s=document.getElementById("sidebar");
s.style.left=s.style.left==="0px"?"-250px":"0px";
}

function showPage(id){
document.querySelectorAll(".page")
.forEach(p=>p.classList.remove("active"));
document.getElementById(id).classList.add("active");
toggleMenu();
}

// Clean API Time
function clean(t){
return t.split(" ")[0];
}

// Load Prayer API
async function loadPrayer(){

const res=await fetch(
"https://api.aladhan.com/v1/timingsByCity?city=Kuala Lumpur&country=Malaysia&method=3"
);

const data=await res.json();
const t=data.data.timings;

document.getElementById("fajr").innerText=clean(t.Fajr);
document.getElementById("dhuhr").innerText=clean(t.Dhuhr);
document.getElementById("asr").innerText=clean(t.Asr);
document.getElementById("maghrib").innerText=clean(t.Maghrib);
document.getElementById("isha").innerText=clean(t.Isha);

document.getElementById("gregorianDate").innerText=
data.data.date.gregorian.date;

document.getElementById("hijriDate").innerText=
data.data.date.hijri.date+" AH";

countdown(t);
azanCheck(t);
}

// Countdown
function countdown(t){

const prayers=[
["Fajr",clean(t.Fajr)],
["Dhuhr",clean(t.Dhuhr)],
["Asr",clean(t.Asr)],
["Maghrib",clean(t.Maghrib)],
["Isha",clean(t.Isha)]
];

function update(){

let now=new Date();
let current=now.getHours()*60+now.getMinutes();

for(let p of prayers){
let [h,m]=p[1].split(":");
let mins=h*60+ +m;

if(mins>current){
let diff=mins-current;
document.getElementById("countdown").innerText=
`Next Prayer: ${p[0]} in ${Math.floor(diff/60)}h ${diff%60}m`;
break;
}
}
}

update();
setInterval(update,1000);
}

// Azan
function azanCheck(t){
setInterval(()=>{
let now=new Date();
let cur=now.getHours()+":"+String(now.getMinutes()).padStart(2,"0");

Object.values(t).forEach(time=>{
if(cur===clean(time)){
new Audio("azan.mp3").play();
}
});
},60000);
}

// PWA
if("serviceWorker" in navigator){
navigator.serviceWorker.register("service-worker.js");
}

loadPrayer();
