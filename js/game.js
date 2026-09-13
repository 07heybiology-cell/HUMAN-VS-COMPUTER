/* ========================================
   HUMAN VS COMPUTER
   GAME JAVASCRIPT
======================================== */


/* ========================================
   GAME VARIABLES
======================================== */

let playerName = "";

let totalScore = 0;

let memoryScore = 0;
let patternScore = 0;
let reactionScore = 0;
let logicScore = 0;

const computerScore = 173;
const maximumScore = 210;


/* ========================================
   SOUND SYSTEM
======================================== */

let audioContext = null;


function getAudioContext() {

    if (!audioContext) {

        audioContext =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();

    }

    return audioContext;
}


function playSound(type) {

    try {

        const context =
            getAudioContext();


        if (context.state === "suspended") {

            context.resume();

        }


        const oscillator =
            context.createOscillator();


        const gainNode =
            context.createGain();


        oscillator.connect(gainNode);

        gainNode.connect(
            context.destination
        );


        let frequency = 500;
        let duration = 0.08;


        if (type === "click") {

            frequency = 500;
            duration = 0.08;

        }


        else if (type === "correct") {

            frequency = 750;
            duration = 0.18;

        }


        else if (type === "wrong") {

            frequency = 220;
            duration = 0.22;

        }


        else if (type === "win") {

            frequency = 800;
            duration = 0.5;

        }


        oscillator.frequency.value =
            frequency;


        oscillator.type = "sine";


        gainNode.gain.setValueAtTime(
            0.001,
            context.currentTime
        );


        gainNode.gain.exponentialRampToValueAtTime(
            0.08,
            context.currentTime + 0.02
        );


        gainNode.gain.exponentialRampToValueAtTime(
            0.001,
            context.currentTime + duration
        );


        oscillator.start(
            context.currentTime
        );


        oscillator.stop(
            context.currentTime + duration
        );


    } catch (error) {

        console.log(
            "Sound unavailable:",
            error
        );

    }

}


/* ========================================
   PROGRESS INDICATOR
======================================== */

function getProgressHTML(roundNumber) {

    let percentage = 0;


    if (roundNumber === 1) {

        percentage = 25;

    }

    else if (roundNumber === 2) {

        percentage = 50;

    }

    else if (roundNumber === 3) {

        percentage = 75;

    }

    else if (roundNumber === 4) {

        percentage = 100;

    }


    return `

        <div class="game-progress">

            <div class="progress-info">

                <span>
                    ROUND ${roundNumber} / 4
                </span>

                <span>
                    ${percentage}%
                </span>

            </div>


            <div class="progress-track">

                <div
                    class="progress-fill"
                    style="width: ${percentage}%"
                ></div>

            </div>

        </div>

    `;

}


/* ========================================
   BUTTON SOUND
======================================== */

document.addEventListener(
    "click",
    function (event) {

        if (
            event.target.tagName ===
            "BUTTON"
        ) {

            playSound("click");

        }

    }
);


/* ========================================
   START GAME
======================================== */

const startGameBtn =
    document.getElementById(
        "startGameBtn"
    );


if (startGameBtn) {

    startGameBtn.addEventListener(
        "click",
        function () {

            const nameInput =
                document.getElementById(
                    "playerName"
                );


            playerName =
                nameInput.value.trim();


            if (playerName === "") {

                nameInput.focus();

                nameInput.style.borderColor =
                    "#b33a3a";

                nameInput.placeholder =
                    "Please enter your name!";

                playSound("wrong");

                return;

            }


            nameInput.style.borderColor =
                "#24b36b";


            playSound("click");


            startMemoryRound();

        }
    );

}


/* ========================================
   MEMORY ROUND
======================================== */

