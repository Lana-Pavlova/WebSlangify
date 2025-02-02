document.addEventListener('DOMContentLoaded', () => {
    const wordOfTheDayContainer = document.getElementById('word-of-the-day-container');
    const loadingIndicator = document.getElementById('loading-indicator');
    const errorMessage = document.getElementById('error-message');
    const wordData = document.getElementById('word-data');
    const wordTitle = document.getElementById('word-title');
    const wordDefinition = document.getElementById('word-definition');
    const wordTranslation = document.getElementById('word-translation');
    const wordExamples = document.getElementById('word-examples');

    const fetchRandomWordOfTheDay = async () => {
        loadingIndicator.style.display = 'block';
        errorMessage.style.display = 'none';
        wordData.style.display = 'none';

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
             wordTitle.textContent = `✨ Слово дня: ${word.word} ✨`;
             wordDefinition.textContent = word.definition;
             wordTranslation.textContent = `Перевод: ${word.translation}`;
             if (word.examples) {
                 wordExamples.textContent = `Примеры: ${word.examples}`;
             }
            wordData.style.display = 'block';

        } catch (e) {
            errorMessage.textContent = `Error: ${e.message || 'An unexpected error occurred.'}`;
            errorMessage.style.display = 'block';
        } finally {
            loadingIndicator.style.display = 'none';
        }
    };

    fetchRandomWordOfTheDay();
});