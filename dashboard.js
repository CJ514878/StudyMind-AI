// ==========================================
// STUDYMIND AI DASHBOARD
// ==========================================


// ==========================================
// GET SAVED STUDY DATA
// ==========================================

let studyData =
    JSON.parse(localStorage.getItem("studyData"));

if (!studyData) {

    alert("Please generate a study plan first.");

    window.location.href = "index.html";

    throw new Error("No study data found.");

}


// ==========================================
// BASIC INFORMATION
// ==========================================

let hoursPerDay =
    Number(studyData.hoursPerDay) || 0;

let daysLeft =
    Number(studyData.daysLeft) || 0;

let subjects =
    Array.isArray(studyData.subjects)
        ? studyData.subjects
        : [];


// ==========================================
// BASIC DASHBOARD VALUES
// ==========================================

let weeklyHours =
    document.getElementById("weeklyHours");

if (weeklyHours) {

    weeklyHours.textContent =
        hoursPerDay * 7;

}


let daysLeftElement =
    document.getElementById("daysLeft");

if (daysLeftElement) {

    daysLeftElement.textContent =
        daysLeft;

}


let dailyGoal =
    document.getElementById("dailyGoal");

if (dailyGoal) {

    dailyGoal.textContent =
        hoursPerDay + " hrs";

}


// ==========================================
// TOPIC DATA
// ==========================================

let topics =
    studyData.topics || {};

let studyTopics = [];


// ==========================================
// BUILD TOPIC LIST
// ==========================================

for (let subject in topics) {

    let subjectTopics =
        topics[subject];

    if (!Array.isArray(subjectTopics)) {
        continue;
    }


    subjectTopics.forEach(function(topic) {

        studyTopics.push({

            subject: subject,

            topic: topic

        });

    });

}


// ==========================================
// STUDY PROGRESS STORAGE
// ==========================================


let studyProgress =
    JSON.parse(
        localStorage.getItem("studyProgress")
    ) || {
        completedTopics: [],
        studiedSeconds: {},
        currentTopicIndex: 0
    };


// Make sure all required properties exist
studyProgress.completedTopics =
    Array.isArray(studyProgress.completedTopics)
        ? studyProgress.completedTopics
        : [];

studyProgress.studiedSeconds =
    studyProgress.studiedSeconds &&
    typeof studyProgress.studiedSeconds === "object"
        ? studyProgress.studiedSeconds
        : {};

studyProgress.currentTopicIndex =
    Number(studyProgress.currentTopicIndex) || 0;

// ==========================================
// CLEAN OLD / INVALID DATA
// ==========================================

// Only keep completed topics that actually
// exist in the CURRENT study plan.

let validTopicIds =
    studyTopics.map(function(item) {

        return item.subject +
            "::" +
            item.topic;

    });


studyProgress.completedTopics =
    studyProgress.completedTopics.filter(
        function(id) {

            return validTopicIds.includes(id);

        }
    );


// Make sure index is valid

if (
    studyProgress.currentTopicIndex < 0 ||
    studyProgress.currentTopicIndex >
        studyTopics.length
) {

    studyProgress.currentTopicIndex = 0;

}


localStorage.setItem(
    "studyProgress",
    JSON.stringify(studyProgress)
);


// ==========================================
// REQUIRED TIME PER TOPIC
// ==========================================

let totalDailyMinutes =
    Math.max(
        15,
        Math.round(
            (hoursPerDay * 60) /
            Math.max(1, studyTopics.length)
        )
    );


// ==========================================
// CURRENT TOPIC
// ==========================================

function getCurrentTopic() {

    while (
        studyProgress.currentTopicIndex <
        studyTopics.length
    ) {

        let topic =
            studyTopics[
                studyProgress.currentTopicIndex
            ];


        let topicId =
            topic.subject +
            "::" +
            topic.topic;


        if (
            !studyProgress.completedTopics.includes(
                topicId
            )
        ) {

            return {

                data: topic,

                id: topicId

            };

        }


        studyProgress.currentTopicIndex++;

    }


    return null;

}


// ==========================================
// TOTAL REQUIRED STUDY TIME
// ==========================================

let totalRequiredSeconds =
    Math.max(
        1,
        studyTopics.length *
        totalDailyMinutes *
        60
    );


// ==========================================
// SAVE PROGRESS
// ==========================================

function saveStudyProgress() {

    localStorage.setItem(
        "studyProgress",
        JSON.stringify(studyProgress)
    );

}


// ==========================================
// SUBJECT COMPLETION
// ==========================================