function startMemoryRound() {

    document.querySelector(
        ".hero-content"
    ).innerHTML = `

        <div id="memoryGame">

            ${getProgressHTML(1)}

            <div class="brain-icon">
                🧠
            </div>

            <p class="subtitle">
                ROUND 1
            </p>

            <h1>
                MEMORY
            </h1>

            <p class="description">
                Get ready, ${playerName}!
                Remember the objects shown below.
            </p>


            <div
                id="memoryObjects"
                class="memory-grid"
            ></div>


            <h2 id="memoryCountdown">
                Get ready...
            </h2>

        </div>

    `;


    const objects = [

        "🍎",
        "🚗",
        "⭐",
        "📱",
        "🐱",
        "🌳",
        "⚽",
        "🎸",
        "🍕",
        "🚀"

    ];


    const memoryObjects =
        document.getElementById(
            "memoryObjects"
        );


    const countdown =
        document.getElementById(
            "memoryCountdown"
        );


    objects.forEach(
        function (object) {

            const button =
                document.createElement(
                    "button"
                );


            button.textContent =
                object;


            button.className =
                "memory-object";


            memoryObjects.appendChild(
                button
            );

        }
    );


    let timeLeft = 5;


    countdown.textContent =
        `Remember... ${timeLeft}`;


    const timer =
        setInterval(
            function () {

                timeLeft--;


                if (timeLeft > 0) {

                    countdown.textContent =
                        `Remember... ${timeLeft}`;

                }

                else {

                    clearInterval(timer);

                    showMemoryQuestion();

                }

            },
            1000
        );

}


/* ========================================
   MEMORY QUESTION
======================================== */

function showMemoryQuestion() {

    document.querySelector(
        ".hero-content"
    ).innerHTML = `

        <div id="memoryGame">

            ${getProgressHTML(1)}

            <div class="brain-icon">
                🧠
            </div>

            <p class="subtitle">
                ROUND 1
            </p>

            <h1>
                MEMORY TEST
            </h1>

            <p class="description">
                Which object was shown in the memory round?
            </p>


            <div
                id="memoryObjects"
                class="memory-grid"
            >

                <button
                    class="pattern-option memory-option"
                >
                    🍎
                </button>


                <button
                    class="pattern-option memory-option"
                >
                    🐶
                </button>


                <button
                    class="pattern-option memory-option"
                >
                    🚀
                </button>


                <button
                    class="pattern-option memory-option"
                >
                    🎁
                </button>

            </div>


            <p id="memoryResult"></p>

        </div>

    `;


    const options =
        document.querySelectorAll(
            ".memory-option"
        );


    options.forEach(
        function (option) {

            option.addEventListener(
                "click",
                function () {


                    options.forEach(
                        function (button) {

                            button.disabled =
                                true;

                        }
                    );


                    const selectedAnswer =
                        option.textContent.trim();


                    const result =
                        document.getElementById(
                            "memoryResult"
                        );


                    if (
                        selectedAnswer ===
                        "🍎"
                    ) {

                        memoryScore = 10;


                        playSound(
                            "correct"
                        );


                        result.innerHTML = `

                            <h2>
                                ✅ Correct!
                            </h2>

                            <p>
                                Great memory,
                                ${playerName}!
                            </p>

                            <p>
                                <strong>
                                    +10 points
                                </strong>
                            </p>

                            <br>

                            <button
                                class="start-btn"
                                onclick="startPatternRound()"
                            >
                                CONTINUE →
                            </button>

                        `;

                    }

                    else {

                        memoryScore = 0;


                        playSound(
                            "wrong"
                        );


                        result.innerHTML = `

                            <h2>
                                ❌ Incorrect!
                            </h2>

                            <p>
                                The correct answer was 🍎
                            </p>

                            <p>
                                <strong>
                                    +0 points
                                </strong>
                            </p>

                            <br>

                            <button
                                class="start-btn"
                                onclick="startPatternRound()"
                            >
                                CONTINUE →
                            </button>

                        `;

                    }

                }
            );

        }
    );

}


/* ========================================
   PATTERN ROUND
======================================== */

