document.addEventListener('DOMContentLoaded', () => {
    const authContainer = document.getElementById('auth-container');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginButton = document.getElementById('login-button');
    const registerButton = document.getElementById('register-button');
    const loginAuthForm = document.getElementById('login-auth-form');
    const registerAuthForm = document.getElementById('register-auth-form');
    const loginAuthMessage = document.getElementById('login-auth-message');
    const registerAuthMessage = document.getElementById('register-auth-message');
    const loginEmailInput = document.getElementById('login-email-input');
    const registerEmailInput = document.getElementById('register-email-input');

    const profileForm = document.getElementById('profile-form');
    const nameInput = document.getElementById('name-input');
    const surnameInput = document.getElementById('surname-input');
    const emailInput = document.getElementById('email-input');
    const saveMessage = document.getElementById('save-message');
    const profilePictureInput = document.getElementById('profile-picture-input');
    const profilePicture = document.getElementById('profile-picture');
    const profileInfoContainer = document.querySelector('.profile-info');
    const profileEditContainer = document.querySelector('.profile-edit');


    function setAuthStatus(status) {
        localStorage.setItem('isLoggedIn', status);
    }

    function isLoggedIn() {
        return localStorage.getItem('isLoggedIn') === 'true';
    }

    function loadUserProfile() {
        if (!isLoggedIn()) {
            authContainer.style.display = 'block';
            profileEditContainer.style.display = 'none';
            profileInfoContainer.style.display = 'none';
            return;
        } else {
            authContainer.style.display = 'none';
            profileEditContainer.style.display = 'block';
            profileInfoContainer.style.display = 'block';
        }
        const storedUsers = localStorage.getItem('users');
        let users = storedUsers ? JSON.parse(storedUsers) : [];
        const currentUser = users.find(user => user.email === getCurrentUserEmail());
        if (currentUser) {
            nameInput.value = currentUser.name;
            surnameInput.value = currentUser.surname;
            emailInput.value = currentUser.email;
            document.getElementById('profile-name').textContent = `Имя: ${currentUser.name}`;
            document.getElementById('profile-surname').textContent = `Фамилия: ${currentUser.surname}`;
            document.getElementById('profile-email').textContent = `Email: ${currentUser.email}`;

            if (currentUser.profilePicture) {
                profilePicture.src = currentUser.profilePicture;
                profilePicture.style.display = 'block';
            } else {
                profilePicture.style.display = 'none';
            }
        }

        // запоминаем последний введенный email, если он есть
        const lastUsedEmail = localStorage.getItem('lastUsedEmail')
        if (lastUsedEmail) {
            loginEmailInput.value = lastUsedEmail;
            registerEmailInput.value = lastUsedEmail;
        }
    }

    function saveUserProfile() {
        const storedUsers = localStorage.getItem('users');
        let users = storedUsers ? JSON.parse(storedUsers) : [];
        const newUser = {
            name: nameInput.value,
            surname: surnameInput.value,
            email: emailInput.value,
            profilePicture: profilePicture.src === '../../drawable/your_profile_picture.png' ? null : profilePicture.src,
        };

        if (!users.find(user => user.email === newUser.email)) {
            users.push(newUser);
        } else {
            const userIndex = users.findIndex(user => user.email === newUser.email)
            users[userIndex] = newUser;
        }

        localStorage.setItem('users', JSON.stringify(users));
        saveMessage.textContent = 'Изменения сохранены';
        setTimeout(() => {
            saveMessage.textContent = '';
        }, 3000);
    }

    // Обработчики для переключения форм
    loginButton.addEventListener('click', () => {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    });

    registerButton.addEventListener('click', () => {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    });


    registerAuthForm.addEventListener('submit', (event) => {
        event.preventDefault();
        setAuthStatus(true)
        localStorage.setItem('lastUsedEmail', registerEmailInput.value);
        registerAuthMessage.textContent = 'Вы успешно зарегистрировались!';
        setTimeout(() => {
            registerAuthMessage.textContent = '';
        }, 2000);
        loadUserProfile();
    })

    loginAuthForm.addEventListener('submit', (event) => {
        event.preventDefault();
        setAuthStatus(true);
        localStorage.setItem('lastUsedEmail', loginEmailInput.value);
        loginAuthMessage.textContent = 'Вы успешно вошли!';
        setTimeout(() => {
            loginAuthMessage.textContent = '';
        }, 2000);
        loadUserProfile();
    })

    profileForm.addEventListener('submit', (event) => {
        event.preventDefault();
        saveUserProfile();
    });
     document.getElementById('edit-profile-button').addEventListener('click', () => {
         profileEditContainer.style.display = 'block';
          profileInfoContainer.style.display = 'none'
   })

    function getCurrentUserEmail() {
        if (!isLoggedIn()) {
            return null;
        }
        return loginForm.style.display === 'block' ? loginEmailInput.value : registerEmailInput.value;
    }

    loadUserProfile();
    profilePictureInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profilePicture.src = e.target.result;
                profilePicture.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    })
});