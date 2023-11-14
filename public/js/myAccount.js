const myAccountButton = document.querySelector(".myAccount");
// console.log(myAccountButton);
myAccountButton.addEventListener("click", async (event) => {
  let res = await fetch("/user");
  let result = await res.json();

  console.log(result);

  if (!result.username) {
    // localStorage.setItem("beforeLogin", location.href);
    location.href = `/user.html?next=${location.href}`;
    return;
  }

  location.href = `/userBookingRecordPage.html`;
});
