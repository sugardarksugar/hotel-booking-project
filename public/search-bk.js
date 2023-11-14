// let facArr = ['gym','pool','wifi','spa']

//  let facArr = [];
//   for(let v in dataObj.result[0]){
//     typeof dataObj.result[0][v] == "boolean" && facArr.push(v)
//   }

//   console.log(facArr);

// should be inside window.onload
const searchParams = new URLSearchParams(location.search);

//getting info from URL and put them into a variable which I can use them later
const locationPath = searchParams.get("location");
const date = searchParams.get("date");
const nor = searchParams.get("nor");

//making a map for facility logo
let fac = {
    gym: '<i class="fa-solid fa-dumbbell" id="gym"></i>',
    pool: '<i class="fa-solid fa-person-swimming" id="pool"></i>',
    spa: '<i class="fa-solid fa-spa" id="spa"></i>',
    wifi: '<i class="fa-solid fa-wifi" id="wifi"></i>',
};

//making a function which can show data from DB when the slide is on load
window.onload = async () => {
    let data = await loadData();

    createHotelCard(data)
    createMap(data)
};

async function loadData() {
    const res = await fetch("/searchHotel", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formObject),
    });

    //waiting feedback from DB. And when the data is backed, put it in a variable called 'dataObj'
    const dataObj = await res.json();
    console.log(dataObj.result);

    return dataObj.result
}

function createHotelCard(result) {
    //start using array got from DB, and loop it to get different hotels
    //Also loop the logo to put it inside the hotel info
    //Finally, use innerHTML to write hotel info in frontend
    const hotelCard = document.querySelector(".result");
    let str = "";
    for (let v of result) {
        let logoStr = ``;

        for (let key in fac) {
            if (v[key] == true) {
                logoStr += fac[key];
            }
        }

        if (+v.available_room - nor >= 0) {
            str += `
      <div class="hotel-card">
              <img class="part1" src="hotel.png">
  
              <div class="part2">
                  <h4>${v.hotel_name}</h4>
                  <div> ${v.level ? v.level + "stars" : "Unrated"}</div>
                  <div>Address: <i>${v.address}</i></div>
                  <div>${logoStr}</div>
              </div>
              
              <div class="part3">
                  <div class="fs-1">HKD ${v.price}</div>
                  <a href="/post.html?id=${v.id}"><button class="detail-btn" id="detail@${v.id}">View Detail</button></a>
              </div>
          </div>
      `;
        }

        console.log(str);
        hotelCard.innerHTML = str;

    }

    // return result
}

function createMap(result) {
    //creating map
    let map = L.map("map");
    map.setView([result[0].x, result[0].y], 15);
    //set marker for the map

    for (let v of result) {
        try {
            L.marker([v.x, v.y]).addTo(map);
        } catch (error) {
            console.log(error);
        }
    }

    //apply 'earth map' to the map
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
}


let topReviewBtn = document.querySelector('#topReviewBtn')
let dlghBtn = document.querySelector('#dlghBtn')
let lowestPriceBtn = document.querySelector('#lowestPriceBtn')
let dllmBtn = document.querySelector('#dllmBtn')
let mostStarsBtn = document.querySelector('#mostStarsBtn')

topReviewBtn.addEventListener('click', () => { })
dlghBtn.addEventListener('click', () => { })
lowestPriceBtn.addEventListener('click', () => { })
dllmBtn.addEventListener('click', () => { })
mostStarsBtn.addEventListener('click', () => { })
-----------------------------------------------------------------------------
// let facArr = ['gym','pool','wifi','spa']

//  let facArr = [];
//   for(let v in dataObj.result[0]){
//     typeof dataObj.result[0][v] == "boolean" && facArr.push(v)
//   }

//   console.log(facArr);

//making a map for facility logo
let fac = {
    gym: '<i class="fa-solid fa-dumbbell" id="gym"></i>',
    pool: '<i class="fa-solid fa-person-swimming" id="pool"></i>',
    spa: '<i class="fa-solid fa-spa" id="spa"></i>',
    wifi: '<i class="fa-solid fa-wifi" id="wifi"></i>',
  };
  
  //making a function which can show data from DB when the slide is on load
  window.onload = async () => {
    // should be inside window.onload
    const searchParams = new URLSearchParams(location.search);
  
    //getting info from URL and put them into a variable which I can use them later
    const locationPath = searchParams.get("location");
    const date = searchParams.get("date");
    const nor = searchParams.get("nor");
  
    console.log(locationPath, date, nor);
  
    //make a object so that I can put info inside and send it to backend
    let formObject = {
      location: locationPath,
      date: date,
      numberOfRoom: nor,
    };
  
    //this is the method I used to push data to backend
    const res = await fetch("/searchHotel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formObject),
    });
  
    //waiting feedback from DB. And when the data is backed, put it in a variable called 'dataObj'
    const dataObj = await res.json();
    console.log(dataObj.result);
  
    let map = L.map("map");
    map.setView([dataObj.result[0].x, dataObj.result[0].y], 15);
  
    //start using array got from DB, and loop it to get different hotels
    //Also loop the logo to put it inside the hotel info
    //Finally, use innerHTML to write hotel info in frontend
    const hotelCard = document.querySelector(".result");
    let str = "";
    for (let v of dataObj.result) {
      let logoStr = ``;
  
      for (let key in fac) {
        if (v[key] == true) {
          logoStr += fac[key];
        }
      }
  
      if (+v.available_room - nor >= 0) {
        str += `
      <div class="hotel-card">
              <img class="part1" src="hotel.png">
  
              <div class="part2">
                  <h4>${v.hotel_name}</h4>
                  <div> ${v.level ? v.level + "stars" : "Unrated"}</div>
                  <div>Address: <i>${v.address}</i></div>
                  <div>${logoStr}</div>
              </div>
              
              <div class="part3">
                  <div class="fs-1">HKD ${v.price}</div>
                  <a href="/post.html?id=${
                    v.id
                  }"><button class="detail-btn" id="detail@${
          v.id
        }">View Detail</button></a>
              </div>
          </div>
      `;
      }
  
      console.log(str);
  
      //set marker for the map
      try {
        L.marker([v.x, v.y]).addTo(map);
      } catch (error) {
        console.log(error);
      }
    }
    //apply 'earth map' to the map
    hotelCard.innerHTML = str;
  
  
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
  };
  //  let facArr = [];
  //   for(let v in dataObj.result[0]){
  //     typeof dataObj.result[0][v] == "boolean" && facArr.push(v)
  //   }
  
  let topReviewBtn = document.querySelector("#topReviewBtn");
  let dlghBtn = document.querySelector("#dlghBtn");
  let lowestPriceBtn = document.querySelector("#lowestPriceBtn");
  let dllmBtn = document.querySelector("#dllmBtn");
  let mostStarsBtn = document.querySelector("#mostStarsBtn");
  
  topReviewBtn.addEventListener("click", () => {});
  dlghBtn.addEventListener("click", () => {});
  lowestPriceBtn.addEventListener("click", () => {});
  dllmBtn.addEventListener("click", () => {});
  mostStarsBtn.addEventListener("click", () => {});
  