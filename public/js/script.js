
const hamburgerMenu= document.querySelector('.hamburger');
const exitMenu= document.querySelector('.menu-exit-wrapper');
const ulList= document.querySelector('.nav-menu');
const showPassword= document.querySelector('#show-password');
const newPasswordInputs= document.querySelectorAll('.showPassword');




//FOR HAMBURGER TO SHOW AND HIDE NAV MENU WHEN ON SMALLER DEVICE SCREEN
hamburgerMenu.addEventListener('click', ()=>{
    ulList.classList.toggle('showNavMenu');
})

//FOR NAV MENU EXIT TO HIDE NAV MENU
exitMenu.addEventListener('click', ()=>{
    ulList.classList.remove('showNavMenu');
})

// TO SHOW SHOW AND HIDE PASSWORDS
showPassword.addEventListener('click', (e)=>{
    e.preventDefault();
    newPasswordInputs.forEach(input=>{
        input.getAttribute('type') === "password"? input.setAttribute('type', "text"):input.setAttribute('type', "password")
    })
})