function startPatternRound() {

    patternScore = 0;


    const questions = [

        {
            sequence:
                "2   4   8   16   ?",

            options:
                [
                    "24",
                    "32",
                    "30",
                    "36"
                ],

            answer:
                "32"
        },


        {
            sequence:
                "5   10   15   20   ?",

            options:
                [
                    "25",
                    "30",
                    "35",
                    "40"
                ],

            answer:
                "25"
        },


        {
            sequence:
                "3   6   12   24   ?",

            options:
                [
                    "36",
                    "42",
                    "48",
                    "54"
                ],

            answer:
                "48"
        },


        {
            sequence:
                "10   20   30   40   ?",

            options:
                [
                    "45",
                    "50",
                    "55",
                    "60"
                ],

            answer:
                "50"
        },


        {
            sequence:
                "1   4   9   16   ?",

            options:
                [
                    "20",
                    "24",
                    "25",
                    "30"
                ],

            answer:
                "25"
        }

    ];


    let currentQuestion = 0;


    function showPatternQuestion() {

        const question =
            questions[currentQuestion];


        document.querySelector(
            ".hero-content"
        ).innerHTML = `

            <div id="patternGame">

                ${getProgressHTML(2)}

                <div class="brain-icon">
                    🔢
                </div>

                <p class="subtitle">
                    ROUND 2 • QUESTION
                    ${currentQuestion + 1}/5
                </p>

                <h1>
                    PATTERN
                </h1>

                <p class="description">
                    Find the missing number.
                </p>


                <div class="pattern-box">
                    ${question.sequence}
                </div>


                <div id="patternOptions"></div>


                <p id="patternProgress">
                    Score: ${patternScore}/50
                </p>

            </div>

        `;


        const optionsContainer =
            document.getElementById(
                "patternOptions"
            );


        question.options.forEach(
            function (option) {

                const button =
                    document.createElement(
                        "button"
                    );


                button.className =
                    "pattern-option";


                button.textContent =
                    option;


                button.addEventListener(
                    "click",
                    function () {


                        document
                            .querySelectorAll(
                                ".pattern-option"
                            )
                            .forEach(
                                function (btn) {

                                    btn.disabled =
                                        true;

                                }
                            );


                        if (
                            option ===
                            question.answer
                        ) {

                            patternScore +=
                                10;


                            button.style.background =
                                "rgba(36,179,107,0.4)";


                            playSound(
                                "correct"
                            );

                        }

                        else {

                            button.style.background =
                                "rgba(179,58,58,0.4)";


                            playSound(
                                "wrong"
                            );

                        }


                        setTimeout(
                            function () {

                                currentQuestion++;


                                if (
                                    currentQuestion <
                                    questions.length
                                ) {

                                    showPatternQuestion();

                                }

                                else {

                                    showPatternResult();

                                }

                            },
                            700
                        );

                    }
                );


                optionsContainer.appendChild(
                    button
                );

            }
        );

    }


    function showPatternResult() {

        document.querySelector(
            ".hero-content"
        ).innerHTML = `

            <div>

                ${getProgressHTML(2)}

                <div class="brain-icon">
                    🔢
                </div>

                <p class="subtitle">
                    ROUND 2 COMPLETE
                </p>

                <h1>
                    PATTERN RESULT
                </h1>


                <div class="result-card">

                    <h2>
                        Your Score:
                        ${patternScore}/50
                    </h2>


                    <p>
                        Computer Benchmark:
                        <strong>
                            40/50
                        </strong>
                    </p>


                    <br>


                    <button
                        class="start-btn"
                        onclick="startReactionRound()"
                    >
                        CONTINUE →
                    </button>

                </div>

            </div>

        `;

    }


    showPatternQuestion();

}


/* ========================================
   REACTION ROUND
======================================== */

