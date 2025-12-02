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
const loadSampleBtn = document.getElementById('loadSampleBtn');

// 預設內容
const defaultContent = [
    { front: "會挽雕弓如滿月", back: "西北望，射天狼" },
    { front: "老驥伏櫪", back: "志在千里；烈士暮年，壯心不已" },
    { front: "停杯投箸不能食", back: "拔劍四顧心茫然。欲渡黃河冰塞川，將登太行雪滿山" },
    { front: "濁酒一杯定萬里", back: "燕然未勒歸無計，羌管悠悠霜滿地。人不寐，將軍白髮征夫淚" },
    { front: "閒來垂釣碧溪上", back: "忽復乘舟夢日邊" },
    { front: "春眠不覺曉", back: "處處聞啼鳥" },
    { front: "春潮帶雨晚來急", back: "野渡無人舟自橫" },
    { front: "春種一粒粟", back: "秋收萬顆子" },
    { front: "春風十里揚州路", back: "卷上珠簾總不如" },
    { front: "雲想衣裳花想容", back: "春風拂檻露華濃" },
    { front: "一日不見", back: "如三秋兮" },
    { front: "輔車相依", back: "唇亡齒寒" },
    { front: "欲加之罪", back: "何患無辭" },
    { front: "禍兮", back: "福之所倚；福兮，福之所伏" },
    { front: "人無遠慮", back: "必有近憂" },
    { front: "歲寒", back: "然後知松柏之後凋也" },
    { front: "其身正", back: "不令而行；其身不正，雖令不從" },
    { front: "同聲相應", back: "同氣相求" },
    { front: "長太息以掩涕兮", back: "民生之多艱" },
    { front: "舉世皆濁我獨清", back: "眾人皆醉我獨醒" },
    { front: "苟余心之端直兮", back: "雖其何傷" },
    { front: "其曲彌高", back: "其和彌寡" },
    { front: "富貴不能濕", back: "貧賤不能移，威武不能屈" },
    { front: "青，取之於藍", back: "而青於藍" },
    { front: "避其銳氣", back: "擊其惰歸" },
    { front: "靜若處女", back: "動若脫兔" },
    { front: "螳螂捕蟬", back: "黃雀在後" },
    { front: "不鳴則已", back: "一鳴驚人" },
    { front: "桃李不言", back: "下自成蹊" },
    { front: "不入虎穴", back: "焉得虎子" }
];

// 初始化應用
function initApp() {
    // 設置事件監聽器
    setupEventListeners();
    
    // 載入預設內容
    loadDefaultContent();
    
    // 確保輸入框是啟用狀態
    answerInput.disabled = false;
    
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
    
    // 動態生成主選單的預設內容列表
    updateDefaultContentList();
    
    // 動態生成設定畫面的示例內容
    updateSampleItems();
}

// 更新主選單的預設內容列表
function updateDefaultContentList() {
    const defaultListContainer = document.getElementById('defaultListContainer');
    if (!defaultListContainer) return;
    
    defaultListContainer.innerHTML = '';
    
    // 顯示前10個項目，其餘用省略號表示
    const displayCount = Math.min(defaultContent.length, 10);
    
    for (let i = 0; i < displayCount; i++) {
        const item = defaultContent[i];
        const li = document.createElement('div');
        li.className = 'default-item';
        li.textContent = `${item.front}，${item.back}`;
        defaultListContainer.appendChild(li);
    }
    
    if (defaultContent.length > 10) {
        const moreInfo = document.createElement('div');
        moreInfo.className = 'more-items';
        moreInfo.textContent = `... 還有 ${defaultContent.length - 10} 句`;
        defaultListContainer.appendChild(moreInfo);
    }
}

