/* =========================================
   STUDYMIND AI — MAIN SCRIPT
   ========================================= */

/* ---------- ELEMENTS ---------- */

const startButton = document.getElementById("startButton");
const generateButton = document.getElementById("generateButton");
const clearButton = document.getElementById("clearButton");
const downloadButton = document.getElementById("downloadButton");

const studyPlan = document.getElementById("studyPlan");
const timetable = document.getElementById("timetable");

const themeToggle = document.getElementById("themeToggle");

const curriculumSelect = document.getElementById("curriculum");
const difficultySelect = document.getElementById("difficulty");
const studyTimeInput = document.getElementById("studyTime");
const examDateInput = document.getElementById("examDate");

const progressPercent = document.getElementById("progressPercent");
const progressValue = document.querySelector(".progressValue");

const navLinks = document.querySelectorAll(".nav-links a");
const subjectCheckboxes = document.querySelectorAll(
    'input[name="subject"]'
);


/* ---------- START BUTTON ---------- */

if (startButton) {
    startButton.addEventListener("click", () => {

        const plannerSection =
            document.getElementById("planner");

        if (plannerSection) {
            plannerSection.scrollIntoView({
                behavior: "smooth"
            });
        }
    });
}


/* ---------- NAVIGATION ---------- */

navLinks.forEach(link => {

    link.addEventListener("click", event => {

        const target = link.getAttribute("href");

        if (target && target.startsWith("#")) {

            const section =
                document.querySelector(target);

            if (section) {

                event.preventDefault();

                section.scrollIntoView({
                    behavior: "smooth"
                });
            }
        }
    });
});


/* ---------- SUBJECT SELECTION ---------- */

subjectCheckboxes.forEach(checkbox => {

    checkbox.addEventListener("change", () => {

        updateSubjectCounter();

    });

});


function getSelectedSubjects() {

    const selected = [];

    subjectCheckboxes.forEach(checkbox => {

        if (checkbox.checked) {
            selected.push(checkbox.value);
        }

    });

    return selected;
}


function updateSubjectCounter() {

    const selectedSubjects =
        getSelectedSubjects();

    const counter =
        document.getElementById("subjectCounter");

    if (counter) {

        counter.textContent =
            `${selectedSubjects.length} subject${
                selectedSubjects.length === 1 ? "" : "s"
            } selected`;

    }
}


/* ---------- GENERATE STUDY PLAN ---------- */

if (generateButton) {

    generateButton.addEventListener("click", () => {

        generateStudyPlan();

    });

}


function generateStudyPlan() {

    const subjects =
        getSelectedSubjects();

    const curriculum =
        curriculumSelect
            ? curriculumSelect.value
            : "School Based Tests";

    const difficulty =
        difficultySelect
            ? difficultySelect.value
            : "Medium";

    const studyTime =
        studyTimeInput
            ? Number(studyTimeInput.value)
            : 2;

    const examDate =
        examDateInput
            ? examDateInput.value
            : "";


    /* ---------- VALIDATION ---------- */

    if (subjects.length === 0) {

        alert(
            "Please select at least one subject before generating your study plan."
        );

        return;
    }


    if (!studyTime || studyTime <= 0) {

        alert(
            "Please enter a valid amount of study time."
        );

        return;
    }


    /* ---------- CALCULATE DAILY TIME ---------- */

    let dailyRecommendation;

    if (subjects.length === 1) {

        dailyRecommendation =
            Math.min(studyTime, 2);

    } else if (subjects.length <= 3) {

        dailyRecommendation =
            Math.min(studyTime, 3);

    } else if (subjects.length <= 6) {

        dailyRecommendation =
            Math.min(studyTime, 4);

    } else {

        dailyRecommendation =
            Math.min(studyTime, 6);

    }


    /* ---------- EXAM COUNTDOWN ---------- */

    let countdownText =
        "No exam date selected.";

    if (examDate) {

        const today =
            new Date();

        const exam =
            new Date(examDate);

        const difference =
            exam - today;

        const days =
            Math.ceil(
                difference /
                (1000 * 60 * 60 * 24)
            );

        if (days > 0) {

            countdownText =
                `${days} day${days === 1 ? "" : "s"} remaining until your exam.`;

        } else if (days === 0) {

            countdownText =
                "Your exam is today.";

        } else {

            countdownText =
                "The selected exam date has passed.";

        }
    }


    /* ---------- CREATE PLAN ---------- */

    const plan = createStudyPlan(
        subjects,
        difficulty,
        curriculum
    );


    /* ---------- DISPLAY ---------- */

    if (studyPlan) {

        studyPlan.innerHTML = `

            <div class="plan-header">

                <div>
                    <span class="plan-label">
                        YOUR PERSONALIZED PLAN
                    </span>

                    <h2>
                        ${subjects.length}-Subject Study Plan
                    </h2>
                </div>

                <div class="plan-status">
                    Ready
                </div>

            </div>


            <div class="plan-summary">

                <div class="summary-item">
                    <span>Curriculum</span>
                    <strong>${curriculum}</strong>
                </div>

                <div class="summary-item">
                    <span>Difficulty</span>
                    <strong>${difficulty}</strong>
                </div>

                <div class="summary-item">
                    <span>Daily Study Time</span>
                    <strong>${dailyRecommendation} hr</strong>
                </div>

                <div class="summary-item">
                    <span>Subjects</span>
                    <strong>${subjects.length}</strong>
                </div>

            </div>


            <div class="exam-countdown">

                <span>📅</span>

                <p>
                    ${countdownText}
                </p>

            </div>


            <div class="plan-subjects">

                <h3>
                    Subject Breakdown
                </h3>

                ${plan}

            </div>


            <div class="plan-tips">

                <h3>
                    Study Strategy
                </h3>

                <ul>

                    <li>
                        Start with your weakest subject while your concentration is highest.
                    </li>

                    <li>
                        Use active recall instead of simply rereading notes.
                    </li>

                    <li>
                        Practice questions should become more difficult as you improve.
                    </li>

                    <li>
                        Take short breaks between focused study sessions.
                    </li>

                    <li>
                        Review previously studied topics regularly.
                    </li>

                </ul>

            </div>

        `;

        studyPlan.style.display = "block";

    }


    /* ---------- GENERATE TIMETABLE ---------- */

    generateTimetable(subjects);


    /* ---------- SAVE DATA ---------- */

    saveStudyData({
        subjects,
        curriculum,
        difficulty,
        studyTime,
        examDate
    });


    /* ---------- SCROLL TO RESULT ---------- */

    if (studyPlan) {

        setTimeout(() => {

            studyPlan.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }, 200);

    }

}