function startReactionRound() {

    document.querySelector(
        ".hero-content"
    ).innerHTML = `

        <div id="reactionGame">

            ${getProgressHTML(3)}

            <div class="brain-icon">
                ⚡
            </div>

            <p class="subtitle">
                ROUND 3
            </p>

            <h1>
                REACTION
            </h1>

            <p class="description">
                Wait for the box to turn GREEN.
                Then click as quickly as possible!
            </p>


            <div
                id="reactionBox"
                class="reaction-box"
            >

                <span id="reactionText">
                    WAIT...
                </span>

            </div>


            <div id="reactionResult"></div>

        </div>

    `;


    const reactionBox =
        document.getElementById(
            "reactionBox"
        );


    const reactionText =
        document.getElementById(
            "reactionText"
        );


    let ready = false;

    let finished = false;

    let startTime = 0;

    let timeout;


    const randomDelay =
        Math.floor(
            Math.random() * 3000
        ) + 2000;


    timeout =
        setTimeout(
            function () {

                ready = true;

                reactionBox.classList.add(
                    "reaction-go"
                );

                reactionText.textContent =
                    "CLICK NOW!";


                startTime =
                    performance.now();

            },
            randomDelay
        );


    reactionBox.addEventListener(
        "click",
        function () {


            if (finished) {

                return;

            }


            if (!ready) {

                clearTimeout(timeout);


                finished = true;


                reactionBox.classList.add(
                    "reaction-too-early"
                );


                reactionText.textContent =
                    "TOO EARLY!";


                playSound(
                    "wrong"
                );


                document.getElementById(
                    "reactionResult"
                ).innerHTML = `

                    <h2>
                        ❌ Too Early!
                    </h2>

                    <p>
                        Wait until the box turns green.
                    </p>

                    <br>


                    <button
                        class="start-btn"
                        onclick="startReactionRound()"
                    >
                        TRY AGAIN
                    </button>

                `;

                return;

            }


            finished = true;

            ready = false;


            const reactionTime =
                Math.round(
                    performance.now() -
                    startTime
                );


            if (
                reactionTime <= 250
            ) {

                reactionScore = 100;

            }

            else if (
                reactionTime <= 350
            ) {

                reactionScore = 90;

            }

            else if (
                reactionTime <= 500
            ) {

                reactionScore = 80;

            }

            else if (
                reactionTime <= 700
            ) {

                reactionScore = 70;

            }

            else if (
                reactionTime <= 1000
            ) {

                reactionScore = 60;

            }

            else {

                reactionScore = 40;

            }


            reactionText.textContent =
                `${reactionTime} ms`;


            playSound(
                "correct"
            );


            document.getElementById(
                "reactionResult"
            ).innerHTML = `

                <h2>
                    ⚡ ${reactionTime} ms
                </h2>


                <p>
                    Reaction Score:
                    <strong>
                        ${reactionScore}/100
                    </strong>
                </p>


                <p>
                    Computer Benchmark:
                    <strong>
                        85/100
                    </strong>
                </p>


                <br>


                <button
                    class="start-btn"
                    onclick="startLogicRound()"
                >
                    CONTINUE →
                </button>

            `;

        }
    );

}


/* ========================================
   LOGIC ROUND
======================================== */

function startLogicRound() {

    logicScore = 0;


    const questions = [

        {
            question:
                "All cats are animals. All animals need food. Do cats need food?",

            options:
                [
                    "Yes",
                    "No",
                    "Cannot say",
                    "None"
                ],

            answer:
                "Yes"
        },


        {
            question:
                "You have 10 apples and give 3 away. How many are left?",

            options:
                [
                    "5",
                    "6",
                    "7",
                    "8"
                ],

            answer:
                "7"
        },


        {
            question:
                "Which number does NOT follow the pattern? 2, 4, 6, 9",

            options:
                [
                    "2",
                    "4",
                    "6",
                    "9"
                ],

            answer:
                "9"
        },


        {
            question:
                "If today is Monday, what day will it be after 3 days?",

            options:
                [
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday"
                ],

            answer:
                "Thursday"
        },


        {
            question:
                "A train has 5 compartments. Each compartment has 10 seats. How many seats are there?",

            options:
                [
                    "40",
                    "45",
                    "50",
                    "55"
                ],

            answer:
                "50"
        }

    ];


    let currentQuestion = 0;


    function showLogicQuestion() {

        const question =
            questions[currentQuestion];


        document.querySelector(
            ".hero-content"
        ).innerHTML = `

            <div id="logicGame">

                ${getProgressHTML(4)}

                <div class="brain-icon">
                    🧩
                </div>

                <p class="subtitle">
                    ROUND 4 • QUESTION
                    ${currentQuestion + 1}/5
                </p>

                <h1>
                    LOGIC
                </h1>


                <div class="logic-box">
                    ${question.question}
                </div>


                <div id="logicOptions"></div>


                <p>
                    Score: ${logicScore}/50
                </p>

            </div>

        `;


        const optionsContainer =
            document.getElementById(
                "logicOptions"
            );


        question.options.forEach(
            function (option) {

                const button =
                    document.createElement(
                        "button"
                    );


                button.className =
                    "logic-option";


                button.textContent =
                    option;


                button.addEventListener(
                    "click",
                    function () {


                        document
                            .querySelectorAll(
                                ".logic-option"
                            )
                            .forEach(
                                function (btn) {

                                    btn.disabled =
                                        true;

                                }
                            );


                        if (
                            option ===
                            question.answer
                        ) {

                            logicScore +=
                                10;


                            button.style.background =
                                "rgba(36,179,107,0.4)";


                            playSound(
                                "correct"
                            );

                        }

                        else {

                            button.style.background =
                                "rgba(179,58,58,0.4)";


                            playSound(
                                "wrong"
                            );

                        }


                        setTimeout(
                            function () {

                                currentQuestion++;


                                if (
                                    currentQuestion <
                                    questions.length
                                ) {

                                    showLogicQuestion();

                                }

                                else {

                                    showLogicResult();

                                }

                            },
                            700
                        );

                    }
                );


                optionsContainer.appendChild(
                    button
                );

            }
        );

    }


    function showLogicResult() {

        document.querySelector(
            ".hero-content"
        ).innerHTML = `

            <div>

                ${getProgressHTML(4)}

                <div class="brain-icon">
                    🧩
                </div>

                <p class="subtitle">
                    ROUND 4 COMPLETE
                </p>

                <h1>
                    LOGIC RESULT
                </h1>


                <div class="result-card">

                    <h2>
                        Your Score:
                        ${logicScore}/50
                    </h2>


                    <p>
                        Computer Benchmark:
                        <strong>
                            40/50
                        </strong>
                    </p>


                    <br>


                    <button
                        class="start-btn"
                        onclick="showFinalResult()"
                    >
                        VIEW FINAL RESULT →
                    </button>

                </div>

            </div>

        `;

    }


    showLogicQuestion();

}


