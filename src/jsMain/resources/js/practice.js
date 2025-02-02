const tasks = [
    [
        {
          id: 'task1',
          type: 'select',
          question: 'When I had to give a speech, I ... a blank on everything I wanted to say.',
          options: ['wrote', 'drew', 'sketched'],
          correctAnswer: 'drew'
        },
        {
          id: 'task2',
          type: 'select',
          question: "Don’t get all bent out of … if things don’t go as planned. — Не расстраивайтесь, если все идет не по плану.",
          options: ['box', 'shape', 'frame'],
          correctAnswer: 'shape'
         },
         {
           id: 'task3',
          type: 'select',
           question: "I’m really ticked … — my flight has been cancelled! — Как же меня это бесит — мой рейс отменили!",
           options: ['down', 'off', 'up'],
          correctAnswer: 'off'
         }
     ],
    [
        {
          id: 'task4',
           type: 'select',
            question: "1. I can’t remember his name; every time I try to think of it, I ... a blank",
            options: ['blow', 'give', 'draw'],
           correctAnswer: 'draw'
       },
        {
           id: 'task5',
           type: 'select',
           question: "2. Kate studied hard and was able to ...  her final exam with flying colors.",
           options: ['miss', 'fail', 'ace'],
          correctAnswer: 'ace'
        },
       {
           id: 'task6',
           type: 'select',
            question: "3. ...  out of here! You can’t be serious about that.",
           options: ['get', 'go', 'run'],
            correctAnswer: 'get'
      }
    ],
     [
        {
         id: 'task7',
           type: 'select',
           question: "Jeremy was <b>ticked off</b> after his car got towed for parking in a no-parking zone. — Джереми был раздражен после того, как его машину эвакуировали за парковку в запрещенной зоне.",
           options: ['calm', 'annoyed'],
            correctAnswer: 'calm'
        },
       {
          id: 'task8',
           type: 'select',
            question: "You know, Bobby just comes up and ... , \"Hey, what are you doing tonight? Wanna have some fun?\"",
          options: ['go', 'says', 'goes', 'comes'],
           correctAnswer: 'goes'
       },
      {
         id: 'task9',
          type: 'select',
           question: 'I am ... this test',
          options: ['love', 'hate','enjoy', 'skip'],
           correctAnswer: 'hate'
      }
    ]
  ];

let currentTaskSet = 0;


function checkAnswer(task, userAnswer) {
    if (task.type === 'select') {
        return userAnswer === task.correctAnswer;
    }
    return false;
}

function generateTasksHTML() {
    const taskContent = document.querySelector('.task-content');
    if (!taskContent) return;
    taskContent.innerHTML = '';
    const currentTasks = tasks[currentTaskSet];

    currentTasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.classList.add('task');
        taskElement.innerHTML = `<p>${task.question}</p>
         <div class="options-container" data-task-id="${task.id}">
         ${generateOptionsHTML(task.options, task.id)}
        </div>
        <p class="task-result" id="${task.id}-result"></p>
        <hr>`;
        taskContent.appendChild(taskElement);
    });
}


function generateOptionsHTML(options, taskId) {
    return options
    .map(
      option => `<button class="option-button" data-task-id="${taskId}" data-option="${option}">${option}</button>`)
       .join('');
}


function setupEventListeners() {
    document.addEventListener('click', (event) => {
         if (event.target.classList.contains('option-button')) {
           const button = event.target;
           const taskId = button.getAttribute('data-task-id');
            const selectedOption = button.getAttribute('data-option');
           const taskSet = tasks[currentTaskSet]
           const task = taskSet.find(task => task.id === taskId)
           const resultElement = document.getElementById(`${taskId}-result`)
           const result = checkAnswer(task, selectedOption);

            if (result) {
                 resultElement.textContent = 'Правильно!';
                resultElement.style.color = 'green';
                 checkIfAllTasksDone();
            } else {
                resultElement.textContent = 'Неправильно!';
                resultElement.style.color = 'red';
            }
         }
    });
}

 function checkIfAllTasksDone() {
    const taskSet = tasks[currentTaskSet];
    const allCorrect = taskSet.every(task => {
         const resultElement = document.getElementById(`${task.id}-result`);
        if(!resultElement) return false;
        return resultElement.textContent === 'Правильно!'

    })
     if (allCorrect) {
        const taskContent = document.querySelector('.task-content')
        if (currentTaskSet < tasks.length -1) {
           currentTaskSet++;
           taskContent.innerHTML = `<p>Все задания выполнены. Начинаем следующий этап!</p>`
             setTimeout(generateTasksHTML, 2000)
          } else {
                taskContent.innerHTML = `<p>Все задания выполнены! Вы молодец!</p>`;
          }
    }
}

document.addEventListener('DOMContentLoaded', () => {
   generateTasksHTML();
   setupEventListeners();
});