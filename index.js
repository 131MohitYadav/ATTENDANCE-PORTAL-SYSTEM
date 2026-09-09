// ================================
// INITIALIZATION
// ================================
document.addEventListener("DOMContentLoaded", function () {
    populateClasses();
    showStudentsList();
    loadThemePreference();
    updateDateTime();

    setInterval(updateDateTime, 1000);
});


// ================================
// THEME MANAGEMENT
// ================================
function toggleTheme() {
    document.body.classList.toggle("dark-mode");

    const isDark = document.body.classList.contains("dark-mode");

    localStorage.setItem("theme", isDark ? "dark" : "light");

    updateThemeIcon();
}


function loadThemePreference() {
    const theme = localStorage.getItem("theme");

    if (theme === "dark") {
        document.body.classList.add("dark-mode");
    }

    updateThemeIcon();
}


function updateThemeIcon() {
    const btn = document.querySelector(".theme-toggle");

    if (btn) {
        const isDark = document.body.classList.contains("dark-mode");

        btn.innerHTML = isDark ? "☀️ Light" : "🌙 Dark";
    }
}


// ================================
// DATE AND TIME
// ================================
function updateDateTime() {
    const now = new Date();

    const options = {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric"
    };

    const dateStr = now.toLocaleDateString("en-IN", options);

    const timeStr = now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    const dateTimeEl = document.getElementById("currentDateTime");

    if (dateTimeEl) {
        dateTimeEl.textContent = `${dateStr} | ${timeStr}`;
    }
}


