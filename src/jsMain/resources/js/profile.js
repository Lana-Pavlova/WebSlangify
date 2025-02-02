document.addEventListener('DOMContentLoaded', () => {
    const authContainer = document.getElementById('auth-container');
    const profileEditContainer = document.getElementById('profile-edit-container');
    const profileInfoContainer = document.getElementById('profile-info-container');
    const nameInput = document.getElementById('name-input');
    const surnameInput = document.getElementById('surname-input');
    // const emailInput = document.getElementById('email-input');
    const saveMessage = document.getElementById('save-message');
    const profilePicture = document.getElementById('profile-picture');
    const profilePictureInput = document.getElementById('profile-picture-input');
    const studiedWordsCount = document.getElementById('studied-words-count');
    const completedLessonsCount = document.getElementById('completed-lessons-count');
    const userScore = document.getElementById('user-score');
   function setAuthStatus(status) {
      localStorage.setItem('isLoggedIn', status);
   }
   function isLoggedIn() {
        return localStorage.getItem('isLoggedIn') === 'true';
    }
   function getCurrentUserEmail() {
      if (!isLoggedIn()) {
           return null;
       }
        return localStorage.getItem('lastUsedEmail');
    }
    function loadUserProfile() {
        if (!isLoggedIn()) {
           authContainer.style.display = 'block';
           profileEditContainer.style.display = 'none';
           profileInfoContainer.style.display = 'none';
           return;
        } else {
           authContainer.style.display = 'none';
            profileEditContainer.style.display = 'none';
           profileInfoContainer.style.display = 'block';
       }
        const storedUsers = localStorage.getItem('users');
       let users = storedUsers ? JSON.parse(storedUsers) : [];
        const currentUser = users.find(user => user.email === getCurrentUserEmail());
      if (currentUser) {
           nameInput.value = currentUser.name;
            surnameInput.value = currentUser.surname;
            // emailInput.value = currentUser.email;  // убираем эту строку
          document.getElementById('profile-name').textContent = currentUser.name; // обновляем span
           document.getElementById('profile-surname').textContent = currentUser.surname; // обновляем span
           document.getElementById('profile-email').textContent = currentUser.email; // обновляем span
           if (currentUser.profilePicture) {
               profilePicture.src = currentUser.profilePicture;
               profilePicture.style.display = 'block';
          } else {
                profilePicture.style.display = 'none';
            }
           const userScore = calculateUserScore(currentUser);
            document.getElementById('user-score').textContent = userScore;
           const completedLessons = getCompletedLessons(currentUser);
            document.getElementById('completed-lessons-count').textContent = completedLessons;
           const studiedWords = getStudiedWords(currentUser);
           document.getElementById('studied-words-count').textContent = studiedWords;
       }
    }
    function saveUserProfile() {
       const storedUsers = localStorage.getItem('users');
        let users = storedUsers ? JSON.parse(storedUsers) : [];
       const newUser = {
            name: nameInput.value,
           surname: surnameInput.value,
           email: getCurrentUserEmail(),
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
        loadUserProfile();
   }
  function calculateUserScore(currentUser) {
       // Здесь вы можете реализовать логику расчета рейтинга
       // Пока будем возвращать количество изученых слов.
        return getStudiedWords(currentUser);
   }
   function getCompletedLessons(currentUser){
      // Пока возвращаем 0.
        return 0;
    }
   function getStudiedWords(currentUser) {
        const storedWords = localStorage.getItem('studiedWords');
       let studiedWords = storedWords ? JSON.parse(storedWords) : [];
        return studiedWords.filter(word => word.userEmail === currentUser?.email).length
   }
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
    document.getElementById('edit-profile-button').addEventListener('click', () => {
        profileEditContainer.style.display = 'block';
        profileInfoContainer.style.display = 'none'
    })
    document.getElementById('profile-form').addEventListener('submit', (event) => {
        event.preventDefault();
        saveUserProfile();
    });
    document.getElementById('login-button').addEventListener('click', () => {
       document.getElementById('login-form').style.display = 'block';
       document.getElementById('register-form').style.display = 'none';
    });
   document.getElementById('register-button').addEventListener('click', () => {
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('register-form').style.display = 'block';
    });
   document.getElementById('login-auth-form').addEventListener('submit', (event) => {
       event.preventDefault();
       setAuthStatus(true);
       localStorage.setItem('lastUsedEmail', document.getElementById('login-email-input').value);
        loadUserProfile();
    })
   document.getElementById('register-auth-form').addEventListener('submit', (event) => {
       event.preventDefault();
        setAuthStatus(true)
      localStorage.setItem('lastUsedEmail', document.getElementById('register-email-input').value);
        loadUserProfile();
   })
  document.getElementById('logout-button').addEventListener('click', () => {
      setAuthStatus(false);
       localStorage.removeItem('lastUsedEmail');
       loadUserProfile();
  });
    loadUserProfile();
});