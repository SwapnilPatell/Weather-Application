
const apiKey = "2a7c71466ff1b13306be4a418f7c6481";



let chart


function getWeather(){

let city=document.getElementById("cityInput").value

fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)

.then(res=>res.json())

.then(data=>{

document.getElementById("cityName").innerText=data.name
document.getElementById("temp").innerText=data.main.temp+" °C"
document.getElementById("desc").innerText=data.weather[0].description

document.getElementById("humidity").innerText=data.main.humidity+" %"
document.getElementById("wind").innerText=data.wind.speed+" km/h"
document.getElementById("pressure").innerText=data.main.pressure+" hPa"
document.getElementById("feels").innerText=data.main.feels_like+" °C"

document.getElementById("weatherIcon").src=
`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`

saveRecent(city)

getForecast(city)

})

}



function getForecast(city){

fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)

.then(res=>res.json())

.then(data=>{

let forecast=document.getElementById("forecast")
forecast.innerHTML=""

let uniqueDates={}
let labels=[]
let temps=[]

data.list.forEach(item=>{

let date=item.dt_txt.split(" ")[0]

if(!uniqueDates[date]){

uniqueDates[date]=item
labels.push(date)
temps.push(item.main.temp)

}

})

let days=Object.values(uniqueDates).slice(0,7)

days.forEach(item=>{

let date=item.dt_txt.split(" ")[0]

let card=document.createElement("div")

card.className="forecastCard"

card.innerHTML=`

<h4>${date}</h4>
<img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png">
<p>${item.main.temp} °C</p>

`

card.onclick=()=>openModal(item)

forecast.appendChild(card)

})

createGraph(labels,temps)

})

}



function openModal(item){

document.getElementById("forecastModal").style.display="flex"

document.getElementById("modalDate").innerText=item.dt_txt
document.getElementById("modalTemp").innerText=item.main.temp+" °C"
document.getElementById("modalDesc").innerText=item.weather[0].description
document.getElementById("modalHumidity").innerText=item.main.humidity+" %"
document.getElementById("modalWind").innerText=item.wind.speed+" km/h"
document.getElementById("modalPressure").innerText=item.main.pressure+" hPa"

document.getElementById("modalIcon").src=
`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`

}


function closeModal(){

document.getElementById("forecastModal").style.display="none"

}



function createGraph(labels,temps){

let ctx=document.getElementById("chart")

if(chart){
chart.destroy()
}

chart=new Chart(ctx,{

type:"line",

data:{
labels:labels,

datasets:[{
label:"Temperature °C",

data:temps,

borderColor:"#ff9800",

backgroundColor:"rgba(255,152,0,0.3)",

fill:true,

tension:0.4,

pointRadius:5
}]

},

options:{
responsive:true,

plugins:{
legend:{
labels:{color:"white"}
}
},

scales:{
x:{
ticks:{color:"white"}
},
y:{
ticks:{color:"white"}
}
}

}

})

}



function toggleDark(){

document.body.classList.toggle("dark")

}



function saveRecent(city){

let li=document.createElement("li")

li.innerText=city

li.onclick=()=>{

document.getElementById("cityInput").value=city

getWeather()

}

document.getElementById("recentList").appendChild(li)

}



function getLocationWeather(){

navigator.geolocation.getCurrentPosition(pos=>{

let lat=pos.coords.latitude
let lon=pos.coords.longitude

fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)

.then(res=>res.json())

.then(data=>{

document.getElementById("cityInput").value=data.name
getWeather()

})

})

}



setInterval(()=>{

document.getElementById("clock").innerText=
new Date().toLocaleTimeString()

},1000)