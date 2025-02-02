document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.dictionary-container');
    const filterButton = document.getElementById('filter-button');
    const checkboxes = document.querySelectorAll('input[name="category"]');

    let allData = []; //  сохраняем все данные, чтоб не загружать их каждый раз при фильтрации

    fetch('../data/words.json')
        .then(response => response.json())
        .then(data => {
            allData = data; // Сохраняем полученные данные
            renderDictionary(data); // Отображаем все слова изначально
        })
        .catch(error => console.error('Error fetching dictionary:', error));

    function renderDictionary(data) {
         container.innerHTML = ''; // Очищаем контейнер
         data.forEach(item => {
            const wordElement = document.createElement('div');
            wordElement.classList.add('dictionary-item');
            wordElement.innerHTML = `
               <b>${item.word}</b> - ${item.translation}
              `;
            container.appendChild(wordElement);
        });
    }

    filterButton.addEventListener('click', () => {
        const checkedCategories = Array.from(checkboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

        // Фильтруем данные, оставляя только те что соответствуют выбранным категориям
        const filteredData = allData.filter(item => {
             if(checkedCategories.length === 0) return true; // Если не выбраны фильтры - показываем всё
            return checkedCategories.some(category => item.category.includes(category));
        });
       renderDictionary(filteredData); // Отображаем отфильтрованные слова
    });
});