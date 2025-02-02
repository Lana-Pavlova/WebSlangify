 document.addEventListener('DOMContentLoaded', () => {
    const wordOfTheDayContainer = document.getElementById('word-of-the-day-container');
    const loadingIndicator = document.getElementById('loading-indicator');
    const errorMessage = document.getElementById('error-message');
    const wordTitle = document.getElementById('word-title');
    const wordDefinition = document.getElementById('word-definition');
    const wordTranslation = document.getElementById('word-translation');
    const wordExamples = document.getElementById('word-examples');
      const recentWordsContainer = document.getElementById('recent-words-container');
    let recentlyStudiedWords = [];
  const fetchRandomWordOfTheDay = async () => {
        loadingIndicator.style.display = 'block';
        errorMessage.style.display = 'none';
          wordOfTheDayContainer.classList.remove('active')// убираем класс active для анимации скрытия

        try {
            const response = await fetch('../data/words.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const words = await response.json();
            if (!Array.isArray(words)) {
                throw new Error('Invalid JSON structure: expected array');
            }
            const randomIndex = Math.floor(Math.random() * words.length);
            const word = words[randomIndex];
            wordTitle.textContent = `Слово дня: ${word.word}`;
            wordDefinition.textContent = word.definition || '';
            wordTranslation.textContent = `Перевод: ${word.translation}`;
            wordExamples.textContent = word.examples ? `Примеры: ${word.examples}` : '';

            // Добавляем слово в список изученных
               addWordToRecent(word);
        } catch (e) {
            errorMessage.textContent = `Error: ${e.message || 'An unexpected error occurred.'}`;
            errorMessage.style.display = 'block';
        } finally {
            loadingIndicator.style.display = 'none';
             setTimeout(() => {
                 wordOfTheDayContainer.classList.add('active')// добавляем класс active для анимации показа
           }, 100)
        }
    };
  const addWordToRecent = (word) => {
        recentlyStudiedWords.push(word);
       if(recentlyStudiedWords.length > 5){
            recentlyStudiedWords.shift()
        }
        updateRecentList();
    };
     const updateRecentList = () => {
            recentWordsContainer.innerHTML = '';
           recentlyStudiedWords.forEach((word, index) => {
                 const card = document.createElement('div');
                card.classList.add('recent-word-card');
                card.innerHTML = `
                <h4>${word.word}</h4>
                <p>Перевод: ${word.translation}</p>
                  ${word.definition ? `<p>Определение: ${word.definition}</p>` : ''}
                  ${word.examples ? `<p>Примеры: ${word.examples}</p>`: ''}
              `;
           recentWordsContainer.appendChild(card);
                 setTimeout(() => {
                 card.classList.add('active');
                }, 50 * index)
            });
    };
   wordOfTheDayContainer.addEventListener('click', fetchRandomWordOfTheDay);
     fetchRandomWordOfTheDay()
});