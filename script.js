// ==========================================
// WELCOME PAGE
// ==========================================

const welcomePage = document.getElementById("welcomePage");
const welcomeButton = document.querySelector(".welcome-button");

welcomeButton.addEventListener("click", function () {
    welcomePage.classList.add("welcome-hidden");
});


// ==========================================
// EXISTING CODE
// ==========================================
let startButton =
document.getElementById("startButton");
let cta =
document.getElementById("cta");

startButton.addEventListener("click", function () {
    cta.scrollIntoView({
        behavior: "smooth"
    });
});
function formatTime(hour) {
hour = hour % 24;
let period = hour >= 12 ? "PM" :
"AM";
let displayHour = hour % 12;
if (displayHour === 0) {
displayHour = 12;
}
return `${displayHour}:00 ${period}
`;
}

let generateButton =
document.getElementById("generateButton");
// ==========================================
// GENERATE TOPIC DIFFICULTY
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const generateDifficultyButton =
        document.getElementById("generateDifficultyButton");

    const difficultySection =
        document.getElementById("difficultySection");

    const topicsInput =
        document.getElementById("topics");


    // --------------------------------------------------
    // GENERATE DIFFICULTY SETTINGS
    // --------------------------------------------------

    if (generateDifficultyButton) {

        generateDifficultyButton.addEventListener("click", function () {

            const topics = topicsInput.value.trim();

            // Make sure something was entered
            if (topics === "") {
                difficultySection.innerHTML =
                    "<p>Please enter your subjects and topics first.</p>";
                return;
            }


            // --------------------------------------------------
            // TOPIC PARSING
            // --------------------------------------------------

            let topicData = {};

            let topicLines = topics
                .split(/\r?\n/)
                .map(line => line.trim())
                .filter(line => line !== "");


            topicLines.forEach(function (line) {

                // Split subject from topics
                const parts = line.split(":");

                // Ignore lines without :
                if (parts.length < 2) {
                    return;
                }


                // Subject name
                const subjectName = parts[0]
                    .trim()
                    .toLowerCase();


                // Topics belonging to that subject
                const subjectTopics = parts
                    .slice(1)
                    .join(":")
                    .split(",")
                    .map(topic => topic.trim())
                    .filter(topic => topic !== "");


                // Save the topics
                topicData[subjectName] = subjectTopics;

            });


            // --------------------------------------------------
            // CLEAR OLD DIFFICULTY SETTINGS
            // --------------------------------------------------

            difficultySection.innerHTML = "";


            // --------------------------------------------------
            // CREATE DIFFICULTY SETTINGS FOR EACH SUBJECT
            // --------------------------------------------------

            Object.keys(topicData).forEach(function (subject) {

                // Subject heading
                const subjectHeading =
                    document.createElement("h2");

                subjectHeading.textContent = subject;

                difficultySection.appendChild(subjectHeading);


                // Topics for this subject
                topicData[subject].forEach(function (topic) {

                    // Container
                    const topicContainer =
                        document.createElement("div");

                    topicContainer.className =
                        "difficulty-topic";


                    // Topic name
                    const topicName =
                        document.createElement("div");

                    topicName.className =
                        "topic-name";

                    topicName.textContent = topic;


                    // Difficulty selector
                    const select =
                        document.createElement("select");
select.dataset.subject = subject;
select.dataset.topic = topic;

                    select.className =
                        "difficulty-select";


                    // Weak
                    const weakOption =
                        document.createElement("option");

                    weakOption.value = "weak";
                    weakOption.textContent = "🔴 Weak";


                    // Medium
                    const mediumOption =
                        document.createElement("option");

                    mediumOption.value = "medium";
                    mediumOption.textContent = "🟡 Medium";


                    // Strong
                    const strongOption =
                        document.createElement("option");

                    strongOption.value = "strong";
                    strongOption.textContent = "🟢 Strong";


                    // Add options
                    select.appendChild(weakOption);
                    select.appendChild(mediumOption);
                    select.appendChild(strongOption);


                    // Default difficulty
                    select.value = "medium";


                    // Add everything to the topic container
                    topicContainer.appendChild(topicName);
                    topicContainer.appendChild(select);


                    // Add topic to the page
                    difficultySection.appendChild(topicContainer);

                });

            });


            // --------------------------------------------------
            // SHOW DIFFICULTY SECTION
            // --------------------------------------------------

            difficultySection.style.display = "block";


            // --------------------------------------------------
            // SAVE DIFFICULTIES
            // --------------------------------------------------

            window.topicDifficulty = {};


            const difficultySelectors =
                difficultySection.querySelectorAll(
                    ".difficulty-select"
                );


            difficultySelectors.forEach(function (select, index) {

                select.addEventListener("change", function () {

                    updateDifficultyData();

                });

            });


            // Save initial values
            updateDifficultyData();


            // --------------------------------------------------
            // FUNCTION TO SAVE DIFFICULTIES
            // --------------------------------------------------

            function updateDifficultyData() {

                window.topicDifficulty = {};

                Object.keys(topicData).forEach(function (subject) {

                    window.topicDifficulty[subject] = {};

                    topicData[subject].forEach(function (topic) {

                        window.topicDifficulty[subject][topic] =
                            "weak";

                    });

                });


                // Go through every displayed selector
                const subjects =
                    Object.keys(topicData);

                let selectorIndex = 0;


                subjects.forEach(function (subject) {

                    topicData[subject].forEach(function (topic) {

                        const selector =
                            difficultySelectors[selectorIndex];


                        if (selector) {

                            window.topicDifficulty[subject][topic] =
                                selector.value;

                        }


                        selectorIndex++;

                    });

                });

            }

        });

    }

});


