const mainLogos = document.querySelector(".main-logos")
const nextBtn = document.querySelector(".next-btn")
const trxTexts = document.querySelectorAll(".trx-text img")
const matchLogo = document.querySelector(".match-logo")
const backBtn = document.querySelector(".back-btn")
const stepsSection = document.querySelector(".steps-section")
const nextBtnContainer = document.querySelector(".next-btn-container")
const userForm = document.querySelector("#user-form")
const memoryGame = document.querySelector(".memory-game")
const counterSpan = document.querySelector(".counter")
const cards = document.querySelectorAll('.memory-card-inner');
const cardsOuter = document.querySelectorAll('.memory-card');
const scoreSection = document.querySelector('.score-section');
const scoreSpans = document.querySelectorAll('.score-container span');
const userFormInputs = document.querySelectorAll('#user-form input');
const userFrontName = document.querySelector('.score-section h1 span');

let counter = 20
let consumedTime = 0
let step = 0
let gameEnd = false
let score = 0
let isEmpty = false;
let isEmailValid = true;
bestTime.innerHTML = "00:"+(localStorage.getItem("BestTime")!==null?localStorage.getItem("BestTime"):"00")
nextBtn.addEventListener("mousedown",()=>{
    nextBtn.style.left = "-15px"
    nextBtn.style.bottom = "-15px"
})
nextBtn.addEventListener("mouseup",()=>{
    setTimeout(()=>{
        nextBtn.style.left = "0px"
        nextBtn.style.bottom = "0px"
    },250)
})
nextBtn.addEventListener("click", () => {
    step++
    if (step == 1) {
        trxTexts.forEach(text => {
            text.style.maxWidth = "45%"
            text.style.margin = "5px 0"
        });
        matchLogo.style.opacity = "0"
        backBtn.style.visibility = "visible"
        backBtn.style.opacity = "1"
        stepsSection.style.visibility = "visible"
        stepsSection.style.opacity = "1"
        nextBtnContainer.style.bottom = "300px"
        nextBtnContainer.firstElementChild.innerHTML = "Next"
    }

    else if (step == 2) {
        memoryGame.style.opacity = "1"
        memoryGame.style.visibility = "visible"
        userForm.style.opacity = "0"
        backBtn.style.opacity = "0"
        stepsSection.style.opacity = "0"
        nextBtnContainer.style.opacity = "0"
        setTimeout(() => {
            stepsSection.style.visibility = "hidden"
        }, 500);
        setTimeout(() => {
            backBtn.style.visibility = "hidden"
            userForm.style.visibility = "hidden"
            nextBtnContainer.style.visibility = "hidden"
        }, 500);
        cards.forEach(card => {
            card.classList.add("flip")
            card.style.pointerEvents = "none"
        });
        let counterInterval = setInterval(() => {
            counter--
            counterSpan.innerHTML = counter
            
            if (score == 12){
                counter = 0
            }

            if (counter < 10) {
                counterSpan.innerHTML = "0" + counter
            }
            if (gameEnd) {
                consumedTime++
            }
            if (counter == 0) {
                if (gameEnd) {
                    let best_time = parseInt(localStorage.getItem("BestTime")?localStorage.getItem("BestTime"):0)
                    if (best_time == 0 || best_time == null || best_time == NaN) {
                        if (score== 12) {   
                            localStorage.setItem("BestTime", consumedTime)
                            bestTime.innerHTML = "00:"+consumedTime
                        }
                    } else if (best_time > consumedTime) {
                        if (score== 12) {   
                            localStorage.setItem("BestTime", consumedTime)
                            bestTime.innerHTML = "00:"+consumedTime
                        }
                    }
                    clearInterval(counterInterval)
                    memoryGame.style.opacity = "0"
                    scoreSection.style.opacity = "1"
                    scoreSection.style.visibility = "visible"
                    nextBtnContainer.style.opacity = "1"
                    nextBtnContainer.style.visibility = "visible"
                    nextBtnContainer.style.bottom = "454px"
                    nextBtnContainer.firstElementChild.innerHTML = "Play Again"
                    userFrontName.innerHTML = userFormInputs[0].value
                    setTimeout(() => {
                        memoryGame.style.visibility = "hidden"
                    }, 500);
                    if (score < 10) {
                        scoreSpans[0].innerHTML = 0
                        scoreSpans[1].innerHTML = score
                    }
                    else {
                        let scoreArray = [];
                        for (let digit of score.toString()) {
                            scoreArray.push(digit);
                        }
                        scoreSpans[0].innerHTML = scoreArray[0]
                        scoreSpans[1].innerHTML = scoreArray[1]
                    }

                }
                counter = 60
                
                cards.forEach(card => {
                    card.classList.remove("flip")
                    card.style.pointerEvents = "auto"
                });
                gameEnd = true
            }
            
            
            
        }, 1000);
    }
    else {
        console.log("Asd")
        window.location.reload();
    }
})

backBtn.addEventListener("click", () => {
    if (step == 1) {
        trxTexts.forEach(text => {
            text.style.maxWidth = "100%"
            text.style.margin = "5px auto"
        });
        matchLogo.style.opacity = "1"
        backBtn.style.opacity = "0"
        setTimeout(() => {
            backBtn.style.visibility = "hiden"
            stepsSection.style.visibility = "hiden"
        }, 500);
        stepsSection.style.opacity = "0"
        nextBtnContainer.style.bottom = "454px"
        nextBtnContainer.firstElementChild.innerHTML = "Play"
    }
    else if (step == 2) {
        userForm.style.opacity = "0"
        stepsSection.style.opacity = "1"
        stepsSection.style.visibility = "visible"
        nextBtnContainer.style.bottom = "156px"
        setTimeout(() => {
            userForm.style.visibility = "hidden"
        }, 500);
        nextBtnContainer.firstElementChild.innerHTML = "Next"
    }
    step--
})

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}



let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;
    this.classList.add('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;

    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.product === secondCard.dataset.product;
    isMatch ? disableCards() : unflipCards();
    isMatch ? score++ : null;
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 500);
}
function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

(function shuffle() {
    cardsOuter.forEach(cardout => {
        let ramdomPos = Math.floor(Math.random() * 12);
        cardout.style.order = ramdomPos;
    });
})();

cards.forEach(card => card.addEventListener('click', flipCard));