function isSubjectCompleted(subject) {

    let subjectTopics =
        studyTopics.filter(
            function(item) {

                return item.subject === subject;

            }
        );


    if (subjectTopics.length === 0) {

        return false;

    }


    return subjectTopics.every(
        function(item) {

            let topicId =
                item.subject +
                "::" +
                item.topic;


            return studyProgress.completedTopics.includes(
                topicId
            );

        }
    );

}


// ==========================================
// PROGRESS TRACKER
// ==========================================

function updateProgress() {

    let totalSubjects =
        subjects.length;


    let completedSubjectCount =
        0;


    subjects.forEach(
        function(subject) {

            if (
                isSubjectCompleted(subject)
            ) {

                completedSubjectCount++;

            }

        }
    );


    let percentage =
        totalSubjects > 0
            ? Math.round(
                (
                    completedSubjectCount /
                    totalSubjects
                ) * 100
            )
            : 0;


    // --------------------------------------
    // PERCENTAGE
    // --------------------------------------

    let progressPercent =
        document.getElementById(
            "progressPercent"
        );


    if (progressPercent) {

        progressPercent.textContent =
            percentage + "%";

    }


    // --------------------------------------
    // COUNT
    // --------------------------------------

    let progressCount =
        document.getElementById(
            "progressCount"
        );


    if (progressCount) {

        progressCount.textContent =
            completedSubjectCount +
            " of " +
            totalSubjects +
            " subjects completed";

    }


    // --------------------------------------
    // PROGRESS BAR
    // --------------------------------------

    let progressBar =
        document.getElementById(
            "progressBar"
        );


    if (progressBar) {

        progressBar.style.width =
            percentage + "%";

    }


    // --------------------------------------
    // SUBJECT CHECKBOXES
    // --------------------------------------

    let subjectCheckboxes =
        document.querySelectorAll(
            "#subjectList input[type='checkbox']"
        );


    subjectCheckboxes.forEach(
        function(checkbox) {

            let subject =
                checkbox.value;


            checkbox.checked =
                isSubjectCompleted(subject);

        }
    );

}


// ==========================================
// SUBJECT LIST
// ==========================================

let subjectListElement =
    document.getElementById(
        "subjectList"
    );


if (subjectListElement) {

    subjectListElement.innerHTML = "";


    subjects.forEach(
        function(subject) {

            let label =
                document.createElement("label");


            label.className =
                "dashboardSubject";


            let checkbox =
                document.createElement("input");


            checkbox.type =
                "checkbox";


            checkbox.value =
                subject;


            // IMPORTANT:
            // The user does NOT manually complete
            // subjects anymore.
            //
            // Subjects become checked automatically
            // when ALL their topics are completed.

            checkbox.disabled = true;


            let text =
                document.createElement("span");


            text.textContent =
                subject;


            label.appendChild(
                checkbox
            );


            label.appendChild(
                text
            );


            subjectListElement.appendChild(
                label
            );

        }
    );

}


// ==========================================
// SCORE CALCULATION
// ==========================================
//
// 80 points = completed topics
// 20 points = actual study time
//
// ==========================================

function calculateStudyScore() {

    if (studyTopics.length === 0) {

        return 0;

    }


    // --------------------------------------
    // TOPIC COMPLETION
    // --------------------------------------

    let completedTopicScore =
        (
            studyProgress.completedTopics.length /
            studyTopics.length
        ) * 80;


    // --------------------------------------
    // STUDY TIME
    // --------------------------------------

    let totalStudiedSeconds = 0;


    for (
        let topicId in
        studyProgress.studiedSeconds
    ) {

        totalStudiedSeconds +=
            Number(
                studyProgress.studiedSeconds[
                    topicId
                ]
            ) || 0;

    }


    let timeScore =
        Math.min(
            20,
            (
                totalStudiedSeconds /
                totalRequiredSeconds
            ) * 20
        );


    return Math.min(
        100,
        Math.round(
            completedTopicScore +
            timeScore
        )
    );

}


// ==========================================
// UPDATE STUDY SCORE
// ==========================================

