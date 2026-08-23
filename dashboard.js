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

    const weeklyHours =
        document.getElementById("weeklyHours");

    const daysLeft =
        document.getElementById("daysLeft");

    const dailyGoal =
        document.getElementById("dailyGoal");

    const studyScore =
        document.getElementById("studyScore");

    const subjectList =
        document.getElementById("subjectList");

    const streakElement =
        document.getElementById("streak");

    const scoreDisplay =
        document.getElementById("scoreDisplay");

    const scoreMessage =
        document.getElementById("scoreMessage");

    const scoreProgressBar =
        document.getElementById("scoreProgressBar");

    const progressPercent =
        document.getElementById("progressPercent");

    const progressCount =
        document.getElementById("progressCount");

    const progressBar =
        document.getElementById("progressBar");

    const currentSubject =
        document.getElementById("currentSubject");

    const currentTopic =
        document.getElementById("currentTopic");

    const topicTime =
        document.getElementById("topicTime");

    const studyTimer =
        document.getElementById("studyTimer");

    const startStudyButton =
        document.getElementById("startStudyButton");

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

        if (
            typeof progress.currentTopicIndex !== "number"
        ) {
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


    let progress =
        getProgressData();


    // ==========================================
    // GET ALL TOPICS
    // ==========================================

    function getAllTopics() {

        const allTopics = [];

        const topics =
            studyData.topics || {};

        Object.keys(topics).forEach(
            function (subject) {

                const subjectTopics =
                    Array.isArray(topics[subject])
                        ? topics[subject]
                        : [];

                subjectTopics.forEach(
                    function (topic) {

                        allTopics.push({

                            subject: subject,

                            topic: topic

                        });

                    }
                );

            }
        );

        return allTopics;

    }


    // ==========================================
    // TOP STATISTICS
    // ==========================================

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


    // ==========================================
    // LIVE STUDY SCORE
    // ==========================================

    let baseScore =
        Number(studyData.studyScore) || 0;

    let completedTopics =
        progress.completedTopics.length;


    function updateStudyScore() {

        const totalTopics =
            getAllTopics().length;

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

            subject:
                allTopics[index].subject,

            topic:
                allTopics[index].topic

        };

    }


    // ==========================================
    // SUBJECT LIST
    // ==========================================

    function renderSubjects() {

        if (!subjectList) {
            return;
        }


        subjectList.innerHTML = "";


        subjects.forEach(
            function (subject) {

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


                Object.values(difficulty).forEach(
                    function (level) {

                        if (level === "weak") {
                            weakCount++;
                        }

                    }
                );


                const difficultyInfo =
                    document.createElement("p");


                if (weakCount > 0) {

                    difficultyInfo.textContent =
                        `🔴 ${weakCount} weak topic${weakCount === 1 ? "" : "s"}`;

                }

                else {

                    difficultyInfo.textContent =
                        "🟢 No weak topics";

                }


                subjectCard.appendChild(
                    subjectTitle
                );

                subjectCard.appendChild(
                    subjectInfo
                );

                subjectCard.appendChild(
                    difficultyInfo
                );


                subjectList.appendChild(
                    subjectCard
                );

            }
        );

    }


    // ==========================================
    // PROGRESS TRACKER
    // ==========================================

    function updateProgressDisplay() {

        const allTopics =
            getAllTopics();

        const total =
            allTopics.length;


        completedTopics =
            progress.completedTopics.length;


        const percent =
            total > 0
                ? Math.round(
                    (completedTopics / total) * 100
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
                `${completedTopics} of ${total} topics completed`;

        }


        updateStudyScore();

    }


    // ==========================================
    // CURRENT STUDY SESSION
    // ==========================================

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


        if (currentSubject) {

            currentSubject.textContent =
                current.subject;

        }


        if (currentTopic) {

            currentTopic.textContent =
                current.topic;

        }


        if (topicTime) {

            topicTime.textContent =
                `${hoursPerDay > 0
                    ? Math.round(
                        (hoursPerDay * 60) /
                        Math.max(subjects.length, 1)
                    )
                    : 30} min`;

        }


        if (completeTopicCheckbox) {

            completeTopicCheckbox.checked =
                progress.completedTopics.includes(
                    current.index
                );

        }

    }


    // ==========================================
    // COMPLETE CURRENT TOPIC
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


        updateProgressDisplay();

        renderCurrentStudy();

        renderTodaySchedule();

    }


    if (completeTopicCheckbox) {

        completeTopicCheckbox.addEventListener(
            "change",
            function () {

                if (
                    completeTopicCheckbox.checked
                ) {

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
            setInterval(
                function () {

                    timerSeconds++;

                    updateTimerDisplay();


                    const currentTopicData =
                        getCurrentTopicData();


                    if (currentTopicData) {

                        const key =
                            String(
                                currentTopicData.index
                            );


                        progress.studiedSeconds[key] =
                            (
                                progress.studiedSeconds[key] || 0
                            ) + 1;


                        saveProgress(progress);

                    }

                },
                1000
            );

    }


    function pauseTimer() {

        timerRunning = false;


        clearInterval(
            timerInterval
        );


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

                }

                else {

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
            Number(
                currentTime.split(":")[0]
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


            if (
                current &&
                i === 0
            ) {

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


            todaySchedule.appendChild(
                item
            );

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

            calendarDays.appendChild(
                empty
            );

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


            // TODAY

            if (
                date.toDateString() ===
                today.toDateString()
            ) {

                cell.classList.add(
                    "today"
                );

            }


            // EXAM DAY

            if (
                examDate &&
                dateString === examDate
            ) {

                cell.classList.add(
                    "exam-day"
                );

                cell.title =
                    "Exam Day";

            }


            // COMPLETED STUDY DAY

            if (
                completedDays.includes(
                    dateString
                )
            ) {

                cell.classList.add(
                    "completed-day"
                );

            }


            // STUDY DAY

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


            calendarDays.appendChild(
                cell
            );

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
    // MARK STUDY DAY COMPLETE
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
    // BUILD LIVE AI STUDY CONTEXT
    // ==========================================

    function getAIStudyContext() {

        const allTopics =
            getAllTopics();


        const current =
            getCurrentTopicData();


        const totalTopics =
            allTopics.length;


        const completed =
            progress.completedTopics.length;


        const progressPercent =
            totalTopics > 0
                ? Math.round(
                    (completed / totalTopics) * 100
                )
                : 0;


        const liveScore =
            totalTopics > 0
                ? Math.min(
                    100,
                    baseScore +
                    Math.round(
                        (completed / totalTopics) * 20
                    )
                )
                : baseScore;


        const currentTopicTime =
            current
                ? (
                    progress.studiedSeconds[
                        String(current.index)
                    ] || 0
                )
                : 0;


        const currentTopicMinutes =
            Math.floor(
                currentTopicTime / 60
            );


        return {

            curriculum:
                studyData.curriculum ||
                "Not specified",

            subjects:
                subjects,

            topics:
                studyData.topics ||
                {},

            topicDifficulties:
                studyData.topicDifficulty ||
                {},

            examDate:
                examDate ||
                "Not specified",

            daysLeft:
                studyData.daysLeft ||
                0,

            hoursPerDay:
                hoursPerDay,

            totalTopics:
                totalTopics,

            completedTopics:
                completed,

            progressPercent:
                progressPercent,

            currentSubject:
                current
                    ? current.subject
                    : "All topics completed",

            currentTopic:
                current
                    ? current.topic
                    : "All topics completed",

            currentTopicMinutes:
                currentTopicMinutes,

            liveStudyScore:
                liveScore,

            streak:
                studyData.streak ||
                0,

            startTime:
                studyData.startTime ||
                "16:00"

        };

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
                Ask your AI study coach anything about your
                current study plan, subjects, topics, or exam.
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
                        "<p>🤖 StudyMind AI is analyzing your current study plan...</p>";


                    const context =
                        getAIStudyContext();


                    const prompt = `

You are StudyMind AI, a personal AI study coach.

Analyze this student's CURRENT study dashboard.

IMPORTANT:
- Use only the information provided below.
- Do not invent subjects, topics, dates, scores, or progress.
- If something is not available, say so.
- Give practical advice based on the student's actual situation.
- Keep the response clear and student-friendly.

===== CURRENT STUDY DATA =====

Curriculum:
${context.curriculum}

Subjects:
${JSON.stringify(context.subjects)}

Topics:
${JSON.stringify(context.topics)}

Topic difficulties:
${JSON.stringify(context.topicDifficulties)}

Exam date:
${context.examDate}

Days remaining:
${context.daysLeft}

Hours per day:
${context.hoursPerDay}

Study start time:
${context.startTime}

Total topics:
${context.totalTopics}

Completed topics:
${context.completedTopics}

Overall progress:
${context.progressPercent}%

Current subject:
${context.currentSubject}

Current topic:
${context.currentTopic}

Time already spent on current topic:
${context.currentTopicMinutes} minutes

Live study score:
${context.liveStudyScore}/100

Study streak:
${context.streak} days

===== END STUDY DATA =====

Give the student:

1. A short assessment of their current preparation.
2. Their most important weak areas.
3. What they should study next and why.
4. Whether their current progress is appropriate for the time remaining.
5. How they should use their available study time.
6. Specific advice for improving their preparation.
7. One short encouraging message.

Prioritize the CURRENT TOPIC and CURRENT PROGRESS when giving advice.

Do not overwhelm the student with unnecessary information.

`;


                    const answer =
                        await askAI(prompt);


                    responseBox.innerHTML =
                        formatAIResponse(answer);

                }
            );

        }


        // ==========================================
        // ASK AI QUESTION
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


                    const context =
                        getAIStudyContext();


                    const prompt = `

You are StudyMind AI, the student's personal study coach.

Answer the student's question using their CURRENT StudyMind dashboard data.

IMPORTANT:
- Answer the student's actual question directly.
- Use their study data whenever relevant.
- Do not invent information.
- Do not claim the student completed something unless the data says so.
- If information is unavailable, say so.
- Keep the answer clear and useful for a student.
- When useful, connect your advice to their current topic, weak areas, progress, and exam date.

===== CURRENT STUDY DATA =====

Curriculum:
${context.curriculum}

Subjects:
${JSON.stringify(context.subjects)}

Topics:
${JSON.stringify(context.topics)}

Topic difficulties:
${JSON.stringify(context.topicDifficulties)}

Exam date:
${context.examDate}

Days remaining:
${context.daysLeft}

Hours per day:
${context.hoursPerDay}

Study start time:
${context.startTime}

Total topics:
${context.totalTopics}

Completed topics:
${context.completedTopics}

Overall progress:
${context.progressPercent}%

Current subject:
${context.currentSubject}

Current topic:
${context.currentTopic}

Time spent on current topic:
${context.currentTopicMinutes} minutes

Live study score:
${context.liveStudyScore}/100

Study streak:
${context.streak} days

===== STUDENT'S QUESTION =====

"${question}"

===== END DATA =====

Answer the student's question now.

`;


                    const answer =
                        await askAI(prompt);


                    responseBox.innerHTML =
                        formatAIResponse(answer);

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

        }

        else {

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

    loadTheme();

    renderSubjects();

    renderCurrentStudy();

    renderTodaySchedule();

    updateProgressDisplay();

    renderCalendar();

    createAISection();


    // ==========================================
    // WHEN A TOPIC IS COMPLETED
    // MARK TODAY AS STUDIED
    // ==========================================

    if (completeTopicCheckbox) {

        completeTopicCheckbox.addEventListener(
            "change",
            function () {

                if (
                    completeTopicCheckbox.checked
                ) {

                    markTodayAsStudied();

                }

            }
        );

    }

});

