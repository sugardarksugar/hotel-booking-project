const box = document.querySelector("#box");

loadHotel = async () => {
  let res = await fetch("Demo_findHotelDetail");
  let hotelDetail = await res.json();
  //   console.log(hotelDetail);
  return hotelDetail;
};

window.onload = async () => {
  let hotelDetail = await loadHotel();
  let str = ``;
  for (let hotel of hotelDetail) {
    str += `
    <h4>            
    <a href="/Post.html?id=${hotel.id}" class="hotel">
                    ${hotel.hotel_name}
                </a>
                </h4>
            `;
  }
  box.innerHTML = str;
};