function updateStudyScore() {

    let score =
        calculateStudyScore();


    let scoreDisplay =
        document.getElementById(
            "scoreDisplay"
        );


    let scoreCard =
        document.getElementById(
            "studyScore"
        );


    if (scoreDisplay) {

        scoreDisplay.textContent =
            score;

    }


    if (scoreCard) {

        scoreCard.textContent =
            score;

    }


    let scoreBar =
        document.getElementById(
            "scoreProgressBar"
        );


    if (scoreBar) {

        scoreBar.style.width =
            score + "%";

    }


    let message =
        document.getElementById(
            "scoreMessage"
        );


    if (!message) {

        return;

    }


    if (score === 0) {

        message.textContent =
            "Start studying to build your score.";

    }

    else if (score < 25) {

        message.textContent =
            "🔥 Good start. Keep studying.";

    }

    else if (score < 50) {

        message.textContent =
            "💪 You're making progress. Keep going.";

    }

    else if (score < 75) {

        message.textContent =
            "⭐ Great progress. Keep completing your topics.";

    }

    else if (score < 100) {

        message.textContent =
            "🏆 Excellent work. You're almost there.";

    }

    else {

        message.textContent =
            "🎉 Amazing! You've completed your study plan.";

    }

}


// ==========================================
// DISPLAY CURRENT TOPIC
// ==========================================

function displayCurrentTopic() {

    let current =
        getCurrentTopic();


    let subjectElement =
        document.getElementById(
            "currentSubject"
        );


    let topicElement =
        document.getElementById(
            "currentTopic"
        );


    let timeElement =
        document.getElementById(
            "topicTime"
        );


    let checkbox =
        document.getElementById(
            "completeTopicCheckbox"
        );


    let button =
        document.getElementById(
            "startStudyButton"
        );


    // ======================================
    // ALL TOPICS COMPLETED
    // ======================================

    if (!current) {

        if (subjectElement) {

            subjectElement.textContent =
                "🎉 All Topics Completed";

        }


        if (topicElement) {

            topicElement.textContent =
                "Amazing work!";

        }


        if (timeElement) {

            timeElement.textContent =
                "You have completed your study plan.";

        }


        if (button) {

            button.disabled = true;

            button.textContent =
                "✓ All Topics Completed";

        }


        if (checkbox) {

            checkbox.checked = true;

            checkbox.disabled = true;

        }


        updateProgress();

        updateStudyScore();

        return;

    }


    // ======================================
    // SHOW CURRENT SUBJECT
    // ======================================

    if (subjectElement) {

        subjectElement.textContent =
            current.data.subject;

    }


    // ======================================
    // SHOW CURRENT TOPIC
    // ======================================

    if (topicElement) {

        topicElement.textContent =
            current.data.topic;

    }


    // ======================================
    // REQUIRED TIME
    // ======================================

    if (timeElement) {

        timeElement.textContent =
            "⏱️ Required time: " +
            totalDailyMinutes +
            " minutes";

    }


    // ======================================
    // RESET CHECKBOX
    // ======================================

    if (checkbox) {

        checkbox.checked = false;

        checkbox.disabled = false;

    }


    // ======================================
    // START BUTTON
    // ======================================

    if (button) {

        button.disabled = false;


        if (!timerRunning) {

            button.textContent =
                "▶ Start Studying";

        }

    }

}


// ==========================================
// TIMER
// ==========================================

let timerRunning = false;

let timerInterval = null;

let timerSeconds = 0;

let timerTopicId = null;


// ==========================================
// FORMAT TIMER
// ==========================================

function formatTimer(seconds) {

    let minutes =
        Math.floor(
            seconds / 60
        );


    let remainingSeconds =
        seconds % 60;


    return (

        String(minutes).padStart(2, "0") +

        ":" +

        String(
            remainingSeconds
        ).padStart(2, "0")

    );

}


// ==========================================
// UPDATE TIMER DISPLAY
// ==========================================

function updateTimerDisplay() {

    let timer =
        document.getElementById(
            "studyTimer"
        );


    if (timer) {

        timer.textContent =
            formatTimer(timerSeconds);

    }

}


// ==========================================
// START / PAUSE STUDYING
// ==========================================

let startStudyButton =
    document.getElementById(
        "startStudyButton"
    );


if (startStudyButton) {

    startStudyButton.addEventListener(
        "click",
        function() {

            let current =
                getCurrentTopic();


            if (!current) {

                return;

            }


            // --------------------------------
            // PAUSE
            // --------------------------------

            if (timerRunning) {

                clearInterval(
                    timerInterval
                );


                timerRunning =
                    false;


                startStudyButton.textContent =
                    "▶ Resume Studying";


                saveStudyProgress();

                return;

            }


            // --------------------------------
            // START
            // --------------------------------

            timerTopicId =
                current.id;


            timerRunning =
                true;


            startStudyButton.textContent =
                "⏸ Pause Studying";


            timerInterval =
                setInterval(
                    function() {

                        timerSeconds++;


                        if (
                            !studyProgress.studiedSeconds[
                                timerTopicId
                            ]
                        ) {

                            studyProgress.studiedSeconds[
                                timerTopicId
                            ] = 0;

                        }


                        studyProgress.studiedSeconds[
                            timerTopicId
                        ]++;


                        updateTimerDisplay();

                        updateStudyScore();

                        saveStudyProgress();

                    },
                    1000
                );

        }
    );

}


