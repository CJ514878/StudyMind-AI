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

        try {

            const savedProgress =
                JSON.parse(
                    localStorage.getItem("studyProgress")
                );

            if (savedProgress) {

                if (!Array.isArray(savedProgress.completedTopics)) {
                    savedProgress.completedTopics = [];
                }

                if (!savedProgress.studiedSeconds) {
                    savedProgress.studiedSeconds = {};
                }

                if (
                    typeof savedProgress.currentTopicIndex !== "number"
                ) {
                    savedProgress.currentTopicIndex = 0;
                }

                return savedProgress;
            }

        } catch (error) {

            console.error(
                "Could not load study progress:",
                error
            );

        }

        return {
            completedTopics: [],
            studiedSeconds: {},
            currentTopicIndex: 0
        };
    }


    function saveProgress(progress) {

        localStorage.setItem(
            "studyProgress",
            JSON.stringify(progress)
        );

    }


    let progress =
        getProgressData();


    // ==========================================
    // GET ALL TOPICS
    // ==========================================

    function getAllTopics() {

        const allTopics = [];

        const topics =
            studyData.topics || {};

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

    function renderStatistics() {

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

            }

            else if (liveScore >= 75) {

                scoreMessage.textContent =
                    "⭐ Great progress! Keep following your study plan.";

            }

            else if (liveScore >= 60) {

                scoreMessage.textContent =
                    "⚠️ You're making progress. Stay consistent and complete more topics.";

            }

            else {

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
                ? Math.round(
                    (completed / total) * 100
                )
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

                startStudyButton.disabled =
                    true;

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


        const minutesPerTopic =
            hoursPerDay > 0
                ? Math.round(
                    (hoursPerDay * 60) /
                    Math.max(subjects.length, 1)
                )
                : 30;


        if (topicTime) {

            topicTime.textContent =
                `${minutesPerTopic} min`;

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
            Math.floor(
                (seconds % 3600) / 60
            );

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


        const current =
            getCurrentTopicData();


        if (!current) {
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


                const currentTopic =
                    getCurrentTopicData();


                if (currentTopic) {

                    const key =
                        String(currentTopic.index);


                    progress.studiedSeconds[key] =
                        (
                            progress.studiedSeconds[key] || 0
                        ) + 1;


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


        const startTime =
            studyData.startTime || "16:00";


        const startHour =
            Number(
                startTime.split(":")[0]
            );


        for (
            let i = 0;
            i < hoursPerDay;
            i++
        ) {

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
                    (
                        currentDay + i
                    ) % Math.max(subjects.length, 1)
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


        for (
            let i = 0;
            i < firstDay;
            i++
        ) {

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
                date.toISOString()
                    .split("T")[0];


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
    // COMPLETED STUDY DAYS
    // ==========================================

    function markTodayAsStudied() {

        const todayString =
            new Date()
                .toISOString()
                .split("T")[0];


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
    // AI STUDY COACH
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

           <div class="dashboard-ai-buttons">

    <button
        id="analyzeStudyButton"
        class="ai-button"
    >
        🤖 Analyze My Study Plan
    </button>

</div>

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
        // AI CONNECTION
        // ==========================================

        async function askStudyMindAI(prompt) {

            try {

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
                                    prompt: prompt
                                })
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.error ||
                        "AI request failed."
                    );

                }


                if (!data.answer) {

                    throw new Error(
                        "The AI returned no answer."
                    );

                }


                return data.answer;

            }

            catch (error) {

                console.error(
                    "StudyMind AI Error:",
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
        // BUILD AI STUDY CONTEXT
        // ==========================================

        function buildStudyContext() {

            const allTopics =
                getAllTopics();


            const completedCount =
                progress.completedTopics.length;


            const totalTopics =
                allTopics.length;


            const progressPercentage =
                totalTopics > 0
                    ? Math.round(
                        (
                            completedCount /
                            totalTopics
                        ) * 100
                    )
                    : 0;


            const current =
                getCurrentTopicData();


            return `

STUDENT STUDY CONTEXT

Curriculum:
${studyData.curriculum || "Not specified"}

Subjects:
${subjects.length > 0
    ? subjects.join(", ")
    : "No subjects available"}

Topics:
${JSON.stringify(
    studyData.topics || {},
    null,
    2
)}

Topic difficulties:
${JSON.stringify(
    studyData.topicDifficulty || {},
    null,
    2
)}

Exam date:
${studyData.examDate || "Not specified"}

Days remaining:
${studyData.daysLeft || 0}

Hours available per day:
${studyData.hoursPerDay || 0}

Study start time:
${studyData.startTime || "Not specified"}

Study score:
${studyData.studyScore || 0}

Current streak:
${studyData.streak || 0}

Completed topics:
${completedCount}

Total topics:
${totalTopics}

Overall topic progress:
${progressPercentage}%

Current topic:
${current
    ? `${current.subject} - ${current.topic}`
    : "No current topic"}

Completed topic indexes:
${JSON.stringify(
    progress.completedTopics
)}

            `;

        }


        // ==========================================
        // ANALYZE STUDY PLAN
        // ==========================================

        if (analyzeButton) {

            analyzeButton.addEventListener(
                "click",
                async function () {

                    responseBox.innerHTML =
                        "<p>🤖 StudyMind AI is analyzing your study plan...</p>";


                    const prompt = `

You are StudyMind AI, an intelligent personal
study coach.

Your job is to help the student study more
effectively based on their ACTUAL study data.

IMPORTANT RULES:

- Use the student's study context below.
- Do not invent subjects, topics, exam dates,
  or other information.
- Identify weak areas from the provided data.
- Prioritize topics intelligently.
- Give practical advice.
- Keep the response clear and student-friendly.
- Do not overwhelm the student with unnecessary text.

${buildStudyContext()}

Analyze the student's study plan.

Give the response using these sections:

📊 Preparation Assessment

🔴 Weak Areas

🎯 What To Study First

⏱️ Time Management

📚 Exam Strategy

💡 One Final Tip

Keep each section concise but useful.

                    `;


                    const answer =
                        await askStudyMindAI(
                            prompt
                        );


                    responseBox.innerHTML =
                        formatAIResponse(
                            answer
                        );

                }
            );

        }


        // ==========================================
        // ASK AI QUESTION
        // ==========================================

        async function submitQuestion() {

            const question =
                questionInput.value.trim();


            if (!question) {

                responseBox.innerHTML =
                    "<p>Please enter a question first.</p>";

                return;

            }


            responseBox.innerHTML =
                "<p>🤖 StudyMind AI is thinking...</p>";


            const prompt = `

You are StudyMind AI, the student's personal
study coach.

Use the student's study context below to answer
their question.

IMPORTANT:

- Answer the student's actual question directly.
- Use their study data when relevant.
- Do not invent information.
- If their question is unrelated to studying,
  still answer helpfully but keep the response
  appropriate and educational.
- Keep the explanation clear and practical.

${buildStudyContext()}

STUDENT QUESTION:

"${question}"

Give the best possible answer.

            `;


            const answer =
                await askStudyMindAI(
                    prompt
                );


            responseBox.innerHTML =
                formatAIResponse(
                    answer
                );

        }


        if (askButton) {

            askButton.addEventListener(
                "click",
                submitQuestion
            );

        }


        if (questionInput) {

            questionInput.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key === "Enter"
                    ) {

                        submitQuestion();

                    }

                }
            );

        }

    }


    // ==========================================
    // FORMAT AI RESPONSE
    // ==========================================

    function formatAIResponse(text) {

        if (!text) {

            return `
                <p>
                    The AI returned an empty response.
                </p>
            `;

        }


        const safeText =
            String(text)
                .replace(
                    /&/g,
                    "&amp;"
                )
                .replace(
                    /</g,
                    "&lt;"
                )
                .replace(
                    />/g,
                    "&gt;"
                );


        return `

            <div class="ai-answer">

                ${safeText
                    .replace(
                        /\n\n/g,
                        "</p><p>"
                    )
                    .replace(
                        /\n/g,
                        "<br>"
                    )}

            </div>

        `;

    }


    // ==========================================
    // THEME
    // ==========================================

    function loadTheme() {

        const savedTheme =
            localStorage.getItem(
                "theme"
            );


        if (
            savedTheme === "dark"
        ) {

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
                    dark
                        ? "dark"
                        : "light"
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

    renderStatistics();

    renderSubjects();

    renderCurrentStudy();

    renderTodaySchedule();

    updateProgressDisplay();

    renderCalendar();

    createAISection();

});
