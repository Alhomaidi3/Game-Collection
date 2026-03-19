function showGame(game) {
    document.querySelectorAll('.game-container').forEach(g => g.classList.remove('active'));
    document.getElementById(game).classList.add('active');
}

/* XO Game */
const messageXO = document.getElementById('messageXO');
const cells = document.querySelectorAll('#xo .cell');
let currentPlayer = 'X';
let gameActive = true;
let gameState = Array(9).fill('');
const winningConditions = [
    [0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]
];
cells.forEach(cell => cell.addEventListener('click', handleCellClickXO));
function handleCellClickXO(e){
    const index = parseInt(e.target.getAttribute('data-index'));
    if(gameState[index]!=='' || !gameActive) return;
    gameState[index]=currentPlayer;
    e.target.textContent=currentPlayer;
    e.target.classList.add('taken');
    checkResultXO();
}
function checkResultXO(){
    let roundWon = false;
    for(let w of winningConditions){
        let [a,b,c] = w.map(i=>gameState[i]);
        if(a!=='' && a===b && b===c){ roundWon=true; break; }
    }
    if(roundWon){
        messageXO.textContent=`Player ${currentPlayer} wins! 🎉`;
        messageXO.classList.add('winner');
        gameActive=false;
        return;
    }
    if(!gameState.includes('')){
        messageXO.textContent='Draw! 🤝';
        gameActive=false;
        return;
    }
    currentPlayer = currentPlayer==='X'?'O':'X';
    messageXO.textContent=`Player ${currentPlayer}'s turn`;
}
function resetXO(){
    gameActive=true;
    currentPlayer='X';
    gameState=Array(9).fill('');
    messageXO.textContent=`Player ${currentPlayer}'s turn`;
    messageXO.classList.remove('winner');
    cells.forEach(c=>{c.textContent='';c.classList.remove('taken');});
}

/* Quiz Game */
const quizData = [
{question: "What is the largest planet in the solar system?", options: ["Earth", "Jupiter", "Venus", "Mars"], answer: "Jupiter"},
{question: "How many pillars of Islam are there?", options: ["3", "4", "5", "6"], answer: "5"},
{question: "Which planet is closest to the Sun?", options: ["Earth", "Mars", "Mercury", "Venus"], answer: "Mercury"},
{question: "Who is the Seal of the Prophets?", options: ["Jesus", "Moses", "Muhammad ﷺ", "Abraham"], answer: "Muhammad ﷺ"},
{question: "Which organ pumps blood in the body?", options: ["Lungs", "Liver", "Brain", "Heart"], answer: "Heart"},
{question: "How many obligatory prayers are there per day?", options: ["3", "4", "5", "6"], answer: "5"},
{question: "Which gas do we need to breathe?", options: ["Nitrogen", "Oxygen", "Carbon Dioxide", "Hydrogen"], answer: "Oxygen"},
{question: "Which month do Muslims fast in?", options: ["Sha'ban", "Ramadan", "Dhu al-Hijjah", "Muharram"], answer: "Ramadan"},
{question: "Which is the first revealed surah in the Quran?", options: ["Al-Fatiha", "Al-Baqara", "Al-Alaq", "An-Nas"], answer: "Al-Alaq"},
{question: "How many planets are in the solar system?", options: ["7", "8", "9", "10"], answer: "8"},
{question: "What is the Qibla for Muslims?", options: ["Medina", "Al-Aqsa", "Kaaba", "Arafat"], answer: "Kaaba"},
{question: "What is the largest organ in the human body?", options: ["Heart", "Skin", "Liver", "Lungs"], answer: "Skin"},
{question: "Who is the first prophet?", options: ["Noah", "Adam", "Abraham", "Moses"], answer: "Adam"},
{question: "Which planet is known as the Red Planet?", options: ["Jupiter", "Saturn", "Mars", "Venus"], answer: "Mars"},
{question: "How many surahs are in the Quran?", options: ["112", "113", "114", "115"], answer: "114"},
{question: "What is the liquid of life?", options: ["Air", "Water", "Blood", "Oil"], answer: "Water"},
{question: "Which is the longest surah in the Quran?", options: ["Al-Imran", "An-Nisa", "Al-Baqara", "Al-An'am"], answer: "Al-Baqara"},
{question: "Which is the center of the nervous system?", options: ["Heart", "Stomach", "Brain", "Lungs"], answer: "Brain"},
{question: "How many times is Ramadan mentioned in the Quran?", options: ["Once", "Twice", "3 times", "5 times"], answer: "Once"},
{question: "What is 5 × 6?", options: ["30", "25", "35", "40"], answer: "30"},
{question: "Which language is used for web pages?", options: ["Python", "HTML", "C++", "Java"], answer: "HTML"},
{question: "Which animal is known as the king of the jungle?", options: ["Lion", "Cheetah", "Tiger", "Bear"], answer: "Lion"},
{question: "Which is the longest river in the world?", options: ["Nile", "Amazon", "Danube", "Mississippi"], answer: "Nile"},
{question: "Which is the smallest bone in the human body?", options: ["Knee", "Ear", "Stapes", "Neck"], answer: "Stapes"},
{question: "What is the national animal of Australia?", options: ["Kangaroo", "Kooka", "Wallaby", "Emu"], answer: "Kangaroo"},
{question: "Which is the fastest bird?", options: ["Falcon", "Ostrich", "Crow", "Eagle"], answer: "Falcon"},
{question: "Which chemical element has the symbol H?", options: ["Hydrogen", "Helium", "Hydrate", "Holmium"], answer: "Hydrogen"},
{question: "Which of these countries is in Africa?", options: ["Japan", "Egypt", "France", "Germany"], answer: "Egypt"},
{question: "What is the largest desert in the world?", options: ["Nile Coast", "Sahara", "Gobi", "Kalahari"], answer: "Sahara"},
{question: "How many teeth does an adult have?", options: ["28", "30", "32", "34"], answer: "32"},
{question: "Which country is known as the land of a thousand lakes?", options: ["Finland", "Switzerland", "Canada", "Norway"], answer: "Finland"},
{question: "What is the highest mountain in the world?", options: ["Everest", "K2", "Kangchenjunga", "Lhotse"], answer: "Everest"},
{question: "Which planet has the most moons?", options: ["Mars", "Earth", "Jupiter", "Saturn"], answer: "Saturn"},
{question: "How many letters are in the Arabic alphabet?", options: ["26", "27", "28", "29"], answer: "28"}
];

