async function getUserName() {
  let logInUserRes = await fetch("/user");
  let LogInUserInfo = await logInUserRes.json();
  let userElement = document.querySelector(".userInfo");
  console.log("LogInUserInfo.username:", LogInUserInfo.username);
  userElement.textContent = LogInUserInfo.username + " Booking Record:";
}

getUserName();

async function cancelBooking(id) {
  let res = await fetch(`/bookingRecord/cancelbooking`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: id }),
  });

  let result = await res.json();
}

async function UserBookingRecord() {
  let UserBookingRecordRes = await fetch("/bookingRecord");
  let result = await UserBookingRecordRes.json();
  const userBookedRecord = document.querySelector(".userBookingInfoBox");
  console.log("result:", result);
  if (result.admin === false) {
    userBookedRecord.innerHTML = ` 
    <tr>
        <th>Hotel Name</th>
        <th>Booking Date</th>
        <th>Payment</th>
        <th>status</th>
        <th></th>
    </tr>`;
    let bookedHotel = ``;
    for (let i of result.allBookedHotel) {
      console.log("result.allBookedHotel:", result.allBookedHotel);
      bookedHotel += `
            <tr>          
                <th>${i.hotel_name}</th>
                <th>${i.checkin_date}</th>  
                <th>${i.price}</th>     
                <th>${i.status}</th> 
            <th>
                <div style="text-align: right">
                <button id="${
                  "adj@" + i.id
                }" class="cancelBookingBtn">Cancel Booking</button>
                </div>
            </th>
            </tr>`;
    }
    userBookedRecord.innerHTML += bookedHotel;
  }
  if (result.admin === true) {
    userBookedRecord.innerHTML = ` 
    <tr>
        <th>Customer Name</th>
        <th>Booking Date</th>
        <th>Status</th>
        <th>Payment</th>

    </tr>`;
    let bookedHotel = ``;
    for (i of result.findHotelAdminNotification) {
      bookedHotel += `
        <tr>          
            <th>${i.username}</th>
            <th>${i.checkin_date}</th>  
            <th>${i.status}</th>
            <th>${i.price}</th>      
        </tr>`;
    }
    userBookedRecord.innerHTML += bookedHotel;
  }
}
async function addDeleteEvent() {
  const cancelBookingBtnArray = document.querySelectorAll(".cancelBookingBtn");
  console.log(cancelBookingBtnArray);
  for (let i of cancelBookingBtnArray) {
    i.addEventListener("click", async () => {
      const deleteId = i.id.split("@")[1];
      await cancelBooking(deleteId);
      initAll();
    });
  }
}
async function initAll() {
  await UserBookingRecord();
  addDeleteEvent();
}
window.onload = async () => {
  initAll();
};
