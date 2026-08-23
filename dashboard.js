javascript
// ==========================================
// STUDYMIND AI - DASHBOARD
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // LOAD STUDY DATA
    // ==========================================

    const savedData = localStorage.getItem("studyData");

    if (!savedData) {
        alert("No study plan was found. Please create a study plan first.");
        window.location.href = "index.html";
        return;
    }

    let studyData;

    try {
        studyData = JSON.parse(savedData);
    } catch (error) {
        console.error("Could not load study data:", error);
        alert("There was a problem loading your study plan.");
        window.location.href = "index.html";
        return;
    }


    // ==========================================
    // ELEMENTS
    // ==========================================

    const weeklyHours = document.getElementById("weeklyHours");
    const daysLeft = document.getElementById("daysLeft");
    const dailyGoal = document.getElementById("dailyGoal");
    const studyScore = document.getElementById("studyScore");

    const subjectList = document.getElementById("subjectList");

    const streakElement = document.getElementById("streak");

    const scoreDisplay = document.getElementById("scoreDisplay");
    const scoreMessage = document.getElementById("scoreMessage");
    const scoreProgressBar = document.getElementById("scoreProgressBar");

    const progressPercent = document.getElementById("progressPercent");
    const progressCount = document.getElementById("progressCount");
    const progressBar = document.getElementById("progressBar");

    const currentSubject = document.getElementById("currentSubject");
    const currentTopic = document.getElementById("currentTopic");
    const topicTime = document.getElementById("topicTime");

    const studyTimer = document.getElementById("studyTimer");
    const startStudyButton = document.getElementById("startStudyButton");

    const completeTopicCheckbox =
        document.getElementById("completeTopicCheckbox");

    const completionMessage =
        document.getElementById("completionMessage");

    const todaySchedule =
        document.getElementById("todaySchedule");

    const themeButton =
        document.getElementById("themeButton");

    const calendarDays =
        document.getElementById("calendarDays");

    const calendarMonth =
        document.getElementById("calendarMonth");

    const previousMonth =
        document.getElementById("previousMonth");

    const nextMonth =
        document.getElementById("nextMonth");


    // ==========================================
    // BASIC DATA
    // ==========================================

    const subjects =
        Array.isArray(studyData.subjects)
            ? studyData.subjects
            : [];

    const hoursPerDay =
        Number(studyData.hoursPerDay) || 0;

    const examDate =
        studyData.examDate || "";

    const exam =
        examDate
            ? new Date(examDate + "T00:00:00")
            : null;


    // ==========================================
    // PROGRESS DATA
    // ==========================================

    function getProgressData() {

        let progress;

        try {
            progress = JSON.parse(
                localStorage.getItem("studyProgress")
            );
        } catch (error) {
            progress = null;
        }

        if (!progress) {
            progress = {
                completedTopics: [],
                studiedSeconds: {},
                currentTopicIndex: 0
            };
        }

        if (!Array.isArray(progress.completedTopics)) {
            progress.completedTopics = [];
        }

        if (!progress.studiedSeconds) {
            progress.studiedSeconds = {};
        }

        if (typeof progress.currentTopicIndex !== "number") {
            progress.currentTopicIndex = 0;
        }

        return progress;
    }


    function saveProgress(progress) {

        localStorage.setItem(
            "studyProgress",
            JSON.stringify(progress)
        );

    }


    let progress = getProgressData();


    // ==========================================
    // GET ALL TOPICS
    // ==========================================

    function getAllTopics() {

        const allTopics = [];

        const topics = studyData.topics || {};

        Object.keys(topics).forEach(function (subject) {

            const subjectTopics =
                Array.isArray(topics[subject])
                    ? topics[subject]
                    : [];

            subjectTopics.forEach(function (topic) {

                allTopics.push({
                    subject: subject,
                    topic: topic
                });

            });

        });

        return allTopics;
    }


    // ==========================================
    // TOP STATISTICS
    // ==========================================

    function updateTopStatistics() {

        if (weeklyHours) {
            weeklyHours.textContent =
                hoursPerDay * 7;
        }

        if (daysLeft) {
            daysLeft.textContent =
                studyData.daysLeft || 0;
        }

        if (dailyGoal) {
            dailyGoal.textContent =
                `${hoursPerDay} hrs`;
        }

        if (studyScore) {
            studyScore.textContent =
                studyData.studyScore || 0;
        }

        if (streakElement) {
            streakElement.textContent =
                `${studyData.streak || 0} Days`;
        }

    }


    // ==========================================
    // STUDY SCORE
    // ==========================================

    const baseScore =
        Number(studyData.studyScore) || 0;


    function updateStudyScore() {

        const totalTopics =
            getAllTopics().length;

        const completedTopics =
            progress.completedTopics.length;

        let progressBonus = 0;

        if (totalTopics > 0) {

            progressBonus =
                Math.round(
                    (completedTopics / totalTopics) * 20
                );

        }

        const liveScore =
            Math.min(
                100,
                baseScore + progressBonus
            );


        if (scoreDisplay) {
            scoreDisplay.textContent =
                liveScore;
        }

        if (studyScore) {
            studyScore.textContent =
                liveScore;
        }

        if (scoreProgressBar) {
            scoreProgressBar.style.width =
                `${liveScore}%`;
        }


        if (scoreMessage) {

            if (liveScore >= 90) {

                scoreMessage.textContent =
                    "🏆 Excellent work! You're maintaining a strong study routine.";

            } else if (liveScore >= 75) {

                scoreMessage.textContent =
                    "⭐ Great progress! Keep following your study plan.";

            } else if (liveScore >= 60) {

                scoreMessage.textContent =
                    "⚠️ You're making progress. Stay consistent and complete more topics.";

            } else {

                scoreMessage.textContent =
                    "📚 Keep studying and completing topics to improve your score.";

            }

        }

    }


    // ==========================================
    // SUBJECTS
    // ==========================================

    function renderSubjects() {

        if (!subjectList) {
            return;
        }

        subjectList.innerHTML = "";

        subjects.forEach(function (subject) {

            const topics =
                studyData.topics &&
                studyData.topics[subject]
                    ? studyData.topics[subject]
                    : [];


            const subjectCard =
                document.createElement("div");

            subjectCard.className =
                "dashboard-subject";


            const subjectTitle =
                document.createElement("h3");

            subjectTitle.textContent =
                `📚 ${subject}`;


            const subjectInfo =
                document.createElement("p");

            subjectInfo.textContent =
                `${topics.length} topic${topics.length === 1 ? "" : "s"}`;


            const difficulty =
                studyData.topicDifficulty &&
                studyData.topicDifficulty[subject]
                    ? studyData.topicDifficulty[subject]
                    : {};


            let weakCount = 0;

            Object.values(difficulty).forEach(function (level) {

                if (level === "weak") {
                    weakCount++;
                }

            });


            const difficultyInfo =
                document.createElement("p");


            if (weakCount > 0) {

                difficultyInfo.textContent =
                    `🔴 ${weakCount} weak topic${weakCount === 1 ? "" : "s"}`;

            } else {

                difficultyInfo.textContent =
                    "🟢 No weak topics";

            }


            subjectCard.appendChild(subjectTitle);
            subjectCard.appendChild(subjectInfo);
            subjectCard.appendChild(difficultyInfo);

            subjectList.appendChild(subjectCard);

        });

    }


    // ==========================================
    // PROGRESS TRACKER
    // ==========================================

    function updateProgressDisplay() {

        const allTopics =
            getAllTopics();

        const total =
            allTopics.length;

        const completed =
            progress.completedTopics.length;

        const percent =
            total > 0
                ? Math.round((completed / total) * 100)
                : 0;


        if (progressPercent) {
            progressPercent.textContent =
                `${percent}%`;
        }

        if (progressBar) {
            progressBar.style.width =
                `${percent}%`;
        }

        if (progressCount) {
            progressCount.textContent =
                `${completed} of ${total} topics completed`;
        }

        updateStudyScore();

    }


    // ==========================================
    // CURRENT TOPIC
    // ==========================================

    function getCurrentTopicData() {

        const allTopics =
            getAllTopics();

        if (allTopics.length === 0) {
            return null;
        }


        let index =
            progress.currentTopicIndex || 0;


        while (
            index < allTopics.length &&
            progress.completedTopics.includes(index)
        ) {
            index++;
        }


        if (index >= allTopics.length) {
            return null;
        }


        progress.currentTopicIndex =
            index;

        saveProgress(progress);


        return {
            index: index,
            subject: allTopics[index].subject,
            topic: allTopics[index].topic
        };

    }


    function renderCurrentStudy() {

        const current =
            getCurrentTopicData();


        if (!current) {

            if (currentSubject) {
                currentSubject.textContent =
                    "🎉 All Topics Complete!";
            }

            if (currentTopic) {
                currentTopic.textContent =
                    "Amazing work. You've completed your study plan.";
            }

            if (topicTime) {
                topicTime.textContent =
                    "Complete";
            }

            if (startStudyButton) {
                startStudyButton.disabled = true;
            }

            return;
        }


        if (startStudyButton) {
            startStudyButton.disabled = false;
        }


        if (currentSubject) {
            currentSubject.textContent =
                current.subject;
        }

        if (currentTopic) {
            currentTopic.textContent =
                current.topic;
        }

        if (topicTime) {

            const minutes =
                hoursPerDay > 0
                    ? Math.round(
                        (hoursPerDay * 60) /
                        Math.max(subjects.length, 1)
                    )
                    : 30;

            topicTime.textContent =
                `${minutes} min`;

        }


        if (completeTopicCheckbox) {

            completeTopicCheckbox.checked =
                progress.completedTopics.includes(
                    current.index
                );

        }

    }


    // ==========================================
    // COMPLETE TOPIC
    // ==========================================

    function completeCurrentTopic() {

        const current =
            getCurrentTopicData();

        if (!current) {
            return;
        }


        if (
            !progress.completedTopics.includes(
                current.index
            )
        ) {

            progress.completedTopics.push(
                current.index
            );

        }


        progress.currentTopicIndex =
            current.index + 1;


        saveProgress(progress);


        if (completionMessage) {

            completionMessage.textContent =
                "✅ Topic completed! Moving to your next topic.";

        }


        markTodayAsStudied();

        updateProgressDisplay();

        renderCurrentStudy();

        renderTodaySchedule();

    }


    if (completeTopicCheckbox) {

        completeTopicCheckbox.addEventListener(
            "change",
            function () {

                if (completeTopicCheckbox.checked) {
                    completeCurrentTopic();
                }

            }
        );

    }


    // ==========================================
    // STUDY TIMER
    // ==========================================

    let timerSeconds = 0;
    let timerRunning = false;
    let timerInterval = null;


    function formatTimer(seconds) {

        const hours =
            Math.floor(seconds / 3600);

        const minutes =
            Math.floor((seconds % 3600) / 60);

        const remainingSeconds =
            seconds % 60;


        if (hours > 0) {

            return (
                String(hours).padStart(2, "0") +
                ":" +
                String(minutes).padStart(2, "0") +
                ":" +
                String(remainingSeconds).padStart(2, "0")
            );

        }


        return (
            String(minutes).padStart(2, "0") +
            ":" +
            String(remainingSeconds).padStart(2, "0")
        );

    }


    function updateTimerDisplay() {

        if (studyTimer) {

            studyTimer.textContent =
                formatTimer(timerSeconds);

        }

    }


    function startTimer() {

        if (timerRunning) {
            return;
        }


        timerRunning = true;


        if (startStudyButton) {

            startStudyButton.innerHTML =
                '<span class="button-icon">⏸</span><span>Pause Studying</span>';

        }


        timerInterval =
            setInterval(function () {

                timerSeconds++;

                updateTimerDisplay();


                const current =
                    getCurrentTopicData();


                if (current) {

                    const key =
                        String(current.index);


                    progress.studiedSeconds[key] =
                        (progress.studiedSeconds[key] || 0) + 1;


                    saveProgress(progress);

                }

            }, 1000);

    }


    function pauseTimer() {

        timerRunning = false;

        clearInterval(timerInterval);


        if (startStudyButton) {

            startStudyButton.innerHTML =
                '<span class="button-icon">▶</span><span>Resume Studying</span>';

        }

    }


    if (startStudyButton) {

        startStudyButton.addEventListener(
            "click",
            function () {

                if (timerRunning) {
                    pauseTimer();
                } else {
                    startTimer();
                }

            }
        );

    }


    // ==========================================
    // TODAY'S SCHEDULE
    // ==========================================

    function renderTodaySchedule() {

        if (!todaySchedule) {
            return;
        }


        todaySchedule.innerHTML = "";


        const current =
            getCurrentTopicData();


        const currentDay =
            new Date().getDay();


        const currentTime =
            studyData.startTime || "16:00";


        const startHour =
            Number(currentTime.split(":")[0]);


        for (let i = 0; i < hoursPerDay; i++) {

            const hour =
                startHour + i;


            const displayHour =
                hour % 24;


            const period =
                displayHour >= 12
                    ? "PM"
                    : "AM";


            let twelveHour =
                displayHour % 12;


            if (twelveHour === 0) {
                twelveHour = 12;
            }


            const nextHour =
                (hour + 1) % 24;


            const nextPeriod =
                nextHour >= 12
                    ? "PM"
                    : "AM";


            let nextTwelveHour =
                nextHour % 12;


            if (nextTwelveHour === 0) {
                nextTwelveHour = 12;
            }


            let subject =
                subjects[
                    (currentDay + i) %
                    Math.max(subjects.length, 1)
                ] || "Study";


            let topic = "";


            if (current && i === 0) {

                subject =
                    current.subject;

                topic =
                    current.topic;

            }


            const item =
                document.createElement("div");

            item.className =
                "schedule-item";


            item.innerHTML = `
                <div>
                    <strong>
                        ${twelveHour}:00 ${period}
                        -
                        ${nextTwelveHour}:00 ${nextPeriod}
                    </strong>
                </div>

                <div>
                    📚 ${subject}
                    ${
                        topic
                            ? `<br><small>🎯 ${topic}</small>`
                            : ""
                    }
                </div>
            `;


            todaySchedule.appendChild(item);

        }

    }


    // ==========================================
    // CALENDAR
    // ==========================================

    let calendarDate =
        new Date();


    function renderCalendar() {

        if (!calendarDays || !calendarMonth) {
            return;
        }


        const year =
            calendarDate.getFullYear();

        const month =
            calendarDate.getMonth();


        const monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ];


        calendarMonth.textContent =
            `${monthNames[month]} ${year}`;


        calendarDays.innerHTML = "";


        const firstDay =
            new Date(
                year,
                month,
                1
            ).getDay();


        const daysInMonth =
            new Date(
                year,
                month + 1,
                0
            ).getDate();


        const today =
            new Date();


        let completedDays = [];

        try {

            completedDays =
                JSON.parse(
                    localStorage.getItem(
                        "completedStudyDays"
                    ) || "[]"
                );

        } catch (error) {

            completedDays = [];

        }


        for (let i = 0; i < firstDay; i++) {

            const empty =
                document.createElement("div");

            empty.className =
                "calendar-empty";

            calendarDays.appendChild(empty);

        }


        for (
            let day = 1;
            day <= daysInMonth;
            day++
        ) {

            const cell =
                document.createElement("div");

            cell.className =
                "calendar-day";


            const date =
                new Date(
                    year,
                    month,
                    day
                );


            const dateString =
                date.getFullYear() +
                "-" +
                String(date.getMonth() + 1).padStart(2, "0") +
                "-" +
                String(date.getDate()).padStart(2, "0");


            if (
                date.toDateString() ===
                today.toDateString()
            ) {

                cell.classList.add("today");

            }


            if (
                examDate &&
                dateString === examDate
            ) {

                cell.classList.add("exam-day");

                cell.title =
                    "Exam Day";

            }


            if (
                completedDays.includes(
                    dateString
                )
            ) {

                cell.classList.add(
                    "completed-day"
                );

            }


            if (
                exam &&
                date >= today &&
                date <= exam &&
                dateString !== examDate
            ) {

                cell.classList.add(
                    "study-day"
                );

            }


            cell.textContent =
                day;


            calendarDays.appendChild(cell);

        }

    }


    if (previousMonth) {

        previousMonth.addEventListener(
            "click",
            function () {

                calendarDate.setMonth(
                    calendarDate.getMonth() - 1
                );

                renderCalendar();

            }
        );

    }


    if (nextMonth) {

        nextMonth.addEventListener(
            "click",
            function () {

                calendarDate.setMonth(
                    calendarDate.getMonth() + 1
                );

                renderCalendar();

            }
        );

    }


    // ==========================================
    // MARK TODAY AS STUDIED
    // ==========================================

    function markTodayAsStudied() {

        const today =
            new Date();


        const todayString =
            today.getFullYear() +
            "-" +
            String(today.getMonth() + 1).padStart(2, "0") +
            "-" +
            String(today.getDate()).padStart(2, "0");


        let completedDays = [];

        try {

            completedDays =
                JSON.parse(
                    localStorage.getItem(
                        "completedStudyDays"
                    ) || "[]"
                );

        } catch (error) {

            completedDays = [];

        }


        if (
            !completedDays.includes(
                todayString
            )
        ) {

            completedDays.push(
                todayString
            );

        }


        localStorage.setItem(
            "completedStudyDays",
            JSON.stringify(completedDays)
        );


        renderCalendar();

    }


    // ==========================================
    // AI STUDY CONTEXT
    // ==========================================

    function buildAIStudyContext() {

        const current =
            getCurrentTopicData();


        return `
You are StudyMind AI, a personal AI study coach.

You are helping a student using the StudyMind AI dashboard.

Here is the student's current study information:

CURRICULUM:
${studyData.curriculum || "Not provided"}

SUBJECTS:
${subjects.length > 0 ? subjects.join(", ") : "Not provided"}

TOPICS:
${JSON.stringify(studyData.topics || {}, null, 2)}

TOPIC DIFFICULTIES:
${JSON.stringify(studyData.topicDifficulty || {}, null, 2)}

EXAM DATE:
${studyData.examDate || "Not provided"}

DAYS LEFT:
${studyData.daysLeft || 0}

HOURS PER DAY:
${studyData.hoursPerDay || 0}

START TIME:
${studyData.startTime || "Not provided"}

STUDY SCORE:
${studyData.studyScore || 0}

CURRENT STREAK:
${studyData.streak || 0}

COMPLETED TOPICS:
${progress.completedTopics.length}

TOTAL TOPICS:
${getAllTopics().length}

CURRENT SUBJECT:
${current ? current.subject : "All topics completed"}

CURRENT TOPIC:
${current ? current.topic : "All topics completed"}

CURRENT INSTRUCTIONS:

- Give clear and practical educational advice.
- Use the student's actual study data whenever relevant.
- Do not invent subjects, topics, exam dates, or other study information.
- If the student asks about something unrelated to studying, you may still answer helpfully.
- Keep explanations understandable for a secondary-school student.
- Encourage good study habits without being overly repetitive.
- When useful, give examples, steps, practice questions, or revision strategies.
`;

    }


    // ==========================================
    // ASK AI
    // ==========================================

    async function askAI(question) {

        try {

            console.log(
                "Sending request to StudyMind AI..."
            );


            const response =
                await fetch(
                    "/api",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({
                                prompt:
                                    buildAIStudyContext() +
                                    "\n\nSTUDENT QUESTION:\n" +
                                    question
                            })
                    }
                );


            const data =
                await response.json();


            console.log(
                "StudyMind AI response:",
                data
            );


            if (!response.ok) {

                throw new Error(
                    data.error ||
                    `AI request failed (${response.status})`
                );

            }


            if (!data.answer) {

                throw new Error(
                    "The AI server returned no answer."
                );

            }


            return data.answer;

        } catch (error) {

            console.error(
                "StudyMind AI error:",
                error
            );


            return `
                <div class="ai-error">
                    <strong>
                        ⚠️ StudyMind AI couldn't respond.
                    </strong>

                    <p>
                        ${error.message}
                    </p>
                </div>
            `;

        }

    }


    // ==========================================
    // FORMAT AI RESPONSE
    // ==========================================

    function formatAIResponse(text) {

        if (!text) {
            return "<p>The AI returned an empty response.</p>";
        }


        const safeText =
            String(text)
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");


        return `
            <div class="ai-answer">
                ${safeText
                    .replace(/\n\n/g, "</p><p>")
                    .replace(/\n/g, "<br>")}
            </div>
        `;

    }


    // ==========================================
    // CREATE AI SECTION
    // ==========================================

    function createAISection() {

        if (
            document.getElementById(
                "dashboardAI"
            )
        ) {
            return;
        }


        const section =
            document.createElement("section");


        section.className =
            "panel-card dashboard-ai";


        section.id =
            "dashboardAI";


        section.innerHTML = `
            <h2>🤖 StudyMind AI Coach</h2>

            <p>
                Ask your AI study coach anything about
                your current study plan, subjects,
                topics, or exam.
            </p>

            <button
                id="analyzeStudyButton"
                class="ai-button"
            >
                🤖 Analyze My Study Plan
            </button>

            <div
                id="aiResponse"
                class="ai-response"
            >
                <p>
                    Your AI analysis will appear here.
                </p>
            </div>

            <div class="ai-question-box">

                <input
                    type="text"
                    id="aiQuestion"
                    placeholder="Ask StudyMind AI something..."
                >

                <button
                    id="askAIButton"
                    class="ai-button"
                >
                    Ask AI
                </button>

            </div>
        `;


        document
            .querySelector(".bottom-dashboard")
            ?.appendChild(section);


        const analyzeButton =
            document.getElementById(
                "analyzeStudyButton"
            );


        const askButton =
            document.getElementById(
                "askAIButton"
            );


        const questionInput =
            document.getElementById(
                "aiQuestion"
            );


        const responseBox =
            document.getElementById(
                "aiResponse"
            );


        // ==========================================
        // ANALYZE STUDY PLAN
        // ==========================================

        if (analyzeButton) {

            analyzeButton.addEventListener(
                "click",
                async function () {

                    responseBox.innerHTML =
                        "<p>🤖 StudyMind AI is analyzing your study plan...</p>";


                    const question = `
Analyze my current study plan.

Please give me:

1. An assessment of my preparation.
2. My most important weak areas.
3. What I should study first.
4. How I should use my available study time.
5. Specific advice for my upcoming exam.
6. One short motivational message.

Use the study information provided to you.
Do not invent information about my plan.

Keep the response clear, practical, and student-friendly.
`;


                    const answer =
                        await askAI(question);


                    responseBox.innerHTML =
                        formatAIResponse(answer);

                }
            );

        }


        // ==========================================
        // ASK PERSONAL QUESTION
        // ==========================================

        if (askButton) {

            askButton.addEventListener(
                "click",
                async function () {

                    const question =
                        questionInput.value.trim();


                    if (!question) {

                        responseBox.innerHTML =
                            "<p>Please enter a question first.</p>";

                        return;

                    }


                    responseBox.innerHTML =
                        "<p>🤖 Thinking...</p>";


                    const answer =
                        await askAI(question);


                    responseBox.innerHTML =
                        formatAIResponse(answer);

                }
            );

        }


        // ==========================================
        // ENTER KEY
        // ==========================================

        if (questionInput) {

            questionInput.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key === "Enter"
                    ) {

                        askButton?.click();

                    }

                }
            );

        }

    }


    // ==========================================
    // THEME
    // ==========================================

    function loadTheme() {

        const savedTheme =
            localStorage.getItem("theme");


        if (savedTheme === "dark") {

            document.body.classList.add(
                "dark-mode"
            );


            if (themeButton) {

                themeButton.textContent =
                    "☀️ Light Mode";

            }

        } else {

            document.body.classList.remove(
                "dark-mode"
            );


            if (themeButton) {

                themeButton.textContent =
                    "🌙 Dark Mode";

            }

        }

    }


    if (themeButton) {

        themeButton.addEventListener(
            "click",
            function () {

                document.body.classList.toggle(
                    "dark-mode"
                );


                const dark =
                    document.body.classList.contains(
                        "dark-mode"
                    );


                localStorage.setItem(
                    "theme",
                    dark ? "dark" : "light"
                );


                themeButton.textContent =
                    dark
                        ? "☀️ Light Mode"
                        : "🌙 Dark Mode";

            }
        );

    }


    // ==========================================
    // INITIALIZE DASHBOARD
    // ==========================================

    updateTopStatistics();

    loadTheme();

    renderSubjects();

    renderCurrentStudy();

    renderTodaySchedule();

    updateProgressDisplay();

    renderCalendar();

    createAISection();

});

