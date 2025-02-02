document.addEventListener('DOMContentLoaded', () => {
    const authContainer = document.getElementById('profile-sidebar')?.querySelector('#auth-container');
    const profileEditContainer = document.getElementById('profile-sidebar')?.querySelector('#profile-edit-container');
    const profileInfoContainer = document.getElementById('profile-sidebar')?.querySelector('#profile-info-container');
   const nameInput = document.getElementById('profile-sidebar')?.querySelector('#name-input');
    const surnameInput = document.getElementById('profile-sidebar')?.querySelector('#surname-input');
    const saveMessage = document.getElementById('profile-sidebar')?.querySelector('#save-message');
    const profilePicture = document.getElementById('profile-sidebar')?.querySelector('#profile-picture');
    const profilePictureInput = document.getElementById('profile-sidebar')?.querySelector('#profile-picture-input');
   const studiedWordsCount = document.getElementById('profile-sidebar')?.querySelector('#studied-words-count');
    const completedLessonsCount = document.getElementById('profile-sidebar')?.querySelector('#completed-lessons-count');
   const userScore = document.getElementById('profile-sidebar')?.querySelector('#user-score');
    const profileToggle = document.getElementById('profile-toggle');
    const profileSidebar = document.getElementById('profile-sidebar');
    const wordOfTheDayContainer = document.getElementById('word-of-the-day-container');
   const recentWordsContainer = document.getElementById('recent-words-container');
   let recentlyStudiedWords = [];
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
       if (!authContainer || !profileEditContainer || !profileInfoContainer) return;
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
            if (document.getElementById('profile-sidebar')?.querySelector('#profile-name')){
                document.getElementById('profile-sidebar').querySelector('#profile-name').textContent = currentUser.name;
            }
           if (document.getElementById('profile-sidebar')?.querySelector('#profile-surname')){
              document.getElementById('profile-sidebar').querySelector('#profile-surname').textContent = currentUser.surname;
            }
            if (document.getElementById('profile-sidebar')?.querySelector('#profile-email')){
                document.getElementById('profile-sidebar').querySelector('#profile-email').textContent = currentUser.email;
            }
           if (currentUser.profilePicture && profilePicture) {
               profilePicture.src = currentUser.profilePicture;
                profilePicture.style.display = 'block';
            } else {
               if(profilePicture){
                   profilePicture.style.display = 'none';
               }
            }
           if(document.getElementById('profile-sidebar')?.querySelector('#user-score')){
                const userScore = calculateUserScore(currentUser);
                document.getElementById('profile-sidebar').querySelector('#user-score').textContent = userScore;
            }
            if (document.getElementById('profile-sidebar')?.querySelector('#completed-lessons-count')){
               const completedLessons = getCompletedLessons(currentUser);
                document.getElementById('profile-sidebar').querySelector('#completed-lessons-count').textContent = completedLessons;
            }
            if(document.getElementById('profile-sidebar')?.querySelector('#studied-words-count')){
               const studiedWords = getStudiedWords(currentUser);
               document.getElementById('profile-sidebar').querySelector('#studied-words-count').textContent = studiedWords;
           }
        }
    }
    function saveUserProfile() {
        if (!authContainer || !profileEditContainer || !profileInfoContainer) return;
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
        return getStudiedWords(currentUser);
    }
   function getCompletedLessons(currentUser){
        return 0;
    }
    function getStudiedWords(currentUser) {
        const storedWords = localStorage.getItem('studiedWords');
        let studiedWords = storedWords ? JSON.parse(storedWords) : [];
       return studiedWords.filter(word => word.userEmail === currentUser?.email).length
   }
    if(profilePictureInput){
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
    }
  if( document.getElementById('profile-sidebar')?.querySelector('#edit-profile-button')){
        document.getElementById('profile-sidebar').querySelector('#edit-profile-button').addEventListener('click', () => {
            profileEditContainer.style.display = 'block';
           profileInfoContainer.style.display = 'none'
        })
   }
    if( document.getElementById('profile-sidebar')?.querySelector('#profile-form')){
        document.getElementById('profile-sidebar').querySelector('#profile-form').addEventListener('submit', (event) => {
            event.preventDefault();
            saveUserProfile();
        });
    }
    if( document.getElementById('profile-sidebar')?.querySelector('#login-button')){
        document.getElementById('profile-sidebar').querySelector('#login-button').addEventListener('click', () => {
           document.getElementById('profile-sidebar').querySelector('#login-form').style.display = 'block';
            document.getElementById('profile-sidebar').querySelector('#register-form').style.display = 'none';
        });
    }
  if( document.getElementById('profile-sidebar')?.querySelector('#register-button')){
      document.getElementById('profile-sidebar').querySelector('#register-button').addEventListener('click', () => {
            document.getElementById('profile-sidebar').querySelector('#login-form').style.display = 'none';
           document.getElementById('profile-sidebar').querySelector('#register-form').style.display = 'block';
        });
   }
    if( document.getElementById('profile-sidebar')?.querySelector('#login-auth-form')){
       document.getElementById('profile-sidebar').querySelector('#login-auth-form').addEventListener('submit', (event) => {
            event.preventDefault();
            setAuthStatus(true);
            localStorage.setItem('lastUsedEmail', document.getElementById('profile-sidebar').querySelector('#login-email-input').value);
            loadUserProfile();
        })
    }
  if( document.getElementById('profile-sidebar')?.querySelector('#register-auth-form')){
     document.getElementById('profile-sidebar').querySelector('#register-auth-form').addEventListener('submit', (event) => {
            event.preventDefault();
           setAuthStatus(true)
           localStorage.setItem('lastUsedEmail', document.getElementById('profile-sidebar').querySelector('#register-email-input').value);
           loadUserProfile();
        })
   }
   if( document.getElementById('profile-sidebar')?.querySelector('#logout-button')){
       document.getElementById('profile-sidebar').querySelector('#logout-button').addEventListener('click', () => {
           setAuthStatus(false);
            localStorage.removeItem('lastUsedEmail');
            loadUserProfile();
        });
   }
   if(profileToggle){
       profileToggle.addEventListener('click', () => {
            profileSidebar.classList.toggle('active');
        })
   }
   function fetchRandomWordOfTheDay() {
        const wordOfTheDayContainer = document.getElementById('word-of-the-day-container');
        const loadingIndicator = document.getElementById('loading-indicator');
        const errorMessage = document.getElementById('error-message');
        const wordTitle = document.getElementById('word-title');
       const wordDefinition = document.getElementById('word-definition');
        const wordTranslation = document.getElementById('word-translation');
       const wordExamples = document.getElementById('word-examples');
        const recentWordsList = document.getElementById('recent-words-container');
       loadingIndicator.style.display = 'block';
        errorMessage.style.display = 'none';
        if(wordOfTheDayContainer){
            wordOfTheDayContainer.classList.remove('active');
        }

        fetch('../data/words.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(words => {
           if (!Array.isArray(words)) {
                throw new Error('Invalid JSON structure: expected array');
           }
            const randomIndex = Math.floor(Math.random() * words.length);
            const word = words[randomIndex];
            wordTitle.textContent = `Слово дня: ${word.word}`;
           wordDefinition.textContent = word.definition || '';
            wordTranslation.textContent = `Перевод: ${word.translation}`;
           wordExamples.textContent = word.examples ? `Примеры: ${word.examples}` : '';
            const userEmail = getCurrentUserEmail();
            addWordToRecent({...word, userEmail: userEmail});
        })
        .catch(e => {
           errorMessage.textContent = `Error: ${e.message || 'An unexpected error occurred.'}`;
            errorMessage.style.display = 'block';
        })
        .finally(() => {
            loadingIndicator.style.display = 'none';
            if(wordOfTheDayContainer){
                setTimeout(() => {
                   wordOfTheDayContainer.classList.add('active');
               }, 100)
            }
        });
    };
   const addWordToRecent = (word) => {
       const storedWords = localStorage.getItem('studiedWords');
        let studiedWords = storedWords ? JSON.parse(storedWords) : [];
        studiedWords.push(word)
        if (studiedWords.length > 5) {
            studiedWords.shift();
        }
       localStorage.setItem('studiedWords', JSON.stringify(studiedWords));
        recentlyStudiedWords = studiedWords.filter(item => item.userEmail === word.userEmail);
        updateRecentList();
    };
   const updateRecentList = () => {
        if(recentWordsContainer){
            recentWordsContainer.innerHTML = '';
        }
       if(recentlyStudiedWords && recentlyStudiedWords.length > 0){
            recentlyStudiedWords.forEach((word, index) => {
                const card = document.createElement('div');
              card.classList.add('recent-word-card');
                card.innerHTML = `
                    <h4>${word.word}</h4>
                    <p>Перевод: ${word.translation}</p>
                    ${word.definition ? `<p>Определение: ${word.definition}</p>` : ''}
                   ${word.examples ? `<p>Примеры: ${word.examples}</p>` : ''}
                `;
                if(recentWordsContainer){
                    recentWordsContainer.appendChild(card);
                   setTimeout(() => {
                       card.classList.add('active');
                   }, 50 * index)
                }
            });
        }
    };
   if(wordOfTheDayContainer){
        wordOfTheDayContainer.addEventListener('click', () => {
            const userEmail = getCurrentUserEmail();
           const wordTitle = document.getElementById('word-title');
           const wordDefinition = document.getElementById('word-definition');
           const wordTranslation = document.getElementById('word-translation');
            const wordExamples = document.getElementById('word-examples');
            const word = {
                word: wordTitle.textContent.replace('Слово дня: ', ''),
               definition: wordDefinition.textContent || '',
                translation: wordTranslation.textContent.replace('Перевод: ', '') || '',
                examples: wordExamples.textContent.replace('Примеры: ', '') || '',
            };
            addWordToRecent({...word, userEmail: userEmail});
           fetchRandomWordOfTheDay(); // Обновляем слово
        });
    }
   fetchRandomWordOfTheDay();
    loadUserProfile();

});