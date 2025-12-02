// 應用狀態
const state = {
    currentScreen: 'mainMenu',
    settings: {
        content: [],
        questionCount: 5,
        mode: 'standard' // 'standard' 或 'strict'
    },
    quiz: {
        questions: [],
        currentQuestionIndex: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        userAnswers: [],
        mistakes: []
    }
};

// DOM 元素
const screens = {
    mainMenu: document.getElementById('mainMenu'),
    settingsScreen: document.getElementById('settingsScreen'),
    quizScreen: document.getElementById('quizScreen'),
    resultScreen: document.getElementById('resultScreen')
};

// 按鈕元素
const settingsBtn = document.getElementById('settingsBtn');
const startBtn = document.getElementById('startBtn');
const backToMenuBtn = document.getElementById('backToMenuBtn');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');
const resetSettingsBtn = document.getElementById('resetSettingsBtn');
const submitAnswerBtn = document.getElementById('submitAnswerBtn');
const nextQuestionBtn = document.getElementById('nextQuestionBtn');
const restartBtn = document.getElementById('restartBtn');

// 輸入元素
const contentInput = document.getElementById('contentInput');
const questionCountInput = document.getElementById('questionCount');
const decreaseBtn = document.getElementById('decreaseBtn');
const increaseBtn = document.getElementById('increaseBtn');
const answerInput = document.getElementById('answerInput');
const modeInputs = document.querySelectorAll('input[name="mode"]');

// 顯示元素
const currentQuestionEl = document.getElementById('currentQuestion');
const totalQuestionsEl = document.getElementById('totalQuestions');
const correctCountEl = document.getElementById('correctCount');
const incorrectCountEl = document.getElementById('incorrectCount');
const questionTextEl = document.getElementById('questionText');
const feedbackSection = document.getElementById('feedbackSection');
const progressBar = document.getElementById('progressBar');
const finalCorrectCount = document.getElementById('finalCorrectCount');
const finalIncorrectCount = document.getElementById('finalIncorrectCount');
const finalTotalCount = document.getElementById('finalTotalCount');
const accuracyValue = document.getElementById('accuracyValue');
const accuracyFill = document.getElementById('accuracyFill');
const mistakesSection = document.getElementById('mistakesSection');
const sampleItems = document.querySelectorAll('.sample-item');
const loadSampleBtn = document.getElementById('loadSampleBtn');

// 預設內容
const defaultContent = [
    { front: "桃李不言", back: "下自成蹊" },
    { front: "己所不欲", back: "勿施於人" },
    { front: "學而不厭", back: "誨人不倦" },
    { front: "有朋自遠方來", back: "不亦樂乎" },
    { front: "溫故而知新", back: "可以為師矣" },
    { front: "知之為知之", back: "不知為不知" },
    { front: "三人行", back: "必有我師焉" },
    { front: "君子坦蕩蕩", back: "小人長戚戚" }
];

// 初始化應用
function initApp() {
    // 載入預設內容到設定區域
    loadDefaultContent();
    
    // 設置事件監聽器
    setupEventListeners();
    
    // 顯示主選單
    showScreen('mainMenu');
}

// 載入預設內容
function loadDefaultContent() {
    // 將預設內容轉換為文字格式
    const contentText = defaultContent.map(item => `${item.front},${item.back}`).join('\n');
    contentInput.value = contentText;
    
    // 解析內容
    parseContent(contentText);
}

// 解析內容輸入
function parseContent(contentText) {
    const lines = contentText.split('\n').filter(line => line.trim() !== '');
    state.settings.content = [];
    
    lines.forEach(line => {
        const parts = line.split(',').map(part => part.trim());
        if (parts.length >= 2) {
            state.settings.content.push({
                front: parts[0],
                back: parts[1]
            });
        }
    });
    
    // 如果解析到的內容為空，使用預設內容
    if (state.settings.content.length === 0) {
        state.settings.content = [...defaultContent];
    }
}

// 設置事件監聽器
function setupEventListeners() {
    // 按鈕點擊事件
    settingsBtn.addEventListener('click', () => showScreen('settingsScreen'));
    startBtn.addEventListener('click', startQuiz);
    backToMenuBtn.addEventListener('click', () => showScreen('mainMenu'));
    saveSettingsBtn.addEventListener('click', saveSettingsAndStart);
    resetSettingsBtn.addEventListener('click', resetSettings);
    submitAnswerBtn.addEventListener('click', submitAnswer);
    nextQuestionBtn.addEventListener('click', nextQuestion);
    restartBtn.addEventListener('click', restartQuiz);
    
    // 數字選擇器事件
    decreaseBtn.addEventListener('click', () => {
        let value = parseInt(questionCountInput.value);
        if (value > 1) {
            questionCountInput.value = value - 1;
        }
    });
    
    increaseBtn.addEventListener('click', () => {
        let value = parseInt(questionCountInput.value);
        if (value < 50) {
            questionCountInput.value = value + 1;
        }
    });
    
    // 輸入框事件
    questionCountInput.addEventListener('change', () => {
        let value = parseInt(questionCountInput.value);
        if (value < 1) questionCountInput.value = 1;
        if (value > 50) questionCountInput.value = 50;
    });
    
    answerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            submitAnswer();
        }
    });
    
    // 模式選擇事件
    modeInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            state.settings.mode = e.target.value;
        });
    });
    
    // 示例內容點擊事件
    sampleItems.forEach(item => {
        item.addEventListener('click', () => {
            const text = item.getAttribute('data-text');
            contentInput.value += (contentInput.value ? '\n' : '') + text;
        });
    });
    
    // 載入示例按鈕事件
    loadSampleBtn.addEventListener('click', loadDefaultContent);
}