function getCurrentDate() {
    const now = new Date();

    const year = now.getFullYear();

    const month = String(now.getMonth() + 1).padStart(2, "0");

    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


// ================================
// TOAST NOTIFICATION
// ================================
function showToast(message, type = "info") {
    const container = document.querySelector(".toast-container");

    if (!container) {
        return;
    }

    const toast = document.createElement("div");

    const typeClasses = {
        success: "toast-success",
        error: "toast-error",
        info: "toast-info",
        warning: "toast-warning"
    };

    toast.className =
        `toast ${typeClasses[type] || typeClasses.info}`;

    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(function () {
        toast.classList.add("toast-exit");

        setTimeout(function () {
            toast.remove();
        }, 300);

    }, 3000);
}


// ================================
// CLASS MANAGEMENT
// ================================
function populateClasses() {
    const savedClasses =
        JSON.parse(localStorage.getItem("classes")) || [];

    const classSelector =
        document.getElementById("classSelector");

    if (!classSelector) {
        return;
    }

    classSelector.innerHTML =
        '<option value="">-- Select a Class --</option>';

    savedClasses.forEach(function (className) {
        const option = document.createElement("option");

        option.value = className;
        option.textContent = className;

        classSelector.appendChild(option);
    });
}


function saveClasses() {
    const classSelector =
        document.getElementById("classSelector");

    if (!classSelector) {
        return;
    }

    const options =
        Array.from(classSelector.options);

    const savedClasses = options
        .filter(function (option) {
            return option.value !== "";
        })
        .map(function (option) {
            return option.value;
        });

    localStorage.setItem(
        "classes",
        JSON.stringify(savedClasses)
    );
}


function showAddClassForm() {
    const popup =
        document.getElementById("addClassPopup");

    const input =
        document.getElementById("newClassName");

    if (!popup || !input) {
        return;
    }

    popup.classList.add("active");

    input.value = "";

    input.focus();
}


function addClass() {
    const input =
        document.getElementById("newClassName");

    const classSelector =
        document.getElementById("classSelector");

    if (!input || !classSelector) {
        return;
    }

    const newClassName =
        input.value.trim();

    if (!newClassName) {
        showToast(
            "Please enter a class name.",
            "error"
        );

        return;
    }

    // Check duplicate class
    const existingClasses =
        Array.from(classSelector.options)
            .map(function (option) {
                return option.value;
            });

    if (existingClasses.includes(newClassName)) {
        showToast(
            "Class already exists!",
            "warning"
        );

        return;
    }

    // Create new option
    const option =
        document.createElement("option");

    option.value = newClassName;
    option.textContent = newClassName;

    classSelector.appendChild(option);

    // Save class
    saveClasses();

    // Select newly added class
    classSelector.value = newClassName;

    closePopup();

    showToast(
        `Class "${newClassName}" added successfully!`,
        "success"
    );

    showStudentsList();
}


// ================================
// STUDENT MANAGEMENT
// ================================
function showAddStudentForm() {
    const classSelector =
        document.getElementById("classSelector");

    if (!classSelector) {
        return;
    }

    if (!classSelector.value) {
        showToast(
            "Please select a class first.",
            "warning"
        );

        return;
    }

    const popup =
        document.getElementById("addStudentPopup");

    const nameInput =
        document.getElementById("newStudentName");

    const rollInput =
        document.getElementById("newStudentRoll");

    if (!popup || !nameInput || !rollInput) {
        return;
    }

    popup.classList.add("active");

    // Clear inputs
    nameInput.value = "";
    rollInput.value = "";

    nameInput.focus();
}


function addStudent() {
    const nameInput =
        document.getElementById("newStudentName");

    const rollInput =
        document.getElementById("newStudentRoll");

    if (!nameInput || !rollInput) {
        return;
    }

    const name =
        nameInput.value.trim();

    const roll =
        rollInput.value.trim();

    if (!name || !roll) {
        showToast(
            "Please provide both name and roll number.",
            "error"
        );

        return;
    }

    const classSelector =
        document.getElementById("classSelector");

    if (!classSelector) {
        return;
    }

    const selectedClass =
        classSelector.value;

    if (!selectedClass) {
        showToast(
            "Please select a class.",
            "error"
        );

        return;
    }


    // ================================
    // CHECK DUPLICATE ROLL NUMBER
    // ================================
    const savedStudents =
        JSON.parse(
            localStorage.getItem("students")
        ) || {};

    const existingStudents =
        savedStudents[selectedClass] || [];

    if (
        existingStudents.some(function (student) {
            return student.rollNumber === roll;
        })
    ) {
        showToast(
            `Roll number "${roll}" already exists in this class.`,
            "error"
        );

        return;
    }


    // ================================
    // ADD STUDENT TO UI
    // ================================
    const studentsList =
        document.getElementById("studentsList");

    if (!studentsList) {
        return;
    }

    const listItem =
        createStudentListItem(
            name,
            roll,
            selectedClass
        );

    studentsList.appendChild(listItem);


    // ================================
    // SAVE STUDENT
    // ================================
    saveStudentsList(selectedClass);

    showSummary(selectedClass);

    closePopup();

    showToast(
        `Student "${name}" added successfully!`,
        "success"
    );


    // Clear inputs
    nameInput.value = "";
    rollInput.value = "";
}


// ================================
// CREATE STUDENT LIST ITEM
// ================================
function createStudentListItem(
    name,
    rollNumber,
    selectedClass
) {
    const listItem =
        document.createElement("li");

    listItem.className =
        "student-item";

    listItem.setAttribute(
        "data-roll-number",
        rollNumber
    );


    // ================================
    // STUDENT INFORMATION
    // ================================
    const infoDiv =
        document.createElement("div");

    infoDiv.className =
        "student-info";

    infoDiv.innerHTML = `
        <span class="student-name">
            ${escapeHtml(name)}
        </span>

        <span class="student-roll">
            #${escapeHtml(rollNumber)}
        </span>
    `;

    listItem.appendChild(infoDiv);


    // ================================
    // ACTIONS
    // ================================
    const actionsDiv =
        document.createElement("div");

    actionsDiv.className =
        "student-actions";


    // ================================
    // ATTENDANCE STATUS
    // ================================
    const statuses = [
        {
            key: "present",
            label: "P"
        },
        {
            key: "absent",
            label: "A"
        },
        {
            key: "leave",
            label: "L"
        }
    ];


    statuses.forEach(function (status) {

        const btn =
            document.createElement("button");

        btn.type = "button";

        btn.className =
            `status-btn ${status.key}`;

        btn.textContent =
            status.label;

        btn.title =
            status.key.charAt(0).toUpperCase() +
            status.key.slice(1);


        // Attendance
        btn.onclick = function () {
            markAttendance(
                status.key,
                listItem,
                selectedClass
            );
        };

        actionsDiv.appendChild(btn);
    });


    // ================================
    // EDIT BUTTON
    // ================================
    const editBtn =
        document.createElement("button");

    editBtn.type = "button";

    editBtn.className =
        "status-btn edit-btn";

    editBtn.textContent = "✏️";

    editBtn.title =
        "Edit Student";

    editBtn.onclick = function () {
        editStudent(
            listItem,
            rollNumber
        );
    };

    actionsDiv.appendChild(editBtn);


    // ================================
    // DELETE BUTTON
    // ================================
    const delBtn =
        document.createElement("button");

    delBtn.type = "button";

    delBtn.className =
        "status-btn delete-btn";

    delBtn.textContent = "🗑️";

    delBtn.title =
        "Delete Student";

    delBtn.onclick = function () {
        deleteStudent(
            listItem,
            rollNumber
        );
    };

    actionsDiv.appendChild(delBtn);


    // Add actions
    listItem.appendChild(actionsDiv);


    // ================================
    // RESTORE SAVED COLOR
    // ================================
    const savedColor =
        getSavedColor(
            selectedClass,
            rollNumber
        );

    if (savedColor) {

        listItem.style.backgroundColor =
            savedColor;

        const colorStatusMap =
            getColorStatusMap();

        const statusKey =
            Object.keys(colorStatusMap)
                .find(function (key) {
                    return colorStatusMap[key] === savedColor;
                });

        if (statusKey) {

            const btn =
                actionsDiv.querySelector(
                    `.${statusKey}`
                );

            if (btn) {
                btn.classList.add("active");
            }
        }
    }


    return listItem;
}