// 更新設定畫面的示例內容
function updateSampleItems() {
    const sampleItemsContainer = document.getElementById('sampleItemsContainer');
    if (!sampleItemsContainer) return;
    
    sampleItemsContainer.innerHTML = '';
    
    // 顯示所有示例項目
    defaultContent.forEach(item => {
        const sampleItem = document.createElement('span');
        sampleItem.className = 'sample-item';
        sampleItem.setAttribute('data-text', `${item.front},${item.back}`);
        sampleItem.textContent = `${item.front}，${item.back}`;
        sampleItemsContainer.appendChild(sampleItem);
        
        // 添加點擊事件
        sampleItem.addEventListener('click', () => {
            const text = sampleItem.getAttribute('data-text');
            contentInput.value += (contentInput.value ? '\n' : '') + text;
        });
    });
}

// 解析內容輸入 - 增強版本，支援多種分隔符號和複雜格式
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
    
    // 如果切換到主選單，確保輸入框啟用
    if (screenName === 'mainMenu') {
        answerInput.disabled = false;
    }
}

// 儲存設定並開始測驗 - 修正版本，確保正確儲存新內容
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
    
    console.log('儲存設定後的內容:', state.settings.content);
    console.log('題目數量:', state.settings.questionCount);
    console.log('模式:', state.settings.mode);
    
    // 檢查是否有內容
    if (state.settings.content.length === 0) {
        alert('請輸入至少一則成語或名句！');
        return;
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
    answerInput.focus();
    
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
    
    console.log('準備測驗題目，可用內容:', content);
    
    // 如果要求的題數多於可用內容，則使用所有內容
    const questionCountToUse = Math.min(questionCount, content.length);
    
    console.log('預計題數:', questionCountToUse);
    
    // 隨機選擇題目
    const shuffled = [...content].sort(() => Math.random() - 0.5);
    state.quiz.questions = shuffled.slice(0, questionCountToUse);
    
    console.log('選中的題目:', state.quiz.questions);
    
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
    submitAnswerBtn.textContent = '提交答案';
    submitAnswerBtn.innerHTML = '<i class="fas fa-paper-plane"></i> 提交答案';
}

// 更新測驗顯示
function updateQuizDisplay() {
    const { currentQuestionIndex, questions, correctAnswers, incorrectAnswers } = state.quiz;
    
    if (questions.length === 0) {
        console.error('沒有題目可以顯示！');
        return;
    }
    
    // 更新進度條
    const progress = ((currentQuestionIndex) / questions.length) * 100;
    progressBar.style.width = `${progress}%`;
    
    // 更新題目資訊
    currentQuestionEl.textContent = currentQuestionIndex + 1;
    correctCountEl.textContent = correctAnswers;
    incorrectCountEl.textContent = incorrectAnswers;
    
    // 顯示當前題目
    const currentQuestion = questions[currentQuestionIndex];
    console.log('顯示題目:', currentQuestion);
    questionTextEl.textContent = currentQuestion.front;
}

// 提交答案
function submitAnswer() {
    const { currentQuestionIndex, questions } = state.quiz;
    
    if (!questions || questions.length === 0) {
        console.error('沒有題目！');
        return;
    }
    
    const currentQuestion = questions[currentQuestionIndex];
    const userAnswer = answerInput.value.trim();
    
    if (!userAnswer) {
        showFeedback('請輸入答案！', 'incorrect');
        answerInput.focus();
        return;
    }
    
    // 儲存使用者答案
    state.quiz.userAnswers[currentQuestionIndex] = userAnswer;
    
    // 檢查答案是否正確（簡單比對，忽略空白和標點）
    const normalizedUserAnswer = userAnswer.replace(/\s+/g, '');
    const normalizedCorrectAnswer = currentQuestion.back.replace(/\s+/g, '');
    
    const isCorrect = normalizedUserAnswer === normalizedCorrectAnswer;
    
    console.log('使用者答案:', userAnswer);
    console.log('正確答案:', currentQuestion.back);
    console.log('是否正確:', isCorrect);
    
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
        answerInput.disabled = false;
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
