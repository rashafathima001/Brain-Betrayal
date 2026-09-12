/**
 * Brain Betrayal - Question Engine & Confidence Modal System
 * Provides dynamic, non-repeating questions for Rounds 1-5
 * and sudden confidence popup modal on answer selection.
 */

const QuestionEngine = (function () {

    // --- Master Item Pools ---
    const POOLS = {
        animals: ['🦁', '🐯', '🐼', '🦊', '🐸', '🐨', '🐵', '🦉', '🐙', '🦄', '🦒', '🦓', '🐘', '🐧', '🐢', '🐬'],
        foods: ['🍎', '🍌', '🍉', '🍓', '🍇', '🍍', '🍕', '🍔', '🍟', '🌮', '🍦', '🍩', '🥑', '🍣', '🥐', '🍪'],
        objects: ['🎧', '🔑', '🕶️', '🎸', '⚽', '💎', '🚀', '⏰', '🎮', '💡', '📸', '🎨', '🧸', '🚲', '👑', '🎁'],
        cosmic: ['🌙', '⭐', '🔥', '⚡', '🌊', '🌈', '🪐', '🍀', '❄️', '🌸', '🍄', '🌵', '☀️', '🌋', '🌪️', '☄️'],
        categories: {
            "FRUIT": ['🍎', '🍌', '🍉', '🍓', '🍇', '🍍', '🍒', '🍑', '🥝', '🥭'],
            "FAST FOOD": ['🍕', '🍔', '🍟', '🌭', '🥪', '🌮', '🌯', '🍦', '🍩', '🍿'],
            "ANIMAL": ['🦁', '🐯', '🐻', '🐼', '🐨', '🦊', '🐸', '🐵', '🐺', '🦒', '🐘', '🐧'],
            "SPORT": ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🥊', '🎱', '🏓', '🎳', '⛳', '🥋'],
            "VEHICLE": ['🚀', '✈️', '🚗', '🚲', '🚁', '⛵', '🚂', '🛸', '🛵', '🚜', '🏎️', '🚢']
        },
        colors: [
            { name: 'BLUE', emoji: '🔵', hex: '#3498db' },
            { name: 'RED', emoji: '🔴', hex: '#e74c3c' },
            { name: 'GREEN', emoji: '🟢', hex: '#2ecc71' },
            { name: 'YELLOW', emoji: '🟡', hex: '#f1c40f' },
            { name: 'PURPLE', emoji: '🟣', hex: '#9b59b6' },
            { name: 'ORANGE', emoji: '🟠', hex: '#e67e22' }
        ],
        subjects: ['CAT', 'PENGUIN', 'MONKEY', 'ROBOT', 'FROG', 'ALIEN', 'BEAR', 'OCTOPUS'],
        actions: ['ATE', 'CHASED', 'STOLE', 'FOUND', 'PAINTED', 'BALANCED', 'JUGGLED'],
        items: ['BANANA', 'PIZZA', 'GUITAR', 'DIAMOND', 'ROCKET', 'DONUT', 'HEADPHONES']
    };

    function shuffle(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    function pickRandom(arr, count = 1) {
        const shuffled = shuffle(arr);
        return count === 1 ? shuffled[0] : shuffled.slice(0, count);
    }

    function getAllEmojis() {
        return [...new Set([...POOLS.animals, ...POOLS.foods, ...POOLS.objects, ...POOLS.cosmic])];
    }

    // --- Used Questions Tracker to Prevent Repeats ---
    function getUsedQuestions() {
        try {
            return JSON.parse(localStorage.getItem("usedQuestions") || "{}");
        } catch (e) {
            return {};
        }
    }

    function markQuestionUsed(roundNum, key) {
        const used = getUsedQuestions();
        if (!used[roundNum]) used[roundNum] = [];
        used[roundNum].push(key);
        // keep recent 25 per round
        if (used[roundNum].length > 25) used[roundNum].shift();
        localStorage.setItem("usedQuestions", JSON.stringify(used));
    }

    function isQuestionUsed(roundNum, key) {
        const used = getUsedQuestions();
        return (used[roundNum] || []).includes(key);
    }

    // --- Round Generators ---

    // ROUND 1: Visual Memory Test (6 items, question: which was present?)
    function generateRound1() {
        const all = getAllEmojis();
        let memoryItems, target, distractors, key;
        let attempts = 0;

        do {
            memoryItems = pickRandom(all, 6);
            target = pickRandom(memoryItems);
            const remaining = all.filter(e => !memoryItems.includes(e));
            distractors = pickRandom(remaining, 3);
            key = `${memoryItems.sort().join('')}_${target}`;
            attempts++;
        } while (isQuestionUsed(1, key) && attempts < 15);

        markQuestionUsed(1, key);

        const options = shuffle([target, ...distractors]);
        return {
            memoryDisplay: memoryItems.join('   '),
            questionText: "Which object was present?",
            correctAnswer: target,
            options: options.map(opt => ({ text: opt, value: opt }))
        };
    }

    // ROUND 2: Spatial Neighbor Attention (6 items in row, ask for neighbor)
    function generateRound2() {
        const all = getAllEmojis();
        let memoryItems, anchorIdx, anchor, neighbor, directionWord, key;
        let attempts = 0;

        do {
            memoryItems = pickRandom(all, 6);
            anchorIdx = Math.floor(Math.random() * 4) + 1; // index 1, 2, 3, or 4
            anchor = memoryItems[anchorIdx];
            // Clear direction: Left or Right
            const pickRight = Math.random() > 0.5;
            neighbor = pickRight ? memoryItems[anchorIdx + 1] : memoryItems[anchorIdx - 1];
            directionWord = pickRight ? "to the RIGHT of" : "to the LEFT of";
            key = `${memoryItems.join('')}_${anchor}_${directionWord}_${neighbor}`;
            attempts++;
        } while (isQuestionUsed(2, key) && attempts < 15);

        markQuestionUsed(2, key);

        // Distractors: other items from memoryItems (excluding anchor & neighbor so all 4 options were shown in the row)
        const otherShownItems = memoryItems.filter(e => e !== anchor && e !== neighbor);
        const distractors = pickRandom(otherShownItems, 3);
        const options = shuffle([neighbor, ...distractors]);

        return {
            memoryDisplay: memoryItems.join('   '),
            questionText: `What was directly ${directionWord} ${anchor}?`,
            descriptionText: `Pay close attention to what's next to each item.`,
            correctAnswer: neighbor,
            options: options.map(opt => ({ text: opt, value: opt }))
        };
    }

    // ROUND 3: Memory Trap (Category Intruder - Which was NOT shown?)
    function generateRound3() {
        const categories = Object.keys(POOLS.categories);
        let categoryName, pool, shown, intruder, key;
        let attempts = 0;

        do {
            categoryName = pickRandom(categories);
            pool = POOLS.categories[categoryName];
            shown = pickRandom(pool, 5);
            const poolRemaining = pool.filter(item => !shown.includes(item));
            intruder = pickRandom(poolRemaining);
            key = `${categoryName}_${shown.sort().join('')}_${intruder}`;
            attempts++;
        } while (isQuestionUsed(3, key) && attempts < 15);

        markQuestionUsed(3, key);

        // 3 shown items (distractors) + 1 intruder (CORRECT ANSWER)
        const shownDistractors = pickRandom(shown, 3);
        const options = shuffle([intruder, ...shownDistractors]);

        return {
            categoryName: categoryName,
            memoryDisplay: shown.join('   '),
            questionText: `Which ${categoryName} was NOT shown?`,
            descriptionText: `One ${categoryName.toLowerCase()} below is NOT actually there.`,
            correctAnswer: intruder,
            options: options.map(opt => ({ text: opt, value: opt }))
        };
    }

    // ROUND 4: Linguistic Stroop / Brain Trap (Surreal conflicting sentence)
    function generateRound4() {
        let col1, col2, subj, act, item, targetQuestion, correctAnswer, key;
        let attempts = 0;

        do {
            const cols = pickRandom(POOLS.colors, 2);
            col1 = cols[0];
            col2 = cols[1];
            subj = pickRandom(POOLS.subjects);
            act = pickRandom(POOLS.actions);
            item = pickRandom(POOLS.items);

            // 50% ask about subject color, 50% ask about item color
            const askSubject = Math.random() > 0.5;
            if (askSubject) {
                targetQuestion = `What color was the ${subj}?`;
                correctAnswer = col1.name;
            } else {
                targetQuestion = `What color was the ${item}?`;
                correctAnswer = col2.name;
            }

            key = `${col1.name}_${subj}_${col2.name}_${item}_${targetQuestion}`;
            attempts++;
        } while (isQuestionUsed(4, key) && attempts < 15);

        markQuestionUsed(4, key);

        const sentence = `THE ${col1.name} ${subj} ${act} THE ${col2.name} ${item}.`;

        // 4 color options (col1, col2, + 2 random distractors)
        const otherColors = POOLS.colors.filter(c => c.name !== col1.name && c.name !== col2.name);
        const extraColors = pickRandom(otherColors, 2);
        const options = shuffle([col1, col2, ...extraColors]);

        return {
            sentenceDisplay: sentence,
            questionText: targetQuestion,
            correctAnswer: correctAnswer,
            options: options.map(c => ({
                text: `${c.emoji} ${c.name}`,
                value: c.name
            }))
        };
    }

    // ROUND 5: 2-Second Chaos Blitz (10 fast items)
    function generateRound5() {
        const all = getAllEmojis();
        let memoryItems, target, distractors, key;
        let attempts = 0;

        do {
            memoryItems = pickRandom(all, 10);
            target = pickRandom(memoryItems);
            const remaining = all.filter(e => !memoryItems.includes(e));
            distractors = pickRandom(remaining, 3);
            key = `${memoryItems.sort().join('')}_${target}`;
            attempts++;
        } while (isQuestionUsed(5, key) && attempts < 15);

        markQuestionUsed(5, key);

        const options = shuffle([target, ...distractors]);

        return {
            memoryDisplay: memoryItems.join('  '),
            questionText: "Which object was in the blitz?",
            correctAnswer: target,
            options: options.map(opt => ({ text: opt, value: opt }))
        };
    }

    // --- Sudden Confidence Modal Popup ---

    function getConfidenceStatus(val) {
        if (val < 25) return { emoji: "🤷", label: "Zero Clue (Complete Guess)" };
        if (val < 50) return { emoji: "🤔", label: "Not Sure (50/50 Guess)" };
        if (val < 75) return { emoji: "😏", label: "Pretty Confident" };
        if (val < 90) return { emoji: "😎", label: "Very Sure of Myself" };
        return { emoji: "💀", label: "100% Bet My Life On It" };
    }

    function showConfidencePopup(roundNum, isCorrect, chosenAnswer, correctAnswer) {
        // Remove existing modal if any
        const existing = document.getElementById("confidenceModalOverlay");
        if (existing) existing.remove();

        const overlay = document.createElement("div");
        overlay.id = "confidenceModalOverlay";
        overlay.className = "modal-overlay";

        overlay.innerHTML = `
            <div class="modal-content">
                <p class="modal-eyebrow">⚡ MOMENT OF TRUTH</p>
                <h2 class="modal-title">HOW CONFIDENT ARE YOU?</h2>
                <p class="modal-subtitle">
                    Lock in your gut feeling before your brain reveals the verdict!
                </p>

                <div class="modal-status-pill" id="modalStatusPill">
                    🤔 Not Sure (50/50 Guess)
                </div>

                <div class="confidence-number">
                    <span id="popupConfidenceNum">50</span>%
                </div>

                <input
                    type="range"
                    id="popupConfidenceSlider"
                    min="0"
                    max="100"
                    value="50"
                >

                <div class="confidence-labels">
                    <span>🤷 0% NO IDEA</span>
                    <span>😎 100% DEAD SURE</span>
                </div>

                <button
                    id="modalConfirmBtn"
                    class="main-btn"
                    style="margin-top: 25px; width: 100%;"
                >
                    LOCK IN & REVEAL 💀
                </button>
            </div>
        `;

        document.body.appendChild(overlay);

        if (typeof AudioManager !== "undefined") {
            AudioManager.playWhoosh();
        }

        const slider = document.getElementById("popupConfidenceSlider");
        const numDisplay = document.getElementById("popupConfidenceNum");
        const statusPill = document.getElementById("modalStatusPill");
        const confirmBtn = document.getElementById("modalConfirmBtn");

        slider.addEventListener("input", function () {
            const val = parseInt(this.value);
            numDisplay.textContent = val;
            const status = getConfidenceStatus(val);
            statusPill.textContent = `${status.emoji} ${status.label}`;
            if (typeof AudioManager !== "undefined") {
                AudioManager.playTick();
            }
        });

        confirmBtn.addEventListener("click", function () {
            if (typeof AudioManager !== "undefined") {
                AudioManager.playTick();
            }
            confirmBtn.disabled = true;
            confirmBtn.textContent = "CHECKING YOUR FATE... ⏳";

            const confidence = parseInt(slider.value) || 50;

            // Update scores and totals
            let score = parseInt(localStorage.getItem("score")) || 0;
            let correctAnswers = parseInt(localStorage.getItem("correctAnswers")) || 0;
            let confidenceTotal = parseInt(localStorage.getItem("confidenceTotal")) || 0;

            confidenceTotal += confidence;

            if (isCorrect) {
                score += 20;
                correctAnswers++;
            } else {
                // Confidently wrong penalty
                if (confidence >= 80) {
                    score -= 5;
                }
            }

            if (score < 0) score = 0;

            // Save to localStorage
            localStorage.setItem("score", score);
            localStorage.setItem("correctAnswers", correctAnswers);
            localStorage.setItem("confidenceTotal", confidenceTotal);
            localStorage.setItem("lastCorrect", isCorrect ? "true" : "false");
            localStorage.setItem("lastConfidence", confidence);
            localStorage.setItem("currentRound", roundNum);
            localStorage.setItem("lastChosenAnswer", chosenAnswer || "");
            localStorage.setItem("lastCorrectAnswer", correctAnswer || "");

            setTimeout(function () {
                location.href = "reaction.html";
            }, 450);
        });
    }

    return {
        generateRound1,
        generateRound2,
        generateRound3,
        generateRound4,
        generateRound5,
        showConfidencePopup
    };
})();