/* ---------- CREATE STUDY PLAN ---------- */

function createStudyPlan(
    subjects,
    difficulty,
    curriculum
) {

    const difficultyText = {

        Easy:
            "Focus on understanding the fundamentals and building confidence.",

        Medium:
            "Balance understanding, revision and practice questions.",

        Hard:
            "Prioritize challenging topics, timed practice and exam-style questions."

    };


    return subjects.map((subject, index) => {

        const percentage =
            Math.max(
                20,
                100 - (index * 8)
            );


        return `

            <div class="subject-plan-card">

                <div class="subject-plan-top">

                    <div>

                        <span class="subject-number">
                            ${index + 1}
                        </span>

                        <h4>
                            ${subject}
                        </h4>

                    </div>

                    <span class="subject-priority">
                        ${index < 2 ? "High Priority" : "Priority"}
                    </span>

                </div>


                <div class="subject-progress">

                    <div class="subject-progress-bar">

                        <span
                            style="width: ${percentage}%"
                        ></span>

                    </div>

                </div>


                <p>
                    ${difficultyText[difficulty] ||
                    difficultyText.Medium}
                </p>


                <div class="study-actions">

                    <span>
                        📖 Review notes
                    </span>

                    <span>
                        🧠 Active recall
                    </span>

                    <span>
                        ✏️ Practice questions
                    </span>

                </div>

            </div>

        `;

    }).join("");

}


/* ---------- TIMETABLE ---------- */

function generateTimetable(subjects) {

    if (!timetable) {
        return;
    }


    const days = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
    ];


    const sessions = [];


    days.forEach((day, dayIndex) => {

        const subject =
            subjects[
                dayIndex %
                subjects.length
            ];


        const secondSubject =
            subjects[
                (dayIndex + 1) %
                subjects.length
            ];


        sessions.push({

            day,

            morning:
                subject,

            afternoon:
                secondSubject,

            evening:
                subjects[
                    (dayIndex + 2) %
                    subjects.length
                ]

        });

    });


    timetable.innerHTML = `

        <div class="table-wrapper">

            <table>

                <thead>

                    <tr>

                        <th>
                            Day
                        </th>

                        <th>
                            Morning
                        </th>

                        <th>
                            Afternoon
                        </th>

                        <th>
                            Evening
                        </th>

                    </tr>

                </thead>

                <tbody>

                    ${sessions.map(session => `

                        <tr>

                            <td>
                                <strong>
                                    ${session.day}
                                </strong>
                            </td>

                            <td>
                                ${session.morning}
                            </td>

                            <td>
                                ${session.afternoon}
                            </td>

                            <td>
                                ${session.evening}
                            </td>

                        </tr>

                    `).join("")}

                </tbody>

            </table>

        </div>

    `;


    timetable.style.display = "block";

}