// ==========================================
// COMPLETE CURRENT TOPIC
// ==========================================

let completeTopicCheckbox =
    document.getElementById(
        "completeTopicCheckbox"
    );


if (completeTopicCheckbox) {

    completeTopicCheckbox.addEventListener(
        "change",
        function() {

            // Only react when checked

            if (
                !completeTopicCheckbox.checked
            ) {

                return;

            }


            // --------------------------------
            // GET CURRENT TOPIC
            // --------------------------------

            let current =
                getCurrentTopic();


            if (!current) {

                return;

            }


            let topicId =
                current.id;


            // --------------------------------
            // STOP TIMER
            // --------------------------------

            if (timerRunning) {

                clearInterval(
                    timerInterval
                );

                timerRunning =
                    false;

            }


            // --------------------------------
            // MARK TOPIC COMPLETE
            // --------------------------------

            if (
                !studyProgress.completedTopics.includes(
                    topicId
                )
            ) {

                studyProgress.completedTopics.push(
                    topicId
                );

            }


            // --------------------------------
            // MOVE TO NEXT TOPIC
            // --------------------------------

            studyProgress.currentTopicIndex++;


            // --------------------------------
            // SAVE
            // --------------------------------

            saveStudyProgress();


            // --------------------------------
            // UPDATE EVERYTHING
            // --------------------------------

            updateProgress();

            updateStudyScore();


            // --------------------------------
            // MESSAGE
            // --------------------------------

            let message =
                document.getElementById(
                    "completionMessage"
                );


            if (message) {

                message.textContent =
                    "✅ " +
                    current.data.topic +
                    " completed!";

            }


            // --------------------------------
            // RESET TIMER
            // --------------------------------

            timerSeconds = 0;

            timerTopicId = null;

            updateTimerDisplay();


            // --------------------------------
            // SHOW NEXT TOPIC
            // --------------------------------

            setTimeout(
                function() {

                    if (message) {

                        message.textContent =
                            "";

                    }


                    displayCurrentTopic();

                },
                1000
            );

        }
    );

}


// ==========================================
// STUDY STREAK
// ==========================================

function updateStudyStreak() {

    let todayString =
        new Date().toDateString();


    let previousStudyDate =
        localStorage.getItem(
            "lastStudyDate"
        );


    let currentStreak =
        Number(
            localStorage.getItem(
                "studyStreak"
            )
        ) || 0;


    if (
        previousStudyDate ===
        todayString
    ) {

        return;

    }


    if (previousStudyDate) {

        let previousDate =
            new Date(
                previousStudyDate
            );


        let todayDate =
            new Date();


        previousDate.setHours(
            0, 0, 0, 0
        );


        todayDate.setHours(
            0, 0, 0, 0
        );


        let difference =
            Math.floor(
                (
                    todayDate -
                    previousDate
                ) /
                (
                    1000 *
                    60 *
                    60 *
                    24
                )
            );


        if (difference === 1) {

            currentStreak++;

        }
        else {

            currentStreak = 1;

        }

    }
    else {

        currentStreak = 1;

    }


    localStorage.setItem(
        "studyStreak",
        currentStreak
    );


    localStorage.setItem(
        "lastStudyDate",
        todayString
    );


    let streakElement =
        document.getElementById(
            "streak"
        );


    if (streakElement) {

        streakElement.textContent =
            currentStreak +
            " Days";

    }

}


// ==========================================
// INITIALIZE DASHBOARD
// ==========================================

updateTimerDisplay();

displayCurrentTopic();

updateProgress();

updateStudyScore();


// ==========================================
// TODAY'S SCHEDULE
// ==========================================

function formatTime(hour) {

    hour =
        hour % 24;


    let period =
        hour >= 12
            ? "PM"
            : "AM";


    let displayHour =
        hour % 12;


    if (
        displayHour === 0
    ) {

        displayHour = 12;

    }


    return (
        displayHour +
        ":00 " +
        period
    );

}


let schedule =
    document.getElementById(
        "todaySchedule"
    );


