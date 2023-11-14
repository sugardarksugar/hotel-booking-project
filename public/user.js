// const { log } = require("console");

var x = document.getElementById("login");
var y = document.getElementById("register");
var z = document.getElementById("btn");

const searchParams = new URLSearchParams(location.search);
const next = searchParams.get("next");

function register() {
  x.style.left = "-400px";
  y.style.left = "50px";
  z.style.left = "110px";
}

function login() {
  x.style.left = "50px";
  y.style.left = "450px";
  z.style.left = "0";
}

document
  .querySelector("#register")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    // Serialize the Form afterwards
    const form = event.target;
    const formObject = {};

    formObject["username"] = form.username.value;
    formObject["password"] = form.password.value;
    formObject["email"] = form.email.value;

    const res = await fetch("/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formObject),
    });

    const result = await res.json();
    console.log(result);

    if (result.error) {
      alert(result.error);
    } else {
      alert(result.message);
      console.log("result");
    }
  });

document
  .querySelector("#login")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    // Serialize the Form afterwards
    const form = event.target;
    const formObject = {};

    formObject["username"] = form.username.value;
    formObject["password"] = form.password.value;

    const res = await fetch("/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formObject),
    });
    const result = await res.json();
    function onSignIn(googleUser) {
      var profile = googleUser.getBasicProfile();
      console.log("ID: " + profile.getId()); // Do not send to your backend! Use an ID token instead.
      console.log("Name: " + profile.getName());
      console.log("Image URL: " + profile.getImageUrl());
      console.log("Email: " + profile.getEmail()); // This is null if the 'email' scope is not present.
    }
    if (!result.status) {
      alert(result.message);
    } else {
      alert(result.message);

      const nextPage = location.search.split("?next=");
      location.href = nextPage[1] ? nextPage[1] : result.redirectUrl;
    }
  });
