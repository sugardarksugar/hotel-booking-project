const searchingForm = document.querySelector("#searchingForm");

searchingForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // To prevent the form from submitting synchronously

  let formObject = {};

  formObject["location"] = searchingForm.location.value;
  formObject["date"] = searchingForm.date.value;
  formObject["numberOfRoom"] = searchingForm.numberOfRoom.value;

  location.href = `/search.html?location=${formObject["location"]}&date=${formObject["date"]}&nor=${formObject["numberOfRoom"]}`;
});

const myAccountButton = document.querySelector(".myAccount");

myAccountButton.addEventListener("click", async (event) => {
  let res = await fetch("/user");
  let result = await res.json();

  if (!result.username) {
    location.href = `/user.html`;
    return;
  }
  location.href = `/userBookingRecordPage.html`;
});

async function adminPage() {
  let res = await fetch("/user");
  let result = await res.json();
  console.log(result.username);
  if (result.super_admin) {
    admin.innerHTML = `<div><a href="/adminPage.html"><button class = "admin">Admin</button></a></div>`;
  }
}

adminPage();