// 顯示指定畫面
function showScreen(screenName) {
    // 隱藏所有畫面
    Object.values(screens).forEach(screen => {
        screen.classList.remove('active');
    });
    
    // 顯示指定畫面
    screens[screenName].classList.add('active');
    state.currentScreen = screenName;
    
    // 如果切換到答題畫面，初始化答題狀態
    if (screenName === 'quizScreen') {
        initQuiz();
    }
}

// 儲存設定並開始測驗
function saveSettingsAndStart() {
    // 解析內容
    parseContent(contentInput.value);
    
    // 儲存題目數量
    state.settings.questionCount = parseInt(questionCountInput.value);
    
    // 儲存模式
    const selectedMode = document.querySelector('input[name="mode"]:checked');
    if (selectedMode) {
        state.settings.mode = selectedMode.value;
    }
    
    // 開始測驗
    startQuiz();
}

// 重置設定
function resetSettings() {
    loadDefaultContent();
    questionCountInput.value = 5;
    document.querySelector('input[name="mode"][value="standard"]').checked = true;
}

// 開始測驗
function startQuiz() {
    // 如果沒有設定內容，使用預設內容
    if (state.settings.content.length === 0) {
        parseContent(contentInput.value || defaultContent.map(item => `${item.front},${item.back}`).join('\n'));
    }
    
    // 確保輸入框啟用
    answerInput.disabled = false;
    
    // 準備測驗題目
    prepareQuizQuestions();
    
    // 顯示答題畫面
    showScreen('quizScreen');
}

// 準備測驗題目
function prepareQuizQuestions() {
    const { content, questionCount } = state.settings;
    
    // 重置測驗狀態
    state.quiz = {
        questions: [],
        currentQuestionIndex: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        userAnswers: [],
        mistakes: []
    };
    
    // 如果要求的題數多於可用內容，則使用所有內容
    const questionCountToUse = Math.min(questionCount, content.length);
    
    // 隨機選擇題目
    const shuffled = [...content].sort(() => Math.random() - 0.5);
    state.quiz.questions = shuffled.slice(0, questionCountToUse);
    
    // 更新顯示
    totalQuestionsEl.textContent = questionCountToUse;
    updateQuizDisplay();
}

// 初始化測驗
function initQuiz() {
    state.quiz.currentQuestionIndex = 0;
    state.quiz.correctAnswers = 0;
    state.quiz.incorrectAnswers = 0;
    state.quiz.userAnswers = [];
    state.quiz.mistakes = [];
    
    updateQuizDisplay();
    answerInput.value = '';
    answerInput.disabled = false;  // 確保輸入框啟用
    answerInput.focus();
    feedbackSection.innerHTML = '';
    feedbackSection.className = 'feedback-section';
    nextQuestionBtn.style.display = 'none';
    submitAnswerBtn.style.display = 'inline-flex';
    
    // 重置按鈕文字（在嚴格模式下可能會被改變）
    submitAnswerBtn.textContent = '提交答案';
    submitAnswerBtn.innerHTML = '<i class="fas fa-paper-plane"></i> 提交答案';
}

// 更新測驗顯示
function updateQuizDisplay() {
    const { currentQuestionIndex, questions, correctAnswers, incorrectAnswers } = state.quiz;
    
    if (questions.length === 0) return;
    
    // 更新進度條
    const progress = ((currentQuestionIndex) / questions.length) * 100;
    progressBar.style.width = `${progress}%`;
    
    // 更新題目資訊
    currentQuestionEl.textContent = currentQuestionIndex + 1;
    correctCountEl.textContent = correctAnswers;
    incorrectCountEl.textContent = incorrectAnswers;
    
    // 顯示當前題目
    const currentQuestion = questions[currentQuestionIndex];
    questionTextEl.textContent = currentQuestion.front;
}