const QUESTIONS_PER_ROUND = 10;
let currentQuestion = 0;
let score = 0;
let selectedQuestions = [];
const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const messageEl = document.getElementById('messageQuiz');

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startNewRound() {
    shuffleArray(quizData);
    selectedQuestions = quizData.slice(0, QUESTIONS_PER_ROUND);
    currentQuestion = 0;
    score = 0;
    loadQuestion();
}

function loadQuestion() {
    const q = selectedQuestions[currentQuestion];
    questionEl.textContent = q.question;
    optionsEl.innerHTML = "";
    messageEl.textContent = "";
    const shuffledOptions = shuffleArray([...q.options]);
    shuffledOptions.forEach(opt => {
        const btn = document.createElement('button');
        btn.textContent = opt;
        btn.classList.add('option');
        btn.onclick = () => checkAnswer(btn, q.answer);
        optionsEl.appendChild(btn);
    });
}

function checkAnswer(button, correctAnswer) {
    const allButtons = Array.from(optionsEl.children);
    if (button.textContent === correctAnswer) {
        button.classList.add('correct');
        messageEl.textContent = "✅ Correct!";
        score++;
    } else {
        button.classList.add('wrong');
        messageEl.textContent = `❌ Wrong! Correct answer: ${correctAnswer}`;
        allButtons.forEach(btn => {
            if (btn.textContent === correctAnswer) btn.classList.add('correct');
        });
    }
    allButtons.forEach(btn => btn.disabled = true);
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion >= selectedQuestions.length) {
        questionEl.textContent = `Round finished! Your score: ${score} / ${selectedQuestions.length}`;
        optionsEl.innerHTML = "";
        messageEl.textContent = "";
        setTimeout(startNewRound, 2000);
    } else {
        loadQuestion();
    }
}

startNewRound();

/* Number Guess */
let secretNumber = Math.floor(Math.random()*100)+1;

function checkGuess(){
    const guessInput=document.getElementById("guessInput");
    const message=document.getElementById("messageGuess");
    const userGuess = Number(guessInput.value);
    if(!userGuess || userGuess<1 || userGuess>100){ message.textContent="❌ Enter a valid number between 1 and 100"; return;}
    if(userGuess===secretNumber){ message.textContent="🎉 Correct! Well done"; message.classList.add("success"); }
    else if(userGuess>secretNumber){ message.textContent="🔻 Lower"; message.classList.remove("success"); }
    else{ message.textContent="🔺 Higher"; message.classList.remove("success"); }
}

function resetGuess(){ 
    secretNumber = Math.floor(Math.random()*100)+1; 
    document.getElementById("guessInput").value=""; 
    document.getElementById("messageGuess").textContent=""; 
    document.getElementById("messageGuess").classList.remove("success"); 
}