"use strict";

const elForm = document.querySelector(".login__form");
const elInputEmail = document.querySelector(".login__input-email");
const elInputPassword = document.querySelector(".login__input-password");
const elLoginBtn = document.querySelector(".login__btn");

const elWarning = document.querySelector(".warning");

elForm.addEventListener("submit", function (evt) {
  evt.preventDefault();
  const emailValue = elInputEmail.value;
  const passworValue = elInputPassword.value;

  fetch("https://reqres.in/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: emailValue,
      password: passworValue,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.token) {
        window.localStorage.setItem("token", data.token);
        window.location.replace("main.html");
      } else {
        elWarning.classList.remove("d-none")
      }
    });
});
