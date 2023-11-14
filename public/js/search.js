// let facArr = ['gym','pool','wifi','spa']

//  let facArr = [];
//   for(let v in dataObj.result[0]){
//     typeof dataObj.result[0][v] == "boolean" && facArr.push(v)
//   }

// should be inside window.onload
const searchParams = new URLSearchParams(location.search);

//getting info from URL and put them into a variable which I can use them later
const locationPath = searchParams.get("location");
const date = searchParams.get("date");
const nor = searchParams.get("nor");

//make an object so that I can put info inside and send it to backend
let formObject = {
  location: locationPath,
  date: date,
  numberOfRoom: nor,
};

//making a map for facility icon
let fac = {
  gym: '<i class="fa-solid fa-dumbbell" id="gym"></i>',
  pool: '<i class="fa-solid fa-person-swimming" id="pool"></i>',
  spa: '<i class="fa-solid fa-spa" id="spa"></i>',
  wifi: '<i class="fa-solid fa-wifi" id="wifi"></i>',
};

//making a function which can show data from DB when the slide is on load
window.onload = async () => {
  let data = await loadData();

  initMap(data);
  createHotelCard(data);
  createMap(data);
};

//this function is to send a request to backend to get data from DB
async function loadData(orderByWhat = "", DESC = "") {
  let query = orderByWhat ? `?order=${orderByWhat}` : ``;
  let query2 = DESC ? `${query} + ${DESC}` : ``;

  const res = await fetch("/searchHotel" + query2, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formObject),
  });

  //waiting feedback from DB. And when the data is backed, put it in a variable called 'dataObj'
  const dataObj = await res.json();
  console.log(dataObj.result);

  return dataObj.result;
}

//this function is to create hotel card
//Start from using array got from DB, and loop it to get different hotels
//Also loop the logo to put it inside the hotel info
//Finally, use innerHTML to write hotel info in frontend
function createHotelCard(result) {
  const hotelCard = document.querySelector(".result");

  let str = "";
  for (let v of result) {
    console.log(v);

    let logoStr = ``;
    for (let key in fac) {
      if (v[key] == true) {
        logoStr += fac[key];
      }
    }

    if (+v.available_room - nor >= 0) {
      str += `
      <div class="hotel-card" id="hotelCard${v.id}">
              <img class="part1" src="res/hotel${
                v.id
              }.jpeg" alt="loading image">
  
              <div class="part2">
                  <h4>${v.hotel_name}</h4>
                  <div> ${v.level ? v.level + "stars" : "Unrated"}</div>
                  <div>Address: <i>${v.address}</i></div>
                  <div>${logoStr}</div>
              </div>
              
              <div class="part3">
                  <div class="fs-1">HKD ${v.price}</div>
                  <div>Available Room: ${v.available_room}</div>
                  <a href="/post.html?id=${
                    v.id
                  }&date=${date}&nor=${nor}"><button class="detail-btn" id="detail@${
        v.id
      }">View Detail</button></a>
              </div>
          </div>
      `;
    }

    // console.log(str);

    // let popUps = document.querySelectorAll(`.hotel-card`)
    // for (let popUp of popUps){
    //     popUp.addEventListener('mouseover',()=>{
    //       console.log("fuck you")
    //       L.marker([v.x , v.y])
    //       .bindPopup(`<div>${v.hotel_name}</div><div>HKD${v.price}</div>`)
    //       .openPopup()
    //   })
    // }
  }
  hotelCard.innerHTML = str;
  // return result
}

let map;
let markerGroup;
//this function is to create a map
function initMap(result) {
  map = L.map("map");
  map.setView([result[0].x, result[0].y], 15);
}

