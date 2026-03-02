setTimeout(()=>splash.style.display="none",2000);

function toggleMenu(){
sidebar.style.left=
sidebar.style.left==="0px"?"-250px":"0px";
}

function showPage(id){
document.querySelectorAll(".page")
.forEach(p=>p.classList.remove("active"));
document.getElementById(id).classList.add("active");
toggleMenu();
}

function toggleTheme(){
document.body.classList.toggle("dark");
}

function clean(t){return t.split(" ")[0];}

// STATE CHANGE
stateSelect.onchange=loadPrayer;

async function loadPrayer(){

let city=stateSelect.value;

const res=await fetch(
`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Malaysia&method=3`
);

const data=await res.json();
const t=data.data.timings;

fajr.innerText=clean(t.Fajr);
dhuhr.innerText=clean(t.Dhuhr);
asr.innerText=clean(t.Asr);
maghrib.innerText=clean(t.Maghrib);
isha.innerText=clean(t.Isha);

gregorianDate.innerText=data.data.date.gregorian.date;
hijriDate.innerText=data.data.date.hijri.date+" AH";

highlightPrayer(t);
countdown(t);
azanCheck(t);
getQibla();
}

// Highlight Prayer
function highlightPrayer(t){

document.querySelectorAll(".card")
.forEach(c=>c.classList.remove("activePrayer"));

let now=new Date();
let cur=now.getHours()*60+now.getMinutes();

Object.entries(t).forEach(([name,time])=>{
let [h,m]=clean(time).split(":");
let mins=h*60+ +m;

if(cur>=mins){
let card=document.getElementById(name+"Card");
if(card)card.classList.add("activePrayer");
}
});
}

// Countdown
function countdown(t){
setInterval(()=>{
let now=new Date();
let cur=now.getHours()*60+now.getMinutes();

for(let [name,time] of Object.entries(t)){
let [h,m]=clean(time).split(":");
let mins=h*60+ +m;

if(mins>cur){
let d=mins-cur;
countdown.innerText=
`Next: ${name} in ${Math.floor(d/60)}h ${d%60}m`;
break;
}
}
},1000);
}

// Azan
function azanCheck(t){
setInterval(()=>{
let now=new Date();
let cur=now.getHours()+":"+
String(now.getMinutes()).padStart(2,"0");

Object.values(t).forEach(time=>{
if(cur===clean(time))
new Audio("azan.mp3").play();
});
},60000);
}

// QIBLA
function getQibla(){
navigator.geolocation.getCurrentPosition(pos=>{
let lat=pos.coords.latitude*Math.PI/180;
let lon=pos.coords.longitude*Math.PI/180;

let kaabaLat=21.4225*Math.PI/180;
let kaabaLon=39.8262*Math.PI/180;

let angle=Math.atan2(
Math.sin(kaabaLon-lon),
Math.cos(lat)*Math.tan(kaabaLat)
-Math.sin(lat)*Math.cos(kaabaLon-lon)
);

angle=angle*180/Math.PI;

compass.style.transform=
`rotate(${angle}deg)`;

qiblaAngle.innerText=
"Direction: "+angle.toFixed(2)+"°";
});
}

// Offline PWA
if("serviceWorker" in navigator){
navigator.serviceWorker.register("service-worker.js");
}

loadPrayer();