if (schedule) {

    if (subjects.length === 0) {

        schedule.innerHTML =
            "<p>No subjects available.</p>";

    }

    else {

        let scheduleHTML =
            "";


        let savedStartTime =
            studyData.startTime ||
            "16:00";


        let startHour =
            Number(
                savedStartTime.split(":")[0]
            );


        for (
            let i = 0;
            i < hoursPerDay;
            i++
        ) {

            let start =
                startHour + i;


            let end =
                start + 1;


            let subject =
                subjects[
                    i % subjects.length
                ];


            scheduleHTML += `

                <div class="schedule-item">

                    <span class="schedule-time">

                        ${formatTime(start)}
                        -
                        ${formatTime(end)}

                    </span>

                    <span class="schedule-subject">

                        📚 ${subject}

                    </span>

                </div>

            `;

        }


        schedule.innerHTML =
            scheduleHTML;

    }

}


// ==========================================
// CALENDAR
// ==========================================

let calendarDate =
    new Date();


let calendarDays =
    document.getElementById(
        "calendarDays"
    );


let calendarMonth =
    document.getElementById(
        "calendarMonth"
    );


let previousMonth =
    document.getElementById(
        "previousMonth"
    );


let nextMonth =
    document.getElementById(
        "nextMonth"
    );


let examDate =
    studyData.examDate || "";


// ==========================================
// GENERATE CALENDAR
// ==========================================

function generateCalendar() {

    if (
        !calendarDays ||
        !calendarMonth
    ) {

        return;

    }


    calendarDays.innerHTML = "";


    let year =
        calendarDate.getFullYear();


    let month =
        calendarDate.getMonth();


    calendarMonth.textContent =
        calendarDate.toLocaleString(
            "default",
            {
                month: "long"
            }
        ) +
        " " +
        year;


    let firstDay =
        new Date(
            year,
            month,
            1
        ).getDay();


    let daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    for (
        let i = 0;
        i < firstDay;
        i++
    ) {

        let emptyDay =
            document.createElement(
                "div"
            );


        emptyDay.className =
            "emptyDay";


        calendarDays.appendChild(
            emptyDay
        );

    }


    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        let dayElement =
            document.createElement(
                "div"
            );


        dayElement.textContent =
            day;


        let cellDate =
            new Date(
                year,
                month,
                day
            );


        cellDate.setHours(
            0, 0, 0, 0
        );


        let today =
            new Date();


        today.setHours(
            0, 0, 0, 0
        );


        // TODAY

        if (
            cellDate.getTime() ===
            today.getTime()
        ) {

            dayElement.classList.add(
                "today"
            );

        }


        // EXAM DAY

        if (examDate) {

            let exam =
                new Date(examDate);


            exam.setHours(
                0, 0, 0, 0
            );


            if (
                cellDate.getTime() ===
                exam.getTime()
            ) {

                dayElement.classList.add(
                    "exam-day"
                );

                dayElement.title =
                    "Exam Day 📚";

            }


            // STUDY DAY

            if (
                cellDate >= today &&
                cellDate <= exam &&
                cellDate.getDay() !== 0
            ) {

                dayElement.classList.add(
                    "study-day"
                );

            }

        }


        // COMPLETED STUDY DAY

        let lastStudyDate =
            localStorage.getItem(
                "lastStudyDate"
            );


        if (
            lastStudyDate &&
            cellDate.toDateString() ===
            lastStudyDate
        ) {

            dayElement.classList.remove(
                "study-day"
            );


            dayElement.classList.add(
                "completed-day"
            );

        }


        calendarDays.appendChild(
            dayElement
        );

    }

}


// ==========================================
// CALENDAR NAVIGATION
// ==========================================

if (previousMonth) {

    previousMonth.addEventListener(
        "click",
        function() {

            calendarDate.setMonth(
                calendarDate.getMonth() - 1
            );

            generateCalendar();

        }
    );

}


if (nextMonth) {

    nextMonth.addEventListener(
        "click",
        function() {

            calendarDate.setMonth(
                calendarDate.getMonth() + 1
            );

            generateCalendar();

        }
    );

}


generateCalendar();


// ==========================================
// DARK / LIGHT MODE
// ==========================================

let themeButton =
    document.getElementById(
        "themeButton"
    );


if (themeButton) {

    if (
        localStorage.getItem(
            "theme"
        ) === "dark"
    ) {

        document.body.classList.add(
            "dark-mode"
        );


        themeButton.textContent =
            "☀️ Light Mode";

    }


    themeButton.addEventListener(
        "click",
        function() {

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