//this function is to set layer and marker on the map
function createMap(result) {
  markerGroup && markerGroup.clearLayers();
  markerGroup = L.layerGroup().addTo(map);

  //set marker for the map
  for (let v of result) {
    try {
      L.marker([v.x, v.y])
        .bindPopup(
          `<div><img src="res/hotel${v.id}.jpeg" alt="loading image" width="200" height="100"></div>
        <div>${v.hotel_name}</div>
        <div>HKD${v.price}</div>`
        )
        .on("mouseover", function (e) {
          this.openPopup();
        })
        .addTo(markerGroup)
        .on("mouseout", function (e) {
          this.closePopup();
        });
    } catch (error) {
      console.log(error);
    }
  }
  // for (let v of result) {
  //     try {
  //         L.marker([v.x, v.y])
  //         .bindPopup(`<div>${v.hotel_name}</div><div>HKD${v.price}</div>`)
  //         .openPopup()
  //         .addTo(map);
  //     } catch (error) {
  //         console.log(error);
  //     }
  // }

  //apply 'earth map' to the map
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
}

// async function popUp (){
//     let arr = await loadData();
//     for (let v of arr){
//         let hotelCard = document.querySelector(`#hotelCard@${v.id}`)
//     hotelCard.addEventListener('mouseover',()=>{
//         console.log("fuck you")
//         // L.marker([v.x , v.y])
//         // .bindPopup(`<div>${v.hotel_name}</div><div>HKD${v.price}</div>`)
//         // .openPopup()
//     })
//     }
// }
// popUp()

//make some querySelector to order those hotels
let topReviewBtn = document.querySelector("#topReviewBtn");
let allBtn = document.querySelector("#allBtn");
let lowestPriceBtn = document.querySelector("#lowestPriceBtn");
let dllmBtn = document.querySelector("#dllmBtn");
let mostStarsBtn = document.querySelector("#mostStarsBtn");

// topReviewBtn.addEventListener("click", async () => {
//     let res = await loadData("review");
//     let result = res.json()
// });

allBtn.addEventListener("click", async () => {
  let data = await loadData("id", "ASC");
  createHotelCard(data);
});

lowestPriceBtn.addEventListener("click", async () => {
  let data = await loadData("price", "ASC");
  createHotelCard(data);
});

// dllmBtn.addEventListener("click", async () => {
//     let res = await fetch('/order?sort=dllm')
//     let result = res.json()
// });

mostStarsBtn.addEventListener("click", async () => {
  let data = await loadData("level", "DESC");
  createHotelCard(data);
});

document.querySelector("#location").value = locationPath;
document.querySelector("#date").value = date;
document.querySelector("#numberOfRoom").value = nor;

let searchingBtn = document.querySelector(".search-btn");
searchingBtn.addEventListener("click", () => {
  let input = {};
  input["location"] = document.querySelector("#location").value;
  input["date"] = document.querySelector("#date").value;
  input["numberOfRoom"] = document.querySelector("#numberOfRoom").value;
  location.href = `/search.html?location=${input["location"]}&date=${input["date"]}&nor=${input["numberOfRoom"]}`;
});

//---------------------Filter BY Price---------------------------------------------
let priceMap = {
  price0: false,
  price200: false,
  price400: false,
  price600: false,
  price800: false,
};

for (let i in priceMap) {
  const box = document.getElementById(i);
  box.addEventListener("input", () => {
    console.log(i);

    priceMap[i] = box.checked;
    console.log(box.checked);

    filterHotel();
  });
}

//this function is for filtering hotel when some conditions are being inputted
async function filterHotel() {
  let arr = await loadData();
  // console.log(arr);

  let isAnyTrue = false; // no tick
  for (let v in priceMap) {
    if (priceMap[v] === true) {
      isAnyTrue = true;
      break;
    }
  }

  if (!isAnyTrue) {
    createHotelCard(arr);
    createMap(arr);
    return;
  }

  let finalArr = [];

  for (let elementForNewArr of arr) {
    // console.log(elementForNewArr);

    let p = +elementForNewArr.price;
    if (p >= 0 && p <= 200 && priceMap["price0"]) {
      finalArr.push(elementForNewArr);
    } else if (p > 200 && p <= 400 && priceMap["price200"]) {
      finalArr.push(elementForNewArr);
    } else if (p > 400 && p <= 600 && priceMap["price400"]) {
      finalArr.push(elementForNewArr);
    } else if (p > 600 && p <= 800 && priceMap["price600"]) {
      finalArr.push(elementForNewArr);
    } else if (p > 800 && priceMap["price800"]) {
      finalArr.push(elementForNewArr);
    }
  }
  console.log("This is the finalArr: ", finalArr);
  createHotelCard(finalArr);
  createMap(finalArr);
}

