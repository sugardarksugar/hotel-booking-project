const searchParams = new URLSearchParams(location.search);
const searchId = searchParams.get("id");
console.log(location.search);
console.log(searchId);

// Getting the coordinate of Hotel

loadCoordinate = async (id) => {
  let res = await fetch(`/getCoordinate?id=${id}`);
  let result = await res.json();

  return result;
};
// Getting the information of Hotel
loadHotel = async (id) => {
  let res = await fetch(`/getHotelInformation?id=${id}`);
  let hotelInformation = await res.json();

  return hotelInformation;
};
// Getting  the Average Star of Hotel
loadAvgStar = async () => {
  let res = await fetch(`/getAvgHotelStar`, {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: searchId }),
  });

  let getHotelStar = await res.json();

  return getHotelStar;
};
// Getting the Review of Hotel
loadReviewer = async () => {
  let res = await fetch("/getReviewer", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: searchId }),
  });
  let getReviewer = await res.json();

  return getReviewer;
};
// Getting the All Star of Hotel
loadAllHotelStar = async (id) => {
  let res = await fetch(`/getAllHotelStar?id=${id}`);
  let getAllHotelStar = await res.json();

  return getAllHotelStar;
};
// Getting the Image of Hotel
loadHotelImage = async (id) => {
  let res = await fetch(`/getHotelImage?id=${id}`);
  let getHotelImage = await res.json();

  return getHotelImage;
};

window.onload = async () => {
  //Get the session of user
  let logInUserRes = await fetch("/user");
  let LogInUserInfo = await logInUserRes.json();
  console.log(LogInUserInfo);

  // Getting the Query of HTML
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  // Loading the function
  // console.log("mody is on9");
  let hotelInformation = await loadHotel(id);
  let hotelAvgStar = await loadAvgStar();
  let hotelReviewer = await loadReviewer();
  let hotelCoordinate = await loadCoordinate(id);
  let hotelAllHotelStar = await loadAllHotelStar(id);
  let hotelHotelImages = await loadHotelImage(id);

  // console.log("help me reemo");
  // adding the hotelImage in HTML
  for (let hotelHotelImage of hotelHotelImages) {
    hotelImage.innerHTML = `<img src="/res/${hotelHotelImage.image_name}">`;
  }
  // adding the hotelPrice and hotelName in HTML
  hotelPrice.textContent = `HKD$ ${hotelInformation[0].price}`;
  hotelName.textContent = `${hotelInformation[0].hotel_name}, `;
  // adding the hotelLevel in HTML
  if (hotelInformation[0].level == null) {
    hotelLevel.textContent = `Unrated `;
  } else {
    hotelLevel.textContent = `${hotelInformation[0].level} Stars`;
  }
  // adding hotelStar in HTML

  if (hotelAvgStar.length === 0) {
    hotelAvgStar.push({ avg: 0 });
  }
  console.log(hotelAvgStar);
  let hotelAvgStars = Math.round(+hotelAvgStar[0].avg * 10) / 10;

  hotelStar.textContent = `${hotelAvgStars}`;
  // adding hotelAddress in HTML
  hotelAddress.textContent = `Address: ${hotelInformation[0].address}`;
  // adding hotelReviewOfStar in HTML
  let star5 = ``;
  let star4 = ``;
  let star3 = ``;
  let star2 = ``;
  let star1 = ``;

  let starArr = [];
  for (let i = 0; i < 5; i++) {
    let s = "";
    for (let k = 5 - i; k > 0; k--) {
      s += "*";
    }
    starArr.push(s);
  }
  console.log(starArr);

  for (let i = 0; i < 5; i++) {
    star5 += `<i class="fa-solid fa-star"></i>`;
  }
  for (let i = 0; i < 4; i++) {
    star4 += `<i class="fa-solid fa-star"></i>`;
  }
  for (let i = 0; i < 3; i++) {
    star3 += `<i class="fa-solid fa-star"></i>`;
  }
  for (let i = 0; i < 2; i++) {
    star2 += `<i class="fa-solid fa-star"></i>`;
  }
  for (let i = 0; i < 1; i++) {
    star1 += `<i class="fa-solid fa-star"></i>`;
  }
  fiveStarOfHotelReviewer.innerHTML = `${star5}`;
  fourStarOfHotelReviewer.innerHTML = `${star4}`;
  threeStarOfHotelReviewer.innerHTML = `${star3}`;
  twoStarOfHotelReviewer.innerHTML = `${star2}`;
  oneStarOfHotelReviewer.innerHTML = `${star1}`;

  reviewOfFiveStar.textContent = `${hotelAllHotelStar["5"]} review`;
  reviewOfFourStar.textContent = `${hotelAllHotelStar["4"]} review`;
  reviewOfThreeStar.textContent = `${hotelAllHotelStar["3"]} review`;
  reviewOfTwoStar.textContent = `${hotelAllHotelStar["2"]} review`;
  reviewOfOneStar.textContent = `${hotelAllHotelStar["1"]} review`;
  if (hotelReviewer.length == 0) {
    hotelReviewer.push({ sum: 0 });
  }
  let hotelReviewers = hotelReviewer[0].sum;
  sumOfHotelReviewer.textContent = `(${hotelReviewers} Reviewer)`;
  // adding GYM in HTML
  if (hotelInformation[0].gym == false) {
    GYM001.remove();
  }
  // adding Pool in HTML
  if (hotelInformation[0].pool == false) {
    Pool001.remove();
  }
  // adding WIFI in HTML

  if (hotelInformation[0].wifi == false) {
    WIFI001.remove();
  }
  // adding SPA in HTML

  if (hotelInformation[0].spa == false) {
    SPA001.remove();
  }
  // adding map in HTML
  let map = L.map("map").setView(
    [hotelCoordinate[0].x, hotelCoordinate[0].y],
    18
  );
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
  let marker = L.marker([hotelCoordinate[0].x, hotelCoordinate[0].y]).addTo(
    map
  );
};

