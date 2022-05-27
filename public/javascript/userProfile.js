const changeProfilePicBtn = document.getElementById('changeProfilePicBtn');
const profilePicCloseModal = document.getElementById('profilePicCloseModal');
const profilePhoto = document.getElementById('profilePhoto');
const profilePicUploadBtn = document.getElementById('profilePicUploadBtn');
const profilePageUserImg = document.getElementById('profilePageUserImg');
const editBioBtn = document.getElementById('editBioBtn');
const editInterestsBtn = document.getElementById('editInterestsBtn');
const editBioCloseModal = document.getElementById('editBioCloseModal');
const editInterestsCloseModal = document.getElementById('editInterestsCloseModal');
const backdrop = document.querySelector('.backdrop');
const editBioUploadBtn = document.getElementById('editBioUploadBtn');
const editBioInput = document.getElementById('editBioInput');
const editInterestsInput = document.getElementById('editInterestsInput');
const editInterestsUploadBtn = document.getElementById('editInterestsUploadBtn');
const addInterestsBtn = document.getElementById('addInterestsBtn');
const currentInterests = document.getElementById('currentInterests');
const interests = user.interests? user.interests : [];
const userInterestsContainer = document.getElementById('userInterestsContainer');
let cropper;


editBioUploadBtn.addEventListener('click', async () => {
    const bio = editBioInput.value;
    if(bio === '') {
        alert('Please enter your bio');
        return;
    }
    await axios.patch(`/api/users/bio/${userLoggedIn._id}`, {bio})
    .catch(err => console.log(err));
    location.reload();
});

const renderInterestsInModal = () => {
    interests.forEach(interest => {
        currentInterests.innerHTML += `<div class="interest-container">
        <p class="interest-title">${interest}</p>
        </div>`;
    });
}

const renderInterestsInContainer = () => {
    userInterestsContainer.innerHTML = '';
    interests.forEach(interest => {
        userInterestsContainer.innerHTML += `<div class="interest-container">
        <p class="interest-title">${interest}</p>
        </div>`;
    });
}

addInterestsBtn.addEventListener('click', () => {
    interests.push(editInterestsInput.value);
    editInterestsInput.value = '';
    currentInterests.innerHTML = '';
    renderInterestsInModal();
});

editInterestsUploadBtn.addEventListener('click', async () => {
    await axios.patch(`/api/users/interests/${userLoggedIn._id}`, {interests})
    .catch(err => console.log(err));
    location.reload();
});

backdrop.addEventListener('click', () => {
    closeModal('profilePic');
    closeModal('editBio');
    closeModal('editInterests');
});

editBioCloseModal.addEventListener('click', () => {
    closeModal('editBio');
});

editInterestsCloseModal.addEventListener('click', () => {
    closeModal('editInterests');
});

editBioBtn.addEventListener('click', () => {
    openModal('editBio');
});

editInterestsBtn.addEventListener('click', () => {
    currentInterests.innerHTML = '';
    renderInterestsInModal();
    openModal('editInterests');
});

profilePageUserImg.addEventListener('mouseover', () => {
    if(user._id == userLoggedIn._id) {
        document.getElementById('changeProfilePicBtn').classList.remove('btn-hidden');
    }
});

profilePageUserImg.addEventListener('mouseout', () => {
    if(user._id == userLoggedIn._id) {
        document.getElementById('changeProfilePicBtn').classList.add('btn-hidden');
    }
});

const openModal = (modalName) => {
    document.querySelector('.backdrop').classList.add('modal-show');
    document.getElementById(`${modalName}Modal`).classList.add('modal-show');
}

const closeModal = (modalName) => {
    document.getElementById(`${modalName}Modal`).classList.add('slide-up');
    setTimeout(function() {
        document.querySelector('.backdrop').classList.remove('modal-show');
        document.getElementById(`${modalName}Modal`).classList.remove('modal-show');
        document.getElementById(`${modalName}Modal`).classList.remove('slide-up');
    }, 150);
}

document.querySelector('.backdrop').addEventListener('click', function() {
    closeModal('profilePic');
});

changeProfilePicBtn.addEventListener('click', () => {
    if(user._id == userLoggedIn._id) {
        openModal('profilePic');
    }
});

profilePicCloseModal.addEventListener('click', () => {
    closeModal('profilePic');
});

profilePhoto.addEventListener('change', (e) => {
    document.getElementById('profilePhotoPreviewContainer').classList.remove('preview-hidden');
    const image = document.getElementById('profilePhotoPreview');
    const reader = new FileReader();
    reader.onload = function(e) {
        image.setAttribute('src', e.target.result);
        if(cropper) {
            cropper.destroy();
        }
        cropper = new Cropper(image, {
            aspectRatio: 1,
            background: false,
        });
    }
    reader.readAsDataURL(e.target.files[0]);
});

profilePicUploadBtn.addEventListener('click', () => {
    const canvas = cropper.getCroppedCanvas();
    if(canvas == null) {
        console.log('Could not upload image. Make sure it is a valid image file');
        return;
    }
    canvas.toBlob(async function(blob) {
        const formData = new FormData();
        formData.append('croppedImage', blob);
        console.log(formData.croppedImage);
        await axios.post(`/api/users/profilePic/${userLoggedIn._id}`, formData, {
            'content-type': 'multipart/form-data'
        })
        .catch(err => console.log(err));
        location.reload();
    });
});

const followBtn = document.getElementById('followBtn');
if(user._id == userLoggedIn._id) {
    followBtn.classList.add('btn-hidden');
}

followBtn.dataset.userid = user._id;
if(userLoggedIn.following.includes(user._id)) {
    followBtn.innerHTML = 'Following';
    followBtn.classList.add('following');
} else {
    followBtn.innerHTML = 'Follow';
    followBtn.classList.remove('following');
}

followBtn.addEventListener('click', async (e) => {
    const id = e.target.dataset.userid;
    const isFollowing = e.target.classList.contains('following');
    axios.patch(`/api/users/follow`, {userId: userLoggedIn._id, targetUserId: id, isFollowing: isFollowing})
    .then(() => {
        location.reload();
    })
    .catch(err => console.log(err));
})

renderInterestsInContainer();