//-----------------------Filter By Amenities------------------------------------------

let amenitiesMap = {
  wifiCheckBox: false,
  gymCheckBox: false,
  poolCheckBox: false,
  spaCheckBox: false,
};

for (let i in amenitiesMap) {
  const box = document.getElementById(i);
  box.addEventListener("input", () => {
    console.log(i);

    amenitiesMap[i] = box.checked;
    console.log(box.checked);

    filterHotelByAmenities();
  });
}

async function filterHotelByAmenities() {
  let arr = await loadData();

  let isAnyTrue = false; // no tick
  for (let v in amenitiesMap) {
    if (amenitiesMap[v] === true) {
      isAnyTrue = true;
      break;
    }
  }

  if (!isAnyTrue) {
    createHotelCard(arr);
    createMap(arr);
    return;
  }

  //   let finalArr = [];
  let map = new Map();
  for (let elementForNewArr of arr) {
    // console.log(elementForNewArr);

    let wifi = elementForNewArr.wifi;
    let gym = elementForNewArr.gym;
    let pool = elementForNewArr.pool;
    let spa = elementForNewArr.spa;

    if (wifi === true && amenitiesMap["wifiCheckBox"]) {
      map.set(elementForNewArr.hotel_name, elementForNewArr);
    }
    if (gym === true && amenitiesMap["gymCheckBox"]) {
      map.set(elementForNewArr.hotel_name, elementForNewArr);
    }
    if (pool === true && amenitiesMap["poolCheckBox"]) {
      map.set(elementForNewArr.hotel_name, elementForNewArr);
    }
    if (spa === true && amenitiesMap["spaCheckBox"]) {
      map.set(elementForNewArr.hotel_name, elementForNewArr);
    }
  }
  // console.log(map);

  let finalArr = Array.from(map).map((v) => v[1]);
  console.log(Array.from(map));
  createHotelCard(finalArr);
  createMap(finalArr);
}

//------------------------Filter By Stars------------------------------------------

let starMap = {
  "5stars": false,
  "4stars": false,
  "3stars": false,
  "2stars": false,
  "1star": false,
  unrated: false,
};

for (let i in starMap) {
  const box = document.getElementById(i);
  box.addEventListener("input", () => {
    console.log(i);

    starMap[i] = box.checked;
    console.log(box.checked);

    filterHotelByStar();
  });
}

async function filterHotelByStar() {
  let arr = await loadData();

  let isAnyTrue = false; // no tick
  for (let v in starMap) {
    if (starMap[v] === true) {
      isAnyTrue = true;
      break;
    }
  }

  if (!isAnyTrue) {
    createHotelCard(arr);
    createMap(arr);
    return;
  }

  let finalArr = [];
  for (let elementForNewArr of arr) {
    // console.log(a);

    let s = +elementForNewArr.level;
    console.log(s);
    if (s == 5 && starMap["5stars"]) {
      finalArr.push(elementForNewArr);
    } else if (s == 4 && starMap["4stars"]) {
      finalArr.push(elementForNewArr);
    } else if (s == 3 && starMap["3stars"]) {
      finalArr.push(elementForNewArr);
    } else if (s == 2 && starMap["2stars"]) {
      finalArr.push(elementForNewArr);
    } else if (s == 1 && starMap["1star"]) {
      finalArr.push(elementForNewArr);
    } else if (s == 0 && starMap["unrated"]) {
      finalArr.push(elementForNewArr);
    }

    console.log("This is the finalArr: ", finalArr);
    createHotelCard(finalArr);
    createMap(finalArr);
  }
}

//----------------------------Log In Button---------------------------------------------

async function getUserName() {
  let logInUserRes = await fetch("/user");
  let LogInUserInfo = await logInUserRes.json();
  let userElement = document.querySelector(".userinformation");

  if (!LogInUserInfo.username) {
    userElement.textContent = ``;
  } else {
    userElement.textContent = `Welcome back ${LogInUserInfo.username}`;
  }
}
getUserName();