// add event for Post comment
let memoTemplate = document.querySelector(".memoContainer");
let memoList = document.querySelector(".container");

// Remove the Duplicate Comment
memoTemplate.remove();

async function loadmemo() {
  const searchParams = new URLSearchParams(location.search);
  const searchId = searchParams.get("id");
  let res = await fetch("/memo01", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ searchId: searchId }),
  });
  let memos = await res.json();

  return memos;
}

// Draw Post
async function drawPost() {
  memoList.textContent = "";

  const postHotelId = document.getElementById("hotel_id");

  let memos = await loadmemo();
  console.log(memos);

  let logInUserRes = await fetch("/user");
  let LogInUserInfo = await logInUserRes.json();
  console.log(LogInUserInfo.user_id);
  for (let i = 0; i < memos.length; i++) {
    let node = memoTemplate.cloneNode(true);

    node.querySelector(".member").textContent = memos[i].username;
    node.querySelector(".memo").textContent = memos[i].comment;
    node.querySelector(
      "#starpost"
    ).innerHTML = `<div>Review: ${memos[i].star} <i class="fa-solid fa-star"></i><div>`;
    node.querySelector(".delete").id = "delbtn@" + memos[i].comment_id;
    node.querySelector(".edit").id = "editbtn@" + memos[i].comment_id;

    memoList.appendChild(node);

    if (LogInUserInfo.super_admin) {
      continue;
    }
    if (
      !LogInUserInfo.username ||
      LogInUserInfo.users_id != memos[i].users_id
    ) {
      node.querySelector(".delete").remove();
      node.querySelector(".edit").remove();
    }
  }

  addDeleteEvent();
  addEditEvent();
}

drawPost();
// upload Post in HTML
const uploadMemoForm = document.getElementById("postMemoForm");
uploadMemoForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // To prevent the form from submitting synchronously
  let formObject = {};
  const searchParams = new URLSearchParams(location.search);
  const searchId = searchParams.get("id");
  formObject["content"] = uploadMemoForm.content.value;
  // formObject["user"] = uploadMemoForm.user.value;
  if (
    !uploadMemoForm.star.value ||
    uploadMemoForm.star.value > 5 ||
    uploadMemoForm.star.value < 1
  ) {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });
    Toast.fire({
      icon: "error",
      title: "Don't input the start out of range",
    });
    return;
  } else {
    formObject["star"] = uploadMemoForm.star.value;
  }

  formObject["id"] = searchId;

  console.log(formObject);

  const res = await fetch("/postComment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formObject),
  });

  const result = await res.json();

  if (result.status) {
    // success
    drawPost();
  } else {
    // failed
    alert("Error");
  }

  console.log(result);

  // Clear the form here
  uploadMemoForm.reset();
});