generateButton.addEventListener("click", function () {

    let curriculum =
    document.getElementById("curriculum").value;

    let subjects =
    document.getElementById("subjects").value;
let topics =
document.getElementById("topics").value;

    let examDate =
    document.getElementById("examDate").value;
let hoursPerDay = Number(
document.getElementById("hoursPerDay").value
);
let startTime =
document.getElementById("startTime").value;
if (startTime === "") {
alert("Please choose a study start time.");
return;
}
let startHour = 
Number(startTime.split(":")[0]);
if (hoursPerDay <=0 || isNaN(hoursPerDay)) {
alert("Please enter the number of hours you can study each day.");
return;
}


    if (examDate === "") {
        alert("Please select your exam date.");
        return;
    }

    if (subjects.trim() === "") {
        alert("Please enter at least one subject.");
        return;
    }

    let today = new Date();
    let exam = new Date(examDate);
today.setHours(0, 0, 0, 0);
exam.setHours(0, 0, 0, 0);
if (exam < today) {
alert("The exam date has already passed. Please choose a future date.");
return;
}
let timeDifference = exam - today;

    let daysLeft = Math.ceil(
        timeDifference / (1000 * 60 * 60 * 24)
);

    let urgency = "";

    if (daysLeft > 90) {
        urgency = "🟢 You have plenty of time. Focus on learning new concepts.";
    }
    else if (daysLeft > 30) {
        urgency = "🟡 Your exam is getting closer. Start practicing past questions regularly.";
    }
    else if (daysLeft > 7) {
        urgency = "🟠 Your exam is close. Increase your revision and practice every day.";
    }
    else {
        urgency = "🔴❗ Your exam is just around the corner! Focus only on revision and mock tests.";
    }

  
let subjectList = subjects
    .split(/[.,;]/)
    .map(subject => subject.trim().toLowerCase())
    .filter(subject => subject !== "");
console.log("SUBJECTS:", subjectList);
console.log("DIFFICULTY SELECTORS:",
    document.querySelectorAll(".difficulty-select").length
);

let topicData = {};

let topicLines = topics
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line !== "");

topicLines.forEach(function(line) {

    let parts = line.split(":");

    if (parts.length >= 2) {

        let subjectName =
            parts[0].trim().toLowerCase();

        let subjectTopics =
            parts
                .slice(1)
                .join(":")
                .split(",")
                .map(topic => topic.trim())
                .filter(topic => topic !== "");

        topicData[subjectName] =
            subjectTopics;
    }

});


if (subjectList.length === 0) {
alert("Please enter at least one valid subject.");
return;
}






let currentDay = new Date().getDay();

let dayNames = [
"Sunday",
"Monday",
"Tuesday",
"Wednesday",
"Thursday",
"Friday",
"Saturday"
];

let todayName = dayNames[currentDay];

let todaySubject = subjectList[
currentDay % subjectList.length
];
let numberOfSubjects =
subjectList.length;


// ==========================================
// SAVE TOPIC DIFFICULTIES
// ==========================================

let topicDifficulty = {};
let topicPriority = {};

let difficultySelectors =
    document.querySelectorAll(".difficulty-select");

difficultySelectors.forEach(function(select) {

    let subject = select.dataset.subject;
    let topic = select.dataset.topic;

    if (!topicDifficulty[subject]) {
        topicDifficulty[subject] = {};
        topicPriority[subject] = {};
    }

    topicDifficulty[subject][topic] =
        select.value;

    if (select.value === "weak") {
        topicPriority[subject][topic] = 3;
    }
    else if (select.value === "medium") {
        topicPriority[subject][topic] = 2;
    }
    else {
        topicPriority[subject][topic] = 1;
    }

});
// ==========================================
// CREATE SUBJECT PRIORITY LIST
// ==========================================

let priorityList = [];

subjectList.forEach(function(subject) {

    let score = 1;

    if (topicPriority[subject]) {

        for (let topic in topicPriority[subject]) {

            score += topicPriority[subject][topic];

        }

    }

    for (let i = 0; i < score; i++) {

        priorityList.push(subject);

    }

});

if (priorityList.length === 0) {

    priorityList = [...subjectList];

}


let timetableData = [];

 let timetable = `<table>`;


if (daysLeft > 30) {

    for (let h = 0; h < hoursPerDay; h++) {

        let start = startHour + h;
        let end = start + 1;

        let displayStart = formatTime(start);
        let displayEnd = formatTime(end);

        let row = [];

        row.push(`${displayStart} - ${displayEnd}`);

        timetable += `<tr>`;

        timetableData.push(row);

        timetable += `<td>${displayStart} - ${displayEnd}</td>`;

        for (let d = 0; d < 7; d++) {



let subject =
priorityList[
(d + h) % priorityList.length
];

            row.push(subject);

            timetable += `<td>${subject}</td>`;
        }

        timetable += `</tr>`;
    }

}


else {

    let activities = [
        "Past Questions",
        "Weak Topics",
        "Timed Practice",
        "Mistake Review"
    ];

    for (let h = 0; h < hoursPerDay; h++) {

        let start = startHour + h;
        let end = start + 1;

        let displayStart = formatTime(start);
        let displayEnd = formatTime(end);

        let row = [];

        row.push(`${displayStart} - ${displayEnd}`);

        timetable += `<tr>`;

        timetableData.push(row);

        timetable += `<td>${displayStart} - ${displayEnd}</td>`;

        for (let d = 0; d < 7; d++) {

            let activity =
                activities[(d + h) % activities.length];

            row.push(activity);

            timetable += `<td>${activity}</td>`;
        }

        timetable += `</tr>`;
    }
}

timetable += `</table>`;

    let advice = "";
let todayTask = "";
if (daysLeft > 30) {
todayTask = `Study ${todaySubject} and take notes on difficult concepts.`;
}
else if (daysLeft > 7) {
todayTask = `Revise ${todaySubject} and solve at least 20 past questions.`;
}
else {

todayTask = `Revise ${todaySubject}, complete a timed mock test, and review your mistakes.`;

}
    if (curriculum === "WAEC") {
        advice = " Practice WAEC past questions at least three times every week.";
    }
    else if (curriculum === "JAMB") {
        advice = " Practice CBT questions daily to improve your speed and accuracy.";
    }
    else if (curriculum === "NECO") {
        advice = " Combine your class notes with NECO past questions.";
    }
    else if (curriculum === "IGCSE") {
        advice = " Focus on understanding concepts and solving structured questions.";
    }
    else if (curriculum === "SAT") {
        advice = " Spend time on timed reading and math practice tests.";
    }
    let plan =
    document.getElementById("studyPlan");



// Study Streak
let streak = Number(localStorage.getItem("studyStreak")) || 0;
let lastVisit = localStorage.getItem("lastStudyDate");

let todayDate = new Date().toDateString();

if (lastVisit !== todayDate) {
    streak++;
    localStorage.setItem("studyStreak", streak);
    localStorage.setItem("lastStudyDate", todayDate);
}
let recommendations = "";

subjectList.forEach(function(subject){

    let tip = "Revise this subject carefully.";

    switch(subject.toLowerCase()){

        case "mathematics":
            tip = "Practice calculations and solve at least 20 questions.";
            break;

        case "english":
            tip = "Read a comprehension passage and learn five new vocabulary words.";
            break;

        case "physics":
            tip = "Revise formulas and solve numerical problems.";
            break;

        case "chemistry":
            tip = "Study chemical equations and balancing reactions.";
            break;

        case "biology":
            tip = "Study diagrams and important definitions.";
            break;

        case "economics":
            tip = "Review graphs and important economic concepts.";
            break;

        case "government":
            tip = "Read the constitution and revise key political ideas.";
            break;

        default:
            tip = "Spend at least 45 minutes revising this subject.";
    }

    recommendations += `
    <div class="recommendation-card">
        <h4>📚 ${subject}</h4>
        <p>${tip}</p>
    </div>
    `;

});


// ==========================================
// PRIORITY-BASED DAILY SCHEDULE
// ==========================================

let dailySchedule = "";

let subjectPriority = {};


// ==========================================
// FIND WEAKEST LEVEL FOR EACH SUBJECT
// ==========================================

subjectList.forEach(function(subject) {

    let normalizedSubject =
        subject.trim().toLowerCase();

    let difficulties =
        topicPriority[normalizedSubject];

    // Default = Medium
    let weakestLevel = 2;

    if (difficulties) {

        let topicValues =
            Object.values(difficulties);

        if (topicValues.length > 0) {

            // Weak = 3
            // Medium = 2
            // Strong = 1
            //
            // Math.max finds the weakest topic

            weakestLevel =
                Math.max(...topicValues);

        }

    }

    subjectPriority[subject] =
        weakestLevel;

});


// ==========================================
// DEBUG
// ==========================================

console.log(
    "SUBJECT PRIORITIES:",
    subjectPriority
);


// ==========================================
// CREATE SCHEDULE
// ==========================================

let usedSubjects = {};

subjectList.forEach(function(subject) {

    usedSubjects[subject] = 0;

});


for (
    let index = 0;
    index < hoursPerDay;
    index++
) {

    let bestSubject = null;
    let bestPriority = -Infinity;


    subjectList.forEach(function(subject) {

        let priority =
            subjectPriority[subject] || 2;


        // Reduce priority after a subject
        // has already received study time.

        let adjustedPriority =
            priority -
            (usedSubjects[subject] * 1.5);


        if (
            bestSubject === null ||
            adjustedPriority > bestPriority
        ) {

            bestPriority =
                adjustedPriority;

            bestSubject =
                subject;

        }

    });


    usedSubjects[bestSubject]++;


    let start =
        startHour + index;

    let end =
        start + 1;


    dailySchedule += `
        <div class="schedule-card">

            <h4>
                ${formatTime(start)} -
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


console.log(
    "FINAL SCHEDULE:",
    usedSubjects
);

let studyScore = 100;

if (numberOfSubjects >= 7 && hoursPerDay < 3){
    studyScore -= 25;
}

if (daysLeft <= 14){
    studyScore -= 15;
}

if (hoursPerDay >= 5){
    studyScore += 10;
}

if (daysLeft > 90){
    studyScore += 5;
}


studyScore = Math.max(0, Math.min(100, studyScore));



let studyData = {
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

<p><strong>Curriculum:</strong> ${curriculum}</p>

<p>
<strong>Subjects:</strong>
${subjectList.join(", ")}
</p>

<p>${advice}</p>

<p>${urgency}</p>

<h3>📌 Today's Mission</h3>

<p>
Today is <strong>${todayName}</strong>.

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

${subjectList.map(subject => `
    <label class="progress-item">
        <input
            type="checkbox"
            class="subjectCheck"
            value="${subject}"
        >
        ${subject}
    </label>
    <br>
`).join("")}

</div>

<h3>📈 Progress</h3>

<div class="progressBarContainer">
    <div id="progressBar"></div>
</div>

<p>
    <span id="progressPercent">0%</span>
    completed
</p>

<p id="progressCount">
    0 of ${numberOfSubjects} subjects completed
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
        <p>${numberOfSubjects}</p>
    </div>

    <div class="stat-box">
        <h4>⏰ Weekly Hours</h4>
        <p>${hoursPerDay * 7}</p>
    </div>

    <div class="stat-box">
        <h4>📅 Days Left</h4>
        <p>${daysLeft}</p>
    </div>

    <div class="stat-box">
        <h4>🔥 Daily Goal</h4>
        <p>${hoursPerDay} hrs</p>
    </div>

</div>

<h3>💡 Subject Recommendations</h3>

<div class="recommendations">
    ${recommendations}
</div>
`;


// ==========================================
// SAVE STUDY PLAN
// ==========================================
// Make sure every checkbox starts unchecked
let newChecks = plan.querySelectorAll(".subjectCheck");

newChecks.forEach(function(check) {
    check.checked = false;
});

localStorage.setItem(
    "studyPlan",
    plan.innerHTML
);

localStorage.setItem(
    "studyData",
    JSON.stringify(studyData)
);


// ==========================================
// PROGRESS TRACKER
// ==========================================

let checks = document.querySelectorAll(".subjectCheck");

function updateProgress() {

    let completed = 0;

    checks.forEach(function(check) {

        if (check.checked) {
            completed++;
        }

    });

    let percent = checks.length > 0
        ? Math.round((completed / checks.length) * 100)
        : 0;

    let progressPercent =
        document.getElementById("progressPercent");

    let progressBar =
        document.getElementById("progressBar");

    let progressCount =
        document.getElementById("progressCount");


    if (progressPercent) {
        progressPercent.textContent = percent + "%";
    }

    if (progressBar) {
        progressBar.style.width = percent + "%";
    }

    if (progressCount) {
        progressCount.textContent =
            completed +
            " of " +
            checks.length +
            " subjects completed";
    }
}


// Connect the checkboxes to the progress tracker

checks.forEach(function(check) {

    check.addEventListener("change", function() {

        updateProgress();

    });

});


// ==========================================
// RESET PROGRESS FOR NEW STUDY PLAN
// ==========================================

// Reset subject progress
localStorage.setItem(
    "completedSubjects",
    JSON.stringify([])
);

// Reset topic progress
localStorage.setItem(
    "studyProgress",
    JSON.stringify({
        completedTopics: [],
        studiedSeconds: {},
        currentTopicIndex: 0
    })
);

// Reset all new-plan checkboxes
checks.forEach(function(check) {
    check.checked = false;
});

// Update progress display
updateProgress();


// ==========================================
// GO TO DASHBOARD
// ==========================================

window.location.href = "dashboard.html";

});
// ==========================================
// DARK MODE
// ==========================================

const themeButton = document.getElementById("themeButton");

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");

    if (themeButton) {
        themeButton.textContent = "☀️ Light Mode";
    }
}

// Toggle theme
if (themeButton) {

    themeButton.addEventListener("click", function () {

        document.body.classList.toggle("dark-mode");

        if (document.body.classList.contains("dark-mode")) {

            localStorage.setItem("theme", "dark");
            themeButton.textContent = "☀️ Light Mode";

        } else {

            localStorage.setItem("theme", "light");
            themeButton.textContent = "🌙 Dark Mode";

        }

    });

}