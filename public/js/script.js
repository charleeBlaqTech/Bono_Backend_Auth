
const hamburgerMenu= document.querySelector('.hamburger');
const exitMenu= document.querySelector('.menu-exit-wrapper');
const ulList= document.querySelector('.nav-menu');
const showPassword= document.querySelector('#show-password');
const newPasswordInputs= document.querySelectorAll('.newPassword');


hamburgerMenu.addEventListener('click', ()=>{
    ulList.classList.toggle('showNavMenu');
})

exitMenu.addEventListener('click', ()=>{
    ulList.classList.toggle('showNavMenu');
})

showPassword.addEventListener('click', (e)=>{
    e.preventDefault();
    newPasswordInputs.forEach(input=>{
        input.getAttribute('type') === "password"? input.setAttribute('type', "text"):input.setAttribute('type', "password")
    })
})