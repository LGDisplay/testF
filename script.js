const contestants = [
    {
        name: "생산운영 1",
        image: "image/생산운영 1.PNG"
    },
    {
        name: "생산운영 2",
        image: "image/생산운영 2.png"
    },
    {
        name: "검사/품질 1",
        image: "image/검사_품질 1.png"
    },
    {
        name: "검사/품질 2",
        image: "image/검사_품질 2.png"
    },
    {
        name: "설계/개발 1",
        image: "image/설계_개발 1.png"
    },
    {
        name: "설계/개발 2",
        image: "image/LG Display.PNG"
    },
    {
        name: "공정/장비 1",
        image: "image/공정_장비 1.png"
    },
    {
        name: "공정/장비 2",
        image: "image/공정_장비 2.png"
    }
];

let currentContestantIndex = 0;
let currentJudgeName = '';

const nameEl = document.getElementById('contestantName');
const imageEl = document.getElementById('contestantImage');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const saveBtn = document.getElementById('saveBtn');
const judgeNameInput = document.getElementById('judgeNameInput');
const innovationInput = document.getElementById('innovationScore');
const presentationInput = document.getElementById('presentationScore');
const technicalInput = document.getElementById('technicalScore');
const totalScoreEl = document.getElementById('totalScore');
const popup = document.getElementById('popup');
const overlay = document.getElementById('overlay');
const popupMessage = document.getElementById('popupMessage');
const closePopupBtn = document.getElementById('closePopupBtn');

// Error message elements
const innovationErrorEl = document.getElementById('innovationError');
const presentationErrorEl = document.getElementById('presentationError');
const technicalErrorEl = document.getElementById('technicalError');

function validateScore(input, errorEl) {
    const value = +input.value;
    const min = +input.min;
    const max = +input.max;

    // Clear previous error
    input.classList.remove('invalid');
    errorEl.textContent = '';

    // Check if input is empty
    if (input.value.trim() === '') {
        input.classList.add('invalid');
        errorEl.textContent = '점수를 입력해 주세요';
        return false;
    }

    // Check if value is a number
    if (isNaN(value)) {
        input.classList.add('invalid');
        errorEl.textContent = '숫자를 입력해 주세요';
        return false;
    }

    // Check if value is within range
    if (value < min || value > max) {
        input.classList.add('invalid');
        errorEl.textContent = `점수는 ${min}부터 ${max}까지 입력해 주세요`;
        return false;
    }

    return true;
}

function validateAllScores() {
    const innovationValid = validateScore(innovationInput, innovationErrorEl);
    const presentationValid = validateScore(presentationInput, presentationErrorEl);
    const technicalValid = validateScore(technicalInput, technicalErrorEl);

    return innovationValid && presentationValid && technicalValid;
}

function updateContestantDisplay() {
    const contestant = contestants[currentContestantIndex];
    nameEl.textContent = contestant.name;
    imageEl.src = contestant.image;

    // Reset score inputs and errors
    innovationInput.value = '';
    presentationInput.value = '';
    technicalInput.value = '';
    innovationErrorEl.textContent = '';
    presentationErrorEl.textContent = '';
    technicalErrorEl.textContent = '';
    innovationInput.classList.remove('invalid');
    presentationInput.classList.remove('invalid');
    technicalInput.classList.remove('invalid');

    // Update navigation buttons
    prevBtn.disabled = currentContestantIndex === 0;
    nextBtn.disabled = currentContestantIndex === contestants.length - 1;

    // Reset total score
    totalScoreEl.textContent = '0';
}

function calculateTotalScore() {
    if (!validateAllScores()) {
        totalScoreEl.textContent = '0';
        return;
    }

    const innovation = +innovationInput.value || 0;
    const presentation = +presentationInput.value || 0;
    const technical = +technicalInput.value || 0;
    const totalScore = innovation + presentation + technical;
    totalScoreEl.textContent = totalScore.toFixed(1);
}

function showPopup(message) {
    popupMessage.textContent = message;
    popup.style.display = 'block';
    overlay.style.display = 'block';
}

function closePopup() {
    popup.style.display = 'none';
    overlay.style.display = 'none';
}

function saveScore() {
    // Validate judge name
    const judgeName = judgeNameInput.value.trim();
    if (!judgeName || judgeName === "평가자 선택 필요") {
        alert('평자가를 선택해 주세요!');
        return;
    }

    // Validate all scores
    if (!validateAllScores()) {
        alert('점수를 재확인해 주세요');
        return;
    }

    const contestant = contestants[currentContestantIndex];
    const scoreData = {
        judgeName: judgeName,
        name: contestant.name,
        innovationScore: +innovationInput.value,
        presentationScore: +presentationInput.value,
        technicalScore: +technicalInput.value,
        totalScore: +totalScoreEl.textContent
    };

    try {
        // Thay thế URL này bằng URL của Google Apps Script của bạn
        fetch('https://script.google.com/macros/s/AKfycbwvUk2QSyE1jXFmZLC3BCiHPSDN-5NuRcLUkL2CTE2KjnZ7hgmz7N2-DRqGN722HKDiKA/exec', {
            method: 'POST',
            body: JSON.stringify(scoreData)
        })
        .then(response => {
            if (response.ok) {
                showPopup(`${contestant.name}님에게 체점 성공!`);
                
                // Auto-navigate to next contestant if not the last one
                if (currentContestantIndex < contestants.length - 1) {
                    setTimeout(() => {
                        currentContestantIndex++;
                        updateContestantDisplay();
                        closePopup();
                    }, 1500); // Small delay to allow user to see success message
                }
            } else {
                throw new Error('저장 오류');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Lỗi: ' + error.message);
        });
    } catch (error) {
        alert('Lỗi: ' + error.message);
    }
}

prevBtn.addEventListener('click', () => {
    if (currentContestantIndex > 0) {
        currentContestantIndex--;
        updateContestantDisplay();
    }
});

nextBtn.addEventListener('click', () => {
    // Check if scores are entered
    if (!validateAllScores()) {
        alert('모든 점수를 입력해 주세요!');
        return;
    }

    if (currentContestantIndex < contestants.length - 1) {
        currentContestantIndex++;
        updateContestantDisplay();
    }
});

saveBtn.addEventListener('click', saveScore);
closePopupBtn.addEventListener('click', closePopup);

judgeNameInput.addEventListener('change', updateContestantDisplay);

[innovationInput, presentationInput, technicalInput].forEach(input => {
    input.addEventListener('input', () => {
        validateScore(input, 
            input === innovationInput ? innovationErrorEl :
            input === presentationInput ? presentationErrorEl : 
            technicalErrorEl
        );
        calculateTotalScore();
    });
});

// Initial display
updateContestantDisplay();