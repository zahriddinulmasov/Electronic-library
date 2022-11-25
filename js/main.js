"use strict"

const token = window.localStorage.getItem("token")

if(!token){
    window.location.replace("index.html")
}
logaut.addEventListener("click", function(){
    window.localStorage.removeItem("token")

    window.location.replace("index.html")
})

const renderBooks = function(arr, htmlElement){

}

