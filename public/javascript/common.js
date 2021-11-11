const userContainerIcon = document.getElementById('userContainerIcon');
const managerPopup = document.getElementById('managerPopup');

userContainerIcon.addEventListener('click', () => {
    managerPopup.classList.toggle('active-popup');
});