/* ---------- CLEAR BUTTON ---------- */

if (clearButton) {

    clearButton.addEventListener("click", () => {

        subjectCheckboxes.forEach(
            checkbox => {
                checkbox.checked = false;
            }
        );


        if (studyPlan) {
            studyPlan.innerHTML = "";
            studyPlan.style.display = "none";
        }


        if (timetable) {
            timetable.innerHTML = "";
            timetable.style.display = "none";
        }


        updateSubjectCounter();


        localStorage.removeItem(
            "studyMindData"
        );

    });

}


/* ---------- DOWNLOAD STUDY PLAN ---------- */

if (downloadButton) {

    downloadButton.addEventListener("click", () => {

        downloadStudyPlan();

    });

}


function downloadStudyPlan() {

    if (!studyPlan || !studyPlan.innerText.trim()) {

        alert(
            "Generate a study plan first."
        );

        return;

    }


    const content =

`STUDYMIND AI
PERSONALIZED STUDY PLAN
=======================

${studyPlan.innerText}

=======================

Generated by StudyMind AI
`;


    const blob =
        new Blob(
            [content],
            {
                type: "text/plain"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href = url;

    link.download =
        "StudyMind-AI-Study-Plan.txt";


    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

}


/* ---------- THEME TOGGLE ---------- */

if (themeToggle) {

    themeToggle.addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "light-mode"
            );


            const isLight =
                document.body.classList.contains(
                    "light-mode"
                );


            localStorage.setItem(
                "studyMindTheme",
                isLight
                    ? "light"
                    : "dark"
            );


            updateThemeIcon();

        }
    );

}


function updateThemeIcon() {

    if (!themeToggle) {
        return;
    }


    const isLight =
        document.body.classList.contains(
            "light-mode"
        );


    themeToggle.textContent =
        isLight
            ? "☀️"
            : "🌙";

}


/* ---------- LOAD THEME ---------- */

const savedTheme =
    localStorage.getItem(
        "studyMindTheme"
    );


if (savedTheme === "light") {

    document.body.classList.add(
        "light-mode"
    );

}


updateThemeIcon();


/* ---------- SAVE STUDY DATA ---------- */

function saveStudyData(data) {

    localStorage.setItem(
        "studyMindData",
        JSON.stringify(data)
    );

}


/* ---------- LOAD SAVED DATA ---------- */

function loadStudyData() {

    const saved =
        localStorage.getItem(
            "studyMindData"
        );


    if (!saved) {
        return;
    }


    try {

        const data =
            JSON.parse(saved);


        if (data.curriculum &&
            curriculumSelect) {

            curriculumSelect.value =
                data.curriculum;

        }


        if (data.difficulty &&
            difficultySelect) {

            difficultySelect.value =
                data.difficulty;

        }


        if (data.studyTime &&
            studyTimeInput) {

            studyTimeInput.value =
                data.studyTime;

        }


        if (data.examDate &&
            examDateInput) {

            examDateInput.value =
                data.examDate;

        }


        if (Array.isArray(data.subjects)) {

            subjectCheckboxes.forEach(
                checkbox => {

                    checkbox.checked =
                        data.subjects.includes(
                            checkbox.value
                        );

                }
            );

        }


        updateSubjectCounter();


    } catch (error) {

        console.error(
            "Could not load saved StudyMind data:",
            error
        );

    }

}


loadStudyData();


/* ---------- DASHBOARD LINK ---------- */

const dashboardButton =
    document.getElementById(
        "dashboardButton"
    );


if (dashboardButton) {

    dashboardButton.addEventListener(
        "click",
        () => {

            window.location.href =
                "dashboard.html";

        }
    );

}


/* ---------- ASK AI BUTTON ---------- */

const askAIButton =
    document.getElementById(
        "askAIButton"
    );


if (askAIButton) {

    askAIButton.addEventListener(
        "click",
        () => {

            window.location.href =
                "ask-ai.html";

        }
    );

}


/* ---------- ANIMATION ON SCROLL ---------- */

const animatedElements =
    document.querySelectorAll(
        ".feature-card, .step-card, .subject-plan-card"
    );


if ("IntersectionObserver" in window) {

    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "visible"
                        );

                    }

                });

            },
            {
                threshold: 0.1
            }
        );


    animatedElements.forEach(element => {

        observer.observe(element);

    });

}


/* ---------- CURRENT YEAR ---------- */

const yearElement =
    document.getElementById(
        "currentYear"
    );


if (yearElement) {

    yearElement.textContent =
        new Date().getFullYear();

}


/* ---------- INITIALIZE ---------- */

updateSubjectCounter();

console.log(
    "StudyMind AI initialized successfully."
);