/* ========================================
   FINAL RESULT
======================================== */

function showFinalResult() {

    totalScore =
        memoryScore +
        patternScore +
        reactionScore +
        logicScore;


    let winnerMessage = "";

    let winnerClass = "";


    if (
        totalScore >
        computerScore
    ) {

        winnerMessage =
            "🎉 HUMAN WINS!";

        winnerClass =
            "human-winner";

    }

    else if (
        totalScore <
        computerScore
    ) {

        winnerMessage =
            "💻 COMPUTER WINS!";

        winnerClass =
            "computer-winner";

    }

    else {

        winnerMessage =
            "🤝 IT'S A TIE!";

        winnerClass =
            "tie-winner";

    }


    playSound("win");


    /* ====================================
       PERCENTAGES
    ==================================== */

    const memoryPercentage =
        (memoryScore / 10) * 100;


    const patternPercentage =
        (patternScore / 50) * 100;


    const reactionPercentage =
        reactionScore;


    const logicPercentage =
        (logicScore / 50) * 100;


    /* ====================================
       PERFORMANCE
    ==================================== */

    const performance = [

        {
            name: "Memory",
            icon: "🧠",
            percentage:
                memoryPercentage
        },

        {
            name: "Pattern",
            icon: "🔢",
            percentage:
                patternPercentage
        },

        {
            name: "Reaction",
            icon: "⚡",
            percentage:
                reactionPercentage
        },

        {
            name: "Logic",
            icon: "🧩",
            percentage:
                logicPercentage
        }

    ];


    let strongestArea =
        performance[0];


    let weakestArea =
        performance[0];


    performance.forEach(
        function (area) {

            if (
                area.percentage >
                strongestArea.percentage
            ) {

                strongestArea =
                    area;

            }


            if (
                area.percentage <
                weakestArea.percentage
            ) {

                weakestArea =
                    area;

            }

        }
    );


    /* ====================================
       COMPARISON
    ==================================== */

    const pointDifference =
        Math.abs(
            totalScore -
            computerScore
        );


    let comparisonText = "";


    if (
        totalScore >
        computerScore
    ) {

        comparisonText =
            `You performed ${pointDifference} points better than the computer benchmark.`;

    }

    else if (
        totalScore <
        computerScore
    ) {

        comparisonText =
            `The computer benchmark was ${pointDifference} points higher than your score.`;

    }

    else {

        comparisonText =
            "You matched the computer benchmark exactly.";

    }


    /* ====================================
       FINAL RESULT SCREEN
    ==================================== */

    document.querySelector(
        ".hero-content"
    ).innerHTML = `

        <div>

            <div class="brain-icon">
                🏆
            </div>


            <p class="subtitle">
                GAME COMPLETE
            </p>


            <h1>
                FINAL RESULT
            </h1>


            <div class="result-card">


                <h2 class="${winnerClass}">
                    ${winnerMessage}
                </h2>


                <p class="description">

                    Congratulations,
                    <strong>
                        ${playerName}
                    </strong>! 🎉

                </p>


                <!-- SCORE COMPARISON -->

                <div class="score-comparison">


                    <div class="score-box">

                        <span>
                            🧑
                            ${playerName.toUpperCase()}
                        </span>


                        <strong>
                            ${totalScore}
                        </strong>


                        <small>
                            / ${maximumScore}
                        </small>

                    </div>


                    <div class="vs-text">
                        VS
                    </div>


                    <div class="score-box">

                        <span>
                            💻 COMPUTER
                        </span>


                        <strong>
                            ${computerScore}
                        </strong>


                        <small>
                            / ${maximumScore}
                        </small>

                    </div>


                </div>


                <!-- ROUND SCORES -->

                <div class="round-scores">


                    <h3>
                        📊 Round Performance
                    </h3>


                    <!-- MEMORY -->

                    <div class="score-row">

                        <div class="score-label">

                            <span>
                                🧠 Memory
                            </span>


                            <span>
                                ${memoryScore}/10
                            </span>

                        </div>


                        <div class="score-bar">

                            <div
                                class="score-fill"
                                style="
                                    width:
                                    ${memoryPercentage}%;
                                "
                            ></div>

                        </div>

                    </div>


                    <!-- PATTERN -->

                    <div class="score-row">

                        <div class="score-label">

                            <span>
                                🔢 Pattern
                            </span>


                            <span>
                                ${patternScore}/50
                            </span>

                        </div>


                        <div class="score-bar">

                            <div
                                class="score-fill"
                                style="
                                    width:
                                    ${patternPercentage}%;
                                "
                            ></div>

                        </div>

                    </div>


                    <!-- REACTION -->

                    <div class="score-row">

                        <div class="score-label">

                            <span>
                                ⚡ Reaction
                            </span>


                            <span>
                                ${reactionScore}/100
                            </span>

                        </div>


                        <div class="score-bar">

                            <div
                                class="score-fill"
                                style="
                                    width:
                                    ${reactionPercentage}%;
                                "
                            ></div>

                        </div>

                    </div>


                    <!-- LOGIC -->

                    <div class="score-row">

                        <div class="score-label">

                            <span>
                                🧩 Logic
                            </span>


                            <span>
                                ${logicScore}/50
                            </span>

                        </div>


                        <div class="score-bar">

                            <div
                                class="score-fill"
                                style="
                                    width:
                                    ${logicPercentage}%;
                                "
                            ></div>

                        </div>

                    </div>


                </div>


                <!-- PERFORMANCE ANALYSIS -->

                <div class="performance-analysis">


                    <h3>
                        🤖 PERFORMANCE ANALYSIS
                    </h3>


                    <p class="analysis-main">
                        ${comparisonText}
                    </p>


                    <div class="analysis-grid">


                        <div class="analysis-card">

                            <span class="analysis-icon">
                                💪
                            </span>


                            <p>
                                STRONGEST AREA
                            </p>


                            <h4>
                                ${strongestArea.icon}
                                ${strongestArea.name}
                            </h4>


                            <span>
                                ${strongestArea.percentage}%
                            </span>

                        </div>


                        <div class="analysis-card">

                            <span class="analysis-icon">
                                🎯
                            </span>


                            <p>
                                AREA TO IMPROVE
                            </p>


                            <h4>
                                ${weakestArea.icon}
                                ${weakestArea.name}
                            </h4>


                            <span>
                                ${weakestArea.percentage}%
                            </span>

                        </div>


                    </div>


                </div>


                <p class="description">

                    The computer score is a predefined
                    benchmark used to compare human
                    performance.

                </p>


                <br>


                <button
                    class="start-btn"
                    onclick="restartGame()"
                >
                    🔄 PLAY AGAIN
                </button>


            </div>

        </div>

    `;

}


/* ========================================
   RESTART GAME
======================================== */

function restartGame() {

    playSound("click");


    totalScore = 0;

    memoryScore = 0;
    patternScore = 0;
    reactionScore = 0;
    logicScore = 0;

    playerName = "";


    setTimeout(
        function () {

            location.reload();

        },
        150
    );

}
