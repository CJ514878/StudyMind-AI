/* =========================================================
   STUDYMIND AI — DASHBOARD.JS
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       1. LOAD DATA
       ========================================================= */

    const savedStudyData = JSON.parse(
        localStorage.getItem("studyMindData") || "null"
    );

    const savedProgress = JSON.parse(
        localStorage.getItem("studyMindProgress") || "null"
    );

    const defaultData = {
        subjects: [],
        curriculum: "School Based Tests",
        difficulty: "Medium",
        studyTime: 2,
        examDate: "",
        studyPlan: [],
        timetable: []
    };

    const studyData = savedStudyData || defaultData;

    const progressData = savedProgress || {
        overall: 0,
        subjects: {},
        completedSessions: 0,
        totalSessions: 0,
        streak: 0,
        lastStudyDate: null
    };


    /* =========================================================
       2. ELEMENTS
       ========================================================= */

    const overallProgress = document.getElementById("overallProgress");
    const progressPercent = document.getElementById("progressPercent");

    const completedSessions = document.getElementById("completedSessions");
    const totalSessions = document.getElementById("totalSessions");

    const streakValue = document.getElementById("streakValue");
    const subjectsCount = document.getElementById("subjectsCount");

    const subjectsContainer =
        document.getElementById("subjectsContainer") ||
        document.getElementById("subjectProgress");

    const studyPlanContainer =
        document.getElementById("studyPlanContainer") ||
        document.getElementById("studyPlan");

    const timetableContainer =
        document.getElementById("timetableContainer") ||
        document.getElementById("timetable");

    const calendarContainer =
        document.getElementById("calendar");

    const badgesContainer =
        document.getElementById("badgesContainer") ||
        document.getElementById("badges");

    const dashboardDate =
        document.getElementById("dashboardDate") ||
        document.getElementById("currentDate");


    /* =========================================================
       3. DATE
       ========================================================= */

    function displayCurrentDate() {

        if (!dashboardDate) return;

        const today = new Date();

        dashboardDate.textContent = today.toLocaleDateString(
            "en-US",
            {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric"
            }
        );
    }

    displayCurrentDate();


    /* =========================================================
       4. OVERALL PROGRESS
       ========================================================= */

    function updateOverallProgress() {

        let progress = Number(progressData.overall) || 0;

        progress = Math.max(0, Math.min(100, progress));

        if (progressPercent) {
            progressPercent.textContent = `${progress}%`;
        }

        if (overallProgress) {

            // SVG circle support
            const radius = overallProgress.r?.baseVal?.value || 60;
            const circumference = 2 * Math.PI * radius;

            overallProgress.style.strokeDasharray = circumference;
            overallProgress.style.strokeDashoffset =
                circumference - (progress / 100) * circumference;
        }
    }

    updateOverallProgress();


    /* =========================================================
       5. STATISTICS
       ========================================================= */

    function updateStatistics() {

        if (completedSessions) {
            completedSessions.textContent =
                progressData.completedSessions || 0;
        }

        if (totalSessions) {
            totalSessions.textContent =
                progressData.totalSessions || 0;
        }

        if (streakValue) {
            streakValue.textContent =
                progressData.streak || 0;
        }

        if (subjectsCount) {
            subjectsCount.textContent =
                studyData.subjects?.length || 0;
        }
    }

    updateStatistics();


    /* =========================================================
       6. SUBJECT PROGRESS
       ========================================================= */

    function renderSubjectProgress() {

        if (!subjectsContainer) return;

        subjectsContainer.innerHTML = "";

        const subjects = studyData.subjects || [];

        if (subjects.length === 0) {

            subjectsContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📚</div>
                    <h3>No subjects yet</h3>
                    <p>Generate a study plan to start tracking your subjects.</p>
                </div>
            `;

            return;
        }

        subjects.forEach((subject, index) => {

            const subjectName =
                typeof subject === "string"
                    ? subject.trim()
                    : subject.name || `Subject ${index + 1}`;

            const progress =
                Number(progressData.subjects?.[subjectName]) || 0;

            const subjectCard = document.createElement("div");

            subjectCard.className = "subject-progress-card";

            subjectCard.innerHTML = `
                <div class="subject-progress-header">
                    <span class="subject-name">
                        ${escapeHTML(subjectName)}
                    </span>

                    <span class="subject-percent">
                        ${progress}%
                    </span>
                </div>

                <div class="progress-bar">
                    <div
                        class="progress-fill"
                        style="width: ${progress}%"
                    ></div>
                </div>
            `;

            subjectsContainer.appendChild(subjectCard);
        });
    }

    renderSubjectProgress();


    /* =========================================================
       7. STUDY PLAN
       ========================================================= */

    function renderStudyPlan() {

        if (!studyPlanContainer) return;

        studyPlanContainer.innerHTML = "";

        const plan = studyData.studyPlan || [];

        if (plan.length === 0) {

            studyPlanContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📝</div>
                    <h3>No study plan available</h3>
                    <p>Create a study plan from the main StudyMind page.</p>
                </div>
            `;

            return;
        }

        plan.forEach((item, index) => {

            let title = "";
            let description = "";
            let duration = "";
            let subject = "";

            if (typeof item === "string") {

                title = item;

            } else {

                title =
                    item.title ||
                    item.topic ||
                    item.task ||
                    `Study Session ${index + 1}`;

                description =
                    item.description ||
                    item.details ||
                    "";

                duration =
                    item.duration ||
                    item.time ||
                    "";

                subject =
                    item.subject ||
                    "";
            }

            const planItem = document.createElement("div");

            planItem.className = "study-plan-item";

            planItem.innerHTML = `
                <div class="plan-number">
                    ${index + 1}
                </div>

                <div class="plan-content">

                    <h3>
                        ${escapeHTML(title)}
                    </h3>

                    ${
                        subject
                            ? `<span class="plan-subject">
                                ${escapeHTML(subject)}
                               </span>`
                            : ""
                    }

                    ${
                        description
                            ? `<p>
                                ${escapeHTML(description)}
                               </p>`
                            : ""
                    }

                    ${
                        duration
                            ? `<span class="plan-duration">
                                ⏱ ${escapeHTML(String(duration))}
                               </span>`
                            : ""
                    }

                </div>
            `;

            studyPlanContainer.appendChild(planItem);
        });
    }

    renderStudyPlan();


    /* =========================================================
       8. TIMETABLE
       ========================================================= */

    function renderTimetable() {

        if (!timetableContainer) return;

        timetableContainer.innerHTML = "";

        const timetable = studyData.timetable || [];

        if (timetable.length === 0) {

            timetableContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🗓️</div>
                    <h3>No timetable available</h3>
                    <p>Your generated timetable will appear here.</p>
                </div>
            `;

            return;
        }

        timetable.forEach((day, index) => {

            let dayName = "";
            let sessions = [];

            if (typeof day === "string") {

                dayName = `Day ${index + 1}`;
                sessions = [day];

            } else {

                dayName =
                    day.day ||
                    day.date ||
                    `Day ${index + 1}`;

                sessions =
                    day.sessions ||
                    day.tasks ||
                    day.subjects ||
                    [];

                if (!Array.isArray(sessions)) {
                    sessions = [sessions];
                }
            }

            const dayCard = document.createElement("div");

            dayCard.className = "timetable-day";

            let sessionsHTML = "";

            sessions.forEach(session => {

                if (typeof session === "string") {

                    sessionsHTML += `
                        <div class="timetable-session">
                            ${escapeHTML(session)}
                        </div>
                    `;

                } else {

                    const subject =
                        session.subject ||
                        session.title ||
                        session.task ||
                        "Study Session";

                    const time =
                        session.time ||
                        session.duration ||
                        "";

                    sessionsHTML += `
                        <div class="timetable-session">

                            <div>
                                <strong>
                                    ${escapeHTML(subject)}
                                </strong>
                            </div>

                            ${
                                time
                                    ? `<span>
                                        ${escapeHTML(String(time))}
                                       </span>`
                                    : ""
                            }

                        </div>
                    `;
                }
            });

            dayCard.innerHTML = `
                <div class="timetable-day-header">
                    <h3>${escapeHTML(dayName)}</h3>
                </div>

                <div class="timetable-sessions">
                    ${sessionsHTML}
                </div>
            `;

            timetableContainer.appendChild(dayCard);
        });
    }

    renderTimetable();


    /* =========================================================
       9. CALENDAR
       ========================================================= */

    let calendarDate = new Date();

    function renderCalendar() {

        if (!calendarContainer) return;

        calendarContainer.innerHTML = "";

        const year = calendarDate.getFullYear();
        const month = calendarDate.getMonth();

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth =
            new Date(year, month + 1, 0).getDate();

        const monthName = new Date(
            year,
            month
        ).toLocaleDateString(
            "en-US",
            {
                month: "long",
                year: "numeric"
            }
        );

        const calendarHeader = document.createElement("div");

        calendarHeader.className = "calendar-header";

        calendarHeader.innerHTML = `
            <button
                class="calendar-nav"
                id="previousMonth"
                type="button"
            >
                ‹
            </button>

            <h3>${monthName}</h3>

            <button
                class="calendar-nav"
                id="nextMonth"
                type="button"
            >
                ›
            </button>
        `;

        calendarContainer.appendChild(calendarHeader);

        const weekdays = document.createElement("div");

        weekdays.className = "calendar-weekdays";

        [
            "Sun",
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat"
        ].forEach(day => {

            const element = document.createElement("div");

            element.textContent = day;

            weekdays.appendChild(element);
        });

        calendarContainer.appendChild(weekdays);

        const daysGrid = document.createElement("div");

        daysGrid.className = "calendar-days";

        // Empty spaces before first day
        for (let i = 0; i < firstDay; i++) {

            const emptyDay = document.createElement("div");

            emptyDay.className = "calendar-day empty";

            daysGrid.appendChild(emptyDay);
        }

        const today = new Date();

        for (let day = 1; day <= daysInMonth; day++) {

            const dayElement = document.createElement("div");

            dayElement.className = "calendar-day";

            const isToday =
                day === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear();

            if (isToday) {
                dayElement.classList.add("today");
            }

            dayElement.textContent = day;

            daysGrid.appendChild(dayElement);
        }

        calendarContainer.appendChild(daysGrid);

        document
            .getElementById("previousMonth")
            ?.addEventListener("click", () => {

                calendarDate.setMonth(
                    calendarDate.getMonth() - 1
                );

                renderCalendar();
            });

        document
            .getElementById("nextMonth")
            ?.addEventListener("click", () => {

                calendarDate.setMonth(
                    calendarDate.getMonth() + 1
                );

                renderCalendar();
            });
    }

    renderCalendar();


    /* =========================================================
       10. BADGES
       ========================================================= */

    function renderBadges() {

        if (!badgesContainer) return;

        badgesContainer.innerHTML = "";

        const completed =
            Number(progressData.completedSessions) || 0;

        const streak =
            Number(progressData.streak) || 0;

        const progress =
            Number(progressData.overall) || 0;

        const badges = [

            {
                icon: "🌱",
                name: "First Step",
                description: "Complete your first study session.",
                unlocked: completed >= 1
            },

            {
                icon: "📚",
                name: "Bookworm",
                description: "Complete 5 study sessions.",
                unlocked: completed >= 5
            },

            {
                icon: "🔥",
                name: "On Fire",
                description: "Maintain a 7-day study streak.",
                unlocked: streak >= 7
            },

            {
                icon: "🎯",
                name: "Focused",
                description: "Reach 50% overall progress.",
                unlocked: progress >= 50
            },

            {
                icon: "🏆",
                name: "High Achiever",
                description: "Reach 100% overall progress.",
                unlocked: progress >= 100
            }
        ];

        badges.forEach(badge => {

            const badgeElement = document.createElement("div");

            badgeElement.className =
                `badge ${badge.unlocked ? "unlocked" : "locked"}`;

            badgeElement.innerHTML = `

                <div class="badge-icon">
                    ${badge.unlocked ? badge.icon : "🔒"}
                </div>

                <div class="badge-info">

                    <h3>
                        ${badge.name}
                    </h3>

                    <p>
                        ${badge.description}
                    </p>

                </div>

            `;

            badgesContainer.appendChild(badgeElement);
        });
    }

    renderBadges();


    /* =========================================================
       11. MARK STUDY SESSION COMPLETE
       ========================================================= */

    window.completeStudySession = function(subject) {

        progressData.completedSessions =
            Number(progressData.completedSessions || 0) + 1;

        if (progressData.totalSessions <
            progressData.completedSessions) {

            progressData.totalSessions =
                progressData.completedSessions;
        }

        if (subject) {

            const current =
                Number(progressData.subjects?.[subject]) || 0;

            progressData.subjects[subject] =
                Math.min(100, current + 10);
        }

        calculateOverallProgress();

        updateStreak();

        saveProgress();

        refreshDashboard();
    };


    /* =========================================================
       12. CALCULATE OVERALL PROGRESS
       ========================================================= */

    function calculateOverallProgress() {

        const subjects =
            Object.values(progressData.subjects || {});

        if (subjects.length > 0) {

            const total =
                subjects.reduce(
                    (sum, value) => sum + Number(value || 0),
                    0
                );

            progressData.overall =
                Math.round(total / subjects.length);

        } else if (progressData.totalSessions > 0) {

            progressData.overall =
                Math.round(
                    (
                        progressData.completedSessions /
                        progressData.totalSessions
                    ) * 100
                );
        }

        progressData.overall =
            Math.max(
                0,
                Math.min(
                    100,
                    Number(progressData.overall) || 0
                )
            );
    }


    /* =========================================================
       13. STUDY STREAK
       ========================================================= */

    function updateStreak() {

        const today =
            new Date().toISOString().split("T")[0];

        const lastDate =
            progressData.lastStudyDate;

        if (!lastDate) {

            progressData.streak = 1;

        } else if (lastDate !== today) {

            const previous =
                new Date(lastDate);

            const current =
                new Date(today);

            const difference =
                Math.floor(
                    (
                        current - previous
                    ) / (1000 * 60 * 60 * 24)
                );

            if (difference === 1) {

                progressData.streak =
                    Number(progressData.streak || 0) + 1;

            } else if (difference > 1) {

                progressData.streak = 1;
            }
        }

        progressData.lastStudyDate = today;
    }


    /* =========================================================
       14. SAVE PROGRESS
       ========================================================= */

    function saveProgress() {

        localStorage.setItem(
            "studyMindProgress",
            JSON.stringify(progressData)
        );
    }


    /* =========================================================
       15. REFRESH DASHBOARD
       ========================================================= */

    function refreshDashboard() {

        updateOverallProgress();

        updateStatistics();

        renderSubjectProgress();

        renderStudyPlan();

        renderTimetable();

        renderBadges();
    }


    /* =========================================================
       16. RESET PROGRESS
       ========================================================= */

    const resetButton =
        document.getElementById("resetProgress") ||
        document.getElementById("clearProgress");

    resetButton?.addEventListener("click", () => {

        const confirmed =
            confirm(
                "Are you sure you want to reset your study progress?"
            );

        if (!confirmed) return;

        localStorage.removeItem(
            "studyMindProgress"
        );

        window.location.reload();
    });


    /* =========================================================
       17. NAVIGATION
       ========================================================= */

    const homeButtons =
        document.querySelectorAll(
            '[data-page="home"], #homeButton, #backHome'
        );

    homeButtons.forEach(button => {

        button.addEventListener("click", () => {

            window.location.href = "index.html";
        });
    });


    const studyButtons =
        document.querySelectorAll(
            '[data-page="study"], #studyButton'
        );

    studyButtons.forEach(button => {

        button.addEventListener("click", () => {

            window.location.href = "index.html#generator";
        });
    });


    /* =========================================================
       18. LOGOUT
       ========================================================= */

    const logoutButton =
        document.getElementById("logoutButton");

    logoutButton?.addEventListener("click", () => {

        const confirmed =
            confirm("Are you sure you want to leave StudyMind AI?");

        if (!confirmed) return;

        window.location.href = "index.html";
    });


    /* =========================================================
       19. THEME TOGGLE
       ========================================================= */

    const themeToggle =
        document.getElementById("themeToggle");

    if (themeToggle) {

        const savedTheme =
            localStorage.getItem("studyMindTheme");

        if (savedTheme === "light") {

            document.body.classList.add("light-mode");
        }

        themeToggle.addEventListener("click", () => {

            document.body.classList.toggle("light-mode");

            const isLight =
                document.body.classList.contains("light-mode");

            localStorage.setItem(
                "studyMindTheme",
                isLight ? "light" : "dark"
            );
        });
    }


    /* =========================================================
       20. UTILITY — ESCAPE HTML
       ========================================================= */

    function escapeHTML(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    /* =========================================================
       21. INITIAL DASHBOARD REFRESH
       ========================================================= */

    refreshDashboard();

});
