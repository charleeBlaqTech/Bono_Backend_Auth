
const hamburgerMenu= document.querySelector('.hamburger');
const ulList= document.querySelector('.nav-menu');
hamburgerMenu.addEventListener('click', ()=>{
    ulList.classList.toggle('showNavMenu')
})