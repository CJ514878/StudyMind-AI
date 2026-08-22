// ==========================================
// STUDYMIND AI - MAIN SCRIPT
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // ELEMENTS
    // ==========================================

    const welcomePage = document.getElementById("welcomePage");
    const welcomeButton = document.querySelector(".welcome-button");

    const startButton = document.getElementById("startButton");
    const cta = document.getElementById("cta");

    const generateButton = document.getElementById("generateButton");
    const generateDifficultyButton =
        document.getElementById("generateDifficultyButton");

    const difficultySection =
        document.getElementById("difficultySection");

    const topicsInput =
        document.getElementById("topics");

    const themeButton =
        document.getElementById("themeButton");


    // ==========================================
    // WELCOME PAGE
    // ==========================================

    if (welcomeButton && welcomePage) {

        welcomeButton.addEventListener("click", function () {

            welcomePage.classList.add("welcome-hidden");

        });

    }


    // ==========================================
    // START BUTTON
    // ==========================================

    if (startButton && cta) {

        startButton.addEventListener("click", function () {

            cta.scrollIntoView({
                behavior: "smooth"
            });

        });

    }


    // ==========================================
    // FORMAT TIME
    // ==========================================

    function formatTime(hour) {

        hour = hour % 24;

        let period = hour >= 12 ? "PM" : "AM";

        let displayHour = hour % 12;

        if (displayHour === 0) {
            displayHour = 12;
        }

        return `${displayHour}:00 ${period}`;

    }


    // ==========================================
    // TOPIC DIFFICULTY GENERATOR
    // ==========================================

    if (generateDifficultyButton) {

        generateDifficultyButton.addEventListener(
            "click",
            function () {

                if (!topicsInput || !difficultySection) {
                    return;
                }

                const topics = topicsInput.value.trim();

                if (topics === "") {

                    difficultySection.innerHTML =
                        "<p>Please enter your subjects and topics first.</p>";

                    difficultySection.style.display = "block";

                    return;
                }


                // ==========================================
                // PARSE TOPICS
                // ==========================================

                let topicData = {};

                let topicLines = topics
                    .split(/\r?\n/)
                    .map(line => line.trim())
                    .filter(line => line !== "");


                topicLines.forEach(function (line) {

                    const parts = line.split(":");

                    if (parts.length < 2) {
                        return;
                    }

                    const subjectName =
                        parts[0].trim().toLowerCase();

                    const subjectTopics =
                        parts
                            .slice(1)
                            .join(":")
                            .split(",")
                            .map(topic => topic.trim())
                            .filter(topic => topic !== "");

                    if (subjectName && subjectTopics.length > 0) {

                        topicData[subjectName] =
                            subjectTopics;

                    }

                });


                // ==========================================
                // CLEAR OLD DIFFICULTY SETTINGS
                // ==========================================

                difficultySection.innerHTML = "";


                if (Object.keys(topicData).length === 0) {

                    difficultySection.innerHTML =
                        "<p>Please use the format: Subject: Topic 1, Topic 2</p>";

                    difficultySection.style.display = "block";

                    return;
                }


                // ==========================================
                // CREATE DIFFICULTY SELECTORS
                // ==========================================

                Object.keys(topicData).forEach(function (subject) {

                    const subjectHeading =
                        document.createElement("h2");

                    subjectHeading.textContent = subject;

                    difficultySection.appendChild(
                        subjectHeading
                    );


                    topicData[subject].forEach(function (topic) {

                        const topicContainer =
                            document.createElement("div");

                        topicContainer.className =
                            "difficulty-topic";


                        const topicName =
                            document.createElement("div");

                        topicName.className =
                            "topic-name";

                        topicName.textContent =
                            topic;


                        const select =
                            document.createElement("select");

                        select.className =
                            "difficulty-select";

                        select.dataset.subject =
                            subject;

                        select.dataset.topic =
                            topic;


                        // Weak
                        const weakOption =
                            document.createElement("option");

                        weakOption.value = "weak";

                        weakOption.textContent =
                            "🔴 Weak";


                        // Medium
                        const mediumOption =
                            document.createElement("option");

                        mediumOption.value = "medium";

                        mediumOption.textContent =
                            "🟡 Medium";


                        // Strong
                        const strongOption =
                            document.createElement("option");

                        strongOption.value = "strong";

                        strongOption.textContent =
                            "🟢 Strong";


                        select.appendChild(weakOption);
                        select.appendChild(mediumOption);
                        select.appendChild(strongOption);


                        // Default
                        select.value = "medium";


                        topicContainer.appendChild(
                            topicName
                        );

                        topicContainer.appendChild(
                            select
                        );


                        difficultySection.appendChild(
                            topicContainer
                        );

                    });

                });


                difficultySection.style.display =
                    "block";


                // Save difficulty data
                updateDifficultyData();

            }
        );

    }


    // ==========================================
    // UPDATE DIFFICULTY DATA
    // ==========================================

    function updateDifficultyData() {

        window.topicDifficulty = {};

        const selectors =
            document.querySelectorAll(
                ".difficulty-select"
            );


        selectors.forEach(function (select) {

            const subject =
                select.dataset.subject;

            const topic =
                select.dataset.topic;


            if (!window.topicDifficulty[subject]) {

                window.topicDifficulty[subject] = {};

            }


            window.topicDifficulty[subject][topic] =
                select.value;

        });

    }


    // ==========================================
    // GENERATE STUDY PLAN
    // ==========================================

    if (generateButton) {

        generateButton.addEventListener(
            "click",
            function () {

                // ==========================================
                // GET INPUTS
                // ==========================================

                const curriculum =
                    document.getElementById("curriculum")?.value || "";

                const subjectsInput =
                    document.getElementById("subjects")?.value || "";

                const topics =
                    document.getElementById("topics")?.value || "";

                const examDate =
                    document.getElementById("examDate")?.value || "";

                const hoursPerDay =
                    Number(
                        document.getElementById("hoursPerDay")?.value
                    );

                const startTime =
                    document.getElementById("startTime")?.value || "";

                const plan =
                    document.getElementById("studyPlan");


                // ==========================================
                // VALIDATION
                // ==========================================

                if (!plan) {

                    console.error(
                        "studyPlan element was not found."
                    );

                    return;

                }


                if (subjectsInput.trim() === "") {

                    alert(
                        "Please enter at least one subject."
                    );

                    return;

                }


                if (examDate === "") {

                    alert(
                        "Please select your exam date."
                    );

                    return;

                }


                if (!hoursPerDay ||
                    isNaN(hoursPerDay) ||
                    hoursPerDay <= 0) {

                    alert(
                        "Please enter the number of hours you can study each day."
                    );

                    return;

                }


                if (startTime === "") {

                    alert(
                        "Please choose a study start time."
                    );

                    return;

                }


                // ==========================================
                // START TIME
                // ==========================================

                const startHour =
                    Number(
                        startTime.split(":")[0]
                    );


                // ==========================================
                // SUBJECT LIST
                // ==========================================

                const subjectList =
                    subjectsInput
                        .split(/[.,;]/)
                        .map(subject =>
                            subject.trim().toLowerCase()
                        )
                        .filter(subject =>
                            subject !== ""
                        );


                if (subjectList.length === 0) {

                    alert(
                        "Please enter at least one valid subject."
                    );

                    return;

                }


                const numberOfSubjects =
                    subjectList.length;


                // ==========================================
                // EXAM DATE
                // ==========================================

                const today =
                    new Date();

                const exam =
                    new Date(examDate);


                today.setHours(0, 0, 0, 0);
                exam.setHours(0, 0, 0, 0);


                if (exam < today) {

                    alert(
                        "The exam date has already passed. Please choose a future date."
                    );

                    return;

                }


                const timeDifference =
                    exam - today;


                const daysLeft =
                    Math.ceil(
                        timeDifference /
                        (1000 * 60 * 60 * 24)
                    );


                // ==========================================
                // URGENCY
                // ==========================================

                let urgency = "";

                if (daysLeft > 90) {

                    urgency =
                        "🟢 You have plenty of time. Focus on learning new concepts.";

                }

                else if (daysLeft > 30) {

                    urgency =
                        "🟡 Your exam is getting closer. Start practicing past questions regularly.";

                }

                else if (daysLeft > 7) {

                    urgency =
                        "🟠 Your exam is close. Increase your revision and practice every day.";

                }

                else {

                    urgency =
                        "🔴❗ Your exam is just around the corner! Focus on revision and mock tests.";

                }


                // ==========================================
                // PARSE TOPIC DATA
                // ==========================================

                let topicData = {};

                const topicLines =
                    topics
                        .split(/\r?\n/)
                        .map(line => line.trim())
                        .filter(line => line !== "");


                topicLines.forEach(function (line) {

                    const parts =
                        line.split(":");


                    if (parts.length < 2) {
                        return;
                    }


                    const subjectName =
                        parts[0]
                            .trim()
                            .toLowerCase();


                    const subjectTopics =
                        parts
                            .slice(1)
                            .join(":")
                            .split(",")
                            .map(topic =>
                                topic.trim()
                            )
                            .filter(topic =>
                                topic !== ""
                            );


                    topicData[subjectName] =
                        subjectTopics;

                });


                // ==========================================
                // TOPIC DIFFICULTIES
                // ==========================================

                let topicDifficulty = {};
                let topicPriority = {};


                const difficultySelectors =
                    document.querySelectorAll(
                        ".difficulty-select"
                    );


                difficultySelectors.forEach(
                    function (select) {

                        const subject =
                            select.dataset.subject;

                        const topic =
                            select.dataset.topic;


                        if (!topicDifficulty[subject]) {

                            topicDifficulty[subject] = {};
                            topicPriority[subject] = {};

                        }


                        topicDifficulty[subject][topic] =
                            select.value;


                        if (select.value === "weak") {

                            topicPriority[subject][topic] =
                                3;

                        }

                        else if (
                            select.value === "medium"
                        ) {

                            topicPriority[subject][topic] =
                                2;

                        }

                        else {

                            topicPriority[subject][topic] =
                                1;

                        }

                    }
                );


                // ==========================================
                // TODAY
                // ==========================================

                const currentDay =
                    new Date().getDay();


                const dayNames = [
                    "Sunday",
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday"
                ];


                const todayName =
                    dayNames[currentDay];


                const todaySubject =
                    subjectList[
                        currentDay %
                        subjectList.length
                    ];


                // ==========================================
                // SUBJECT PRIORITIES
                // ==========================================

                let subjectPriority = {};


                subjectList.forEach(
                    function (subject) {

                        const difficulties =
                            topicPriority[subject];


                        let weakestLevel = 2;


                        if (difficulties) {

                            const values =
                                Object.values(
                                    difficulties
                                );


                            if (values.length > 0) {

                                weakestLevel =
                                    Math.max(...values);

                            }

                        }


                        subjectPriority[subject] =
                            weakestLevel;

                    }
                );


                // ==========================================
                // DAILY SCHEDULE
                // ==========================================

                let dailySchedule = "";

                let usedSubjects = {};


                subjectList.forEach(
                    function (subject) {

                        usedSubjects[subject] = 0;

                    }
                );


                for (
                    let index = 0;
                    index < hoursPerDay;
                    index++
                ) {

                    let bestSubject = null;

                    let bestPriority =
                        -Infinity;


                    subjectList.forEach(
                        function (subject) {

                            const priority =
                                subjectPriority[subject] || 2;


                            const adjustedPriority =
                                priority -
                                (
                                    usedSubjects[subject] *
                                    1.5
                                );


                            if (
                                bestSubject === null ||
                                adjustedPriority >
                                bestPriority
                            ) {

                                bestPriority =
                                    adjustedPriority;

                                bestSubject =
                                    subject;

                            }

                        }
                    );


                    usedSubjects[bestSubject]++;


                    const start =
                        startHour + index;

                    const end =
                        start + 1;


                    dailySchedule += `

                        <div class="schedule-card">

                            <h4>
                                ${formatTime(start)}
                                -
                                ${formatTime(end)}
                            </h4>

                            <p>
                                <strong>
                                    ${bestSubject}
                                </strong>
                            </p>

                        </div>

                    `;

                }


                // ==========================================
                // WEEKLY TIMETABLE
                // ==========================================

                let timetableData = [];

                let timetable =
                    `<table>`;


                if (daysLeft > 30) {

                    for (
                        let h = 0;
                        h < hoursPerDay;
                        h++
                    ) {

                        const start =
                            startHour + h;

                        const end =
                            start + 1;


                        const displayStart =
                            formatTime(start);

                        const displayEnd =
                            formatTime(end);


                        let row = [];

                        row.push(
                            `${displayStart} - ${displayEnd}`
                        );


                        timetable += `<tr>`;


                        for (
                            let d = 0;
                            d < 7;
                            d++
                        ) {

                            const subject =
                                subjectList[
                                    (
                                        d + h
                                    ) %
                                    subjectList.length
                                ];


                            row.push(subject);


                            timetable +=
                                `<td>${subject}</td>`;

                        }


                        timetableData.push(row);


                        timetable +=
                            `</tr>`;

                    }

                }

                else {

                    const activities = [
                        "Past Questions",
                        "Weak Topics",
                        "Timed Practice",
                        "Mistake Review"
                    ];


                    for (
                        let h = 0;
                        h < hoursPerDay;
                        h++
                    ) {

                        const start =
                            startHour + h;

                        const end =
                            start + 1;


                        const displayStart =
                            formatTime(start);

                        const displayEnd =
                            formatTime(end);


                        let row = [];

                        row.push(
                            `${displayStart} - ${displayEnd}`
                        );


                        timetable += `<tr>`;


                        for (
                            let d = 0;
                            d < 7;
                            d++
                        ) {

                            const activity =
                                activities[
                                    (
                                        d + h
                                    ) %
                                    activities.length
                                ];


                            row.push(activity);


                            timetable +=
                                `<td>${activity}</td>`;

                        }


                        timetableData.push(row);


                        timetable +=
                            `</tr>`;

                    }

                }


                timetable += `</table>`;


                // ==========================================
                // CURRICULUM ADVICE
                // ==========================================

                let advice =
                    "Revise consistently and practice questions regularly.";


                if (curriculum === "WAEC") {

                    advice =
                        "Practice WAEC past questions at least three times every week.";

                }

                else if (curriculum === "JAMB") {

                    advice =
                        "Practice CBT questions daily to improve your speed and accuracy.";

                }

                else if (curriculum === "NECO") {

                    advice =
                        "Combine your class notes with NECO past questions.";

                }

                else if (curriculum === "IGCSE") {

                    advice =
                        "Focus on understanding concepts and solving structured questions.";

                }

                else if (curriculum === "SAT") {

                    advice =
                        "Spend time on timed reading and math practice tests.";

                }


                // ==========================================
                // RECOMMENDATIONS
                // ==========================================

                let recommendations = "";


                subjectList.forEach(
                    function (subject) {

                        let tip =
                            "Revise this subject carefully.";


                        switch (subject) {

                            case "mathematics":

                                tip =
                                    "Practice calculations and solve at least 20 questions.";

                                break;


                            case "english":

                                tip =
                                    "Read a comprehension passage and learn five new vocabulary words.";

                                break;


                            case "physics":

                                tip =
                                    "Revise formulas and solve numerical problems.";

                                break;


                            case "chemistry":

                                tip =
                                    "Study chemical equations and balancing reactions.";

                                break;


                            case "biology":

                                tip =
                                    "Study diagrams and important definitions.";

                                break;


                            case "economics":

                                tip =
                                    "Review graphs and important economic concepts.";

                                break;


                            case "government":

                                tip =
                                    "Read the constitution and revise key political ideas.";

                                break;

                        }


                        recommendations += `

                            <div class="recommendation-card">

                                <h4>📚 ${subject}</h4>

                                <p>${tip}</p>

                            </div>

                        `;

                    }
                );


                // ==========================================
                // STUDY SCORE
                // ==========================================

                let studyScore = 100;


                if (
                    numberOfSubjects >= 7 &&
                    hoursPerDay < 3
                ) {

                    studyScore -= 25;

                }


                if (daysLeft <= 14) {

                    studyScore -= 15;

                }


                if (hoursPerDay >= 5) {

                    studyScore += 10;

                }


                if (daysLeft > 90) {

                    studyScore += 5;

                }


                studyScore =
                    Math.max(
                        0,
                        Math.min(
                            100,
                            studyScore
                        )
                    );


                // ==========================================
                // STUDY STREAK
                // ==========================================

                let streak =
                    Number(
                        localStorage.getItem(
                            "studyStreak"
                        )
                    ) || 0;


                const lastVisit =
                    localStorage.getItem(
                        "lastStudyDate"
                    );


                const todayDate =
                    new Date().toDateString();


                if (lastVisit !== todayDate) {

                    streak++;


                    localStorage.setItem(
                        "studyStreak",
                        streak
                    );


                    localStorage.setItem(
                        "lastStudyDate",
                        todayDate
                    );

                }


                // ==========================================
                // STUDY DATA
                // ==========================================

                const studyData = {

                    curriculum,

                    subjects: subjectList,

                    topics: topicData,

                    topicDifficulty,

                    topicPriority,

                    examDate,

                    startTime,

                    todaySubject,

                    advice,

                    daysLeft,

                    urgency,

                    hoursPerDay,

                    timetableData,

                    studyScore,

                    streak

                };


                // ==========================================
                // DISPLAY STUDY PLAN
                // ==========================================

                plan.innerHTML = `

                    <h2>Your Study Plan</h2>


                    <div class="dashboard">

                        <div class="card">
                            <h3>⌛</h3>
                            <h2>${daysLeft}</h2>
                            <p>Days Left</p>
                        </div>


                        <div class="card">
                            <h3>📚</h3>
                            <h2>${numberOfSubjects}</h2>
                            <p>Subjects</p>
                        </div>


                        <div class="card">
                            <h3>⏰</h3>
                            <h2>${hoursPerDay}</h2>
                            <p>Hours / Day</p>
                        </div>


                        <div class="card">
                            <h3>🎯</h3>
                            <h2>${todaySubject}</h2>
                            <p>Today's Focus</p>
                        </div>


                        <div class="card">
                            <h3>🔥</h3>
                            <h2>${streak}</h2>
                            <p>Study Streak</p>
                        </div>


                        <div class="card">
                            <h3>⭐</h3>
                            <h2>${studyScore}</h2>
                            <p>Study Score</p>
                        </div>

                    </div>


                    <h3>📈 Study Evaluation</h3>

                    <p>

                        ${
                            studyScore >= 90
                                ? "🏆 Excellent! Your study plan is well balanced."
                                : studyScore >= 75
                                ? "⭐ Good! Keep following your schedule."
                                : studyScore >= 60
                                ? "⚠️ Fair. Consider increasing your study hours."
                                : "❌ Your plan needs improvement. Reduce distractions and study more consistently."
                        }

                    </p>


                    <p>
                        <strong>Curriculum:</strong>
                        ${curriculum}
                    </p>


                    <p>
                        <strong>Subjects:</strong>
                        ${subjectList.join(", ")}
                    </p>


                    <p>${advice}</p>

                    <p>${urgency}</p>


                    <h3>📌 Today's Mission</h3>

                    <p>

                        Today is
                        <strong>${todayName}</strong>.

                        Your main focus is
                        <strong>${todaySubject}</strong>.

                        Complete every study session before taking a break.

                    </p>


                    <h3>📅 Today's Schedule</h3>

                    <div class="dailySchedule">

                        ${dailySchedule}

                    </div>


                    <h3>📆 Weekly Timetable</h3>

                    ${timetable}


                    <h3>✅ Progress Tracker</h3>

                    <div id="progressTracker">

                        ${
                            subjectList.map(
                                subject => `

                                <label class="progress-item">

                                    <input
                                        type="checkbox"
                                        class="subjectCheck"
                                        value="${subject}"
                                    >

                                    ${subject}

                                </label>

                                <br>

                            `
                            ).join("")
                        }

                    </div>


                    <h3>📈 Progress</h3>


                    <div class="progressBarContainer">

                        <div
                            id="progressBar"
                            style="width: 0%;"
                        ></div>

                    </div>


                    <p>

                        <span id="progressPercent">
                            0%
                        </span>

                        completed

                    </p>


                    <p id="progressCount">

                        0 of
                        ${numberOfSubjects}
                        subjects completed

                    </p>


                    <h3>🏆 Achievements</h3>


                    <div class="badges">

                        ${
                            daysLeft <= 30
                                ? '<div class="badge">🔥 Exam Warrior</div>'
                                : ""
                        }


                        ${
                            numberOfSubjects >= 5
                                ? '<div class="badge">📚 Multi-Subject Learner</div>'
                                : ""
                        }


                        <div class="badge">

                            🥇 First Study Plan

                        </div>


                        ${
                            hoursPerDay >= 5
                                ? '<div class="badge">⭐ Productivity Master</div>'
                                : ""
                        }

                    </div>


                    <h3>📊 Study Statistics</h3>


                    <div class="stats">

                        <div class="stat-box">

                            <h4>📚 Total Subjects</h4>

                            <p>
                                ${numberOfSubjects}
                            </p>

                        </div>


                        <div class="stat-box">

                            <h4>⏰ Weekly Hours</h4>

                            <p>
                                ${hoursPerDay * 7}
                            </p>

                        </div>


                        <div class="stat-box">

                            <h4>📅 Days Left</h4>

                            <p>
                                ${daysLeft}
                            </p>

                        </div>


                        <div class="stat-box">

                            <h4>🔥 Daily Goal</h4>

                            <p>
                                ${hoursPerDay} hrs
                            </p>

                        </div>

                    </div>


                    <h3>💡 Subject Recommendations</h3>


                    <div class="recommendations">

                        ${recommendations}

                    </div>

                `;


                // ==========================================
                // PROGRESS TRACKER
                // ==========================================

                const checks =
                    plan.querySelectorAll(
                        ".subjectCheck"
                    );


                function updateProgress() {

                    let completed = 0;


                    checks.forEach(
                        function (check) {

                            if (check.checked) {

                                completed++;

                            }

                        }
                    );


                    const percent =
                        checks.length > 0
                            ? Math.round(
                                (
                                    completed /
                                    checks.length
                                ) * 100
                            )
                            : 0;


                    const progressPercent =
                        document.getElementById(
                            "progressPercent"
                        );


                    const progressBar =
                        document.getElementById(
                            "progressBar"
                        );


                    const progressCount =
                        document.getElementById(
                            "progressCount"
                        );


                    if (progressPercent) {

                        progressPercent.textContent =
                            percent + "%";

                    }


                    if (progressBar) {

                        progressBar.style.width =
                            percent + "%";

                    }


                    if (progressCount) {

                        progressCount.textContent =
                            `${completed} of ${checks.length} subjects completed`;

                    }

                }


                checks.forEach(
                    function (check) {

                        check.addEventListener(
                            "change",
                            updateProgress
                        );

                    }
                );


                // ==========================================
                // RESET PROGRESS FOR NEW PLAN
                // ==========================================

                localStorage.setItem(
                    "completedSubjects",
                    JSON.stringify([])
                );


                localStorage.setItem(
                    "studyProgress",
                    JSON.stringify({

                        completedTopics: [],

                        studiedSeconds: {},

                        currentTopicIndex: 0

                    })
                );


                updateProgress();


                // ==========================================
                // SAVE STUDY PLAN
                // ==========================================

                localStorage.setItem(
                    "studyPlan",
                    plan.innerHTML
                );


                localStorage.setItem(
                    "studyData",
                    JSON.stringify(studyData)
                );


                // ==========================================
                // GO TO DASHBOARD
                // ==========================================

                window.location.href =
                    "dashboard.html";

            }
        );

    }


    // ==========================================
    // DARK MODE
    // ==========================================

    if (
        localStorage.getItem("theme") === "dark"
    ) {

        document.body.classList.add(
            "dark-mode"
        );


        if (themeButton) {

            themeButton.textContent =
                "☀️ Light Mode";

        }

    }


    if (themeButton) {

        themeButton.addEventListener(
            "click",
            function () {

                document.body.classList.toggle(
                    "dark-mode"
                );


                if (
                    document.body.classList.contains(
                        "dark-mode"
                    )
                ) {

                    localStorage.setItem(
                        "theme",
                        "dark"
                    );


                    themeButton.textContent =
                        "☀️ Light Mode";

                }

                else {

                    localStorage.setItem(
                        "theme",
                        "light"
                    );


                    themeButton.textContent =
                        "🌙 Dark Mode";

                }

            }
        );

    }

});