// 提交答案
function submitAnswer() {
    const { currentQuestionIndex, questions } = state.quiz;
    const currentQuestion = questions[currentQuestionIndex];
    const userAnswer = answerInput.value.trim();
    
    if (!userAnswer) {
        showFeedback('請輸入答案！', 'incorrect');
        return;
    }
    
    // 儲存使用者答案
    state.quiz.userAnswers[currentQuestionIndex] = userAnswer;
    
    // 檢查答案是否正確（簡單比對，忽略空白和標點）
    const normalizedUserAnswer = userAnswer.replace(/\s+/g, '');
    const normalizedCorrectAnswer = currentQuestion.back.replace(/\s+/g, '');
    
    const isCorrect = normalizedUserAnswer === normalizedCorrectAnswer;
    
    if (isCorrect) {
        state.quiz.correctAnswers++;
        showFeedback(`<i class="fas fa-check-circle"></i> 正確！答案為：${currentQuestion.back}`, 'correct');
    } else {
        state.quiz.incorrectAnswers++;
        state.quiz.mistakes.push({
            question: currentQuestion.front,
            userAnswer: userAnswer,
            correctAnswer: currentQuestion.back
        });
        showFeedback(`<i class="fas fa-times-circle"></i> 錯誤！正確答案為：<span class="correct-answer">${currentQuestion.back}</span>`, 'incorrect');
    }
    
    // 根據模式顯示不同的按鈕
    if (state.settings.mode === 'strict' && !isCorrect) {
        // 嚴格模式：答錯時不能直接下一題，需要重新輸入
        answerInput.value = '';
        answerInput.disabled = false;  // 確保輸入框啟用
        answerInput.focus();
        submitAnswerBtn.textContent = '重新提交';
        submitAnswerBtn.innerHTML = '<i class="fas fa-redo"></i> 重新提交';
        return;
    }
    
    // 標準模式或嚴格模式下答對：顯示下一題按鈕
    submitAnswerBtn.style.display = 'none';
    nextQuestionBtn.style.display = 'inline-flex';
    answerInput.disabled = true;  // 暫時禁用輸入框，直到下一題
}

// 顯示回饋
function showFeedback(message, type) {
    feedbackSection.innerHTML = message;
    feedbackSection.className = `feedback-section feedback-${type}`;
}

// 下一題
function nextQuestion() {
    state.quiz.currentQuestionIndex++;
    
    // 檢查是否還有下一題
    if (state.quiz.currentQuestionIndex < state.quiz.questions.length) {
        // 還有題目，準備下一題
        updateQuizDisplay();
        answerInput.value = '';
        answerInput.disabled = false;  // 確保輸入框啟用
        answerInput.focus();
        feedbackSection.innerHTML = '';
        feedbackSection.className = 'feedback-section';
        nextQuestionBtn.style.display = 'none';
        submitAnswerBtn.style.display = 'inline-flex';
        submitAnswerBtn.textContent = '提交答案';
        submitAnswerBtn.innerHTML = '<i class="fas fa-paper-plane"></i> 提交答案';
    } else {
        // 測驗結束，顯示結果
        showResults();
    }
}

// 顯示結果
function showResults() {
    showScreen('resultScreen');
    
    const { correctAnswers, incorrectAnswers, questions, mistakes } = state.quiz;
    const totalQuestions = questions.length;
    const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    
    // 更新統計數字
    finalCorrectCount.textContent = correctAnswers;
    finalIncorrectCount.textContent = incorrectAnswers;
    finalTotalCount.textContent = totalQuestions;
    accuracyValue.textContent = `${accuracy}%`;
    accuracyFill.style.width = `${accuracy}%`;
    
    // 顯示錯誤題目
    displayMistakes(mistakes);
}

// 顯示錯誤題目
function displayMistakes(mistakes) {
    if (mistakes.length === 0) {
        mistakesSection.innerHTML = `
            <div class="no-mistakes">
                <i class="fas fa-trophy"></i>
                <h3>太棒了！全部答對！</h3>
                <p>您已經完全掌握了這些成語名句。</p>
            </div>
        `;
        return;
    }
    
    let mistakesHTML = '<h3><i class="fas fa-exclamation-triangle"></i> 需要複習的題目</h3>';
    
    mistakes.forEach((mistake, index) => {
        mistakesHTML += `
            <div class="mistake-item">
                <div class="mistake-question">${index + 1}. ${mistake.question}______</div>
                <div class="mistake-answer">您的答案：${mistake.userAnswer}</div>
                <div class="mistake-correct">正確答案：${mistake.correctAnswer}</div>
            </div>
        `;
    });
    
    mistakesSection.innerHTML = mistakesHTML;
}

// 重新開始測驗
// 重新開始測驗
function restartQuiz() {
    // 確保輸入框是啟用狀態
    answerInput.disabled = false;
    
    // 重置按鈕狀態
    submitAnswerBtn.style.display = 'inline-flex';
    submitAnswerBtn.textContent = '提交答案';
    submitAnswerBtn.innerHTML = '<i class="fas fa-paper-plane"></i> 提交答案';
    
    // 顯示主選單
    showScreen('mainMenu');
}

// 初始化應用
document.addEventListener('DOMContentLoaded', initApp);