//  Adding event from delete
async function addDeleteEvent() {
  const delPost = document.querySelectorAll(".delete");
  for (let i of delPost) {
    i.addEventListener("click", async () => {
      const deleteId = i.id.split("@")[1];
      await deletePost(deleteId);
    });
  }
}

// communicated with server which is deleted the post
async function deletePost(id) {
  await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Your delete has been saved",
        showConfirmButton: false,
        timer: 1000,
      });
      let res = await fetch("/delete_post", {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      });
      let result = await res.json();
      console.log(result);
      drawPost();
    } else {
      return;
    }
  });
}

// Adding event from edit
async function addEditEvent() {
  const editPosts = document.querySelectorAll(".edit");

  for (let i of editPosts) {
    i.addEventListener("click", async () => {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });
      const editId = i.id.split("@")[1];
      // let newContent = prompt("Please edit your content here", "New content");
      const { value: text } = await Swal.fire({
        title: "Please edit your comment",
        input: "textarea",
        inputPlaceholder: "Type your message here...",
        inputAttributes: {
          "aria-label": "Type your message here",
        },
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return "You need to write something!";
          }
        },
      });
      if (text) {
        Toast.fire({
          icon: "success",
          title: "Edit Success!!",
        });
      }
      if (!text) {
        return;
      }

      // let newContent = Swal.fire(text);

      // console.log(text);
      await editPost(editId, text);
    });
  }
}

// communicated with server which is edited the post
async function editPost(id, newContent) {
  let logInUserRes = await fetch("/user");
  let LogInUserInfo = await logInUserRes.json();
  if (!LogInUserInfo.username) {
    let edit = document.querySelector(".edit");
    edit.remove();
  }

  let res = await fetch("/edit_post", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: id, newContent: newContent }),
  });
  await res.json();
  drawPost();
}
// Adding Payment in Hotel
const payment = document.getElementById("payment");
payment.addEventListener("click", async () => {
  const searchParams = new URLSearchParams(location.search);
  const searchId = searchParams.get("id");
  const date = searchParams.get("date");
  const nor = searchParams.get("nor");
  console.log(searchId, date, nor);
  try {
    let logInUserRes = await fetch("/user");
    let LogInUserInfo = await logInUserRes.json();
    if (!LogInUserInfo.username) {
      alert("Please log in for payment");
      return;
    }
    console.log(searchId);
    let res = await fetch(
      `/create-checkout-session?id=${searchId}&date=${date}&nor=${nor}`
      // {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     id: searchId,
      //     quantity: 1,
      //   }),
      // }
    );

    let result = await res.json();
    window.location = result.url;

    console.log(result);
  } catch (error) {
    console.log(error);
  }
  // .then((res) => {
  //   if (res.ok) return res.json();
  //   return res.json().then((json) => Promise.reject(json));
  // })
  // .then(({ url }) => {
  //   window.location = url;
  // })
  // .catch((e) => {
  //   console.error(e.error);
  // });
});

// async function cancelPayment() {
//   let cancelPayment = await fetch(`/checkOutCancel`);
//   let res = await res.json();
//   console.log(res.json());
// }
// cancelPayment();

async function getUserName() {
  let logInUserRes = await fetch("/user");
  let LogInUserInfo = await logInUserRes.json();
  let userElement = document.querySelector(".member");
  let headerUserName = document.querySelector(".userinformation");
  console.log(LogInUserInfo);
  if (!LogInUserInfo.username) {
    postMemoForm.remove();
    headerUserName.textContent = ``;
  } else {
    headerUserName.textContent = `Welcome back ${LogInUserInfo.username}`;
  }
}
getUserName();
