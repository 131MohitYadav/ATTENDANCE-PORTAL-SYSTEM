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


    return listItem ;
}

function getColorStatusMap(){
    return {
        present: '#2ecc71',
        absent:  '#e74c3c',
        leave: '#f39c12'
    };
}
function escapeHtml(text){
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;

}

function showStudentsList(){
    const classSelector = document.getElementById('classSelector');
    const selectedClass = classSelector.value;

     
    if(!selectedClass){
        document.getElementById('studentsList').innerHTML = `
        <div class = "empty-state">
        <div class =empty-icons">📚</div>
        <h4> No Class Selected</h4>
        <p>Please select a class to view students.</p>
        </div>
        `;
        document.getElementById('summarySection').style.display = 'none';
        document.getElementById('resultSection').style.display = 'none';
        return;
    }

    const studentsList = document.getElementById('studentList');
    studentsList.innerHTML = '';

    const savedStudents = JSON.parse(localStorage.getItem('students')) || {};
    const selectedClassStudents = savedStudents[selectedClass] || [];

    if( selectedClassStudents.length === 0){
        studentsList.innerHTML = `
        <div class = "empty-state">
        <div class = "empty-icon">👤</div>
        <h4> No Students</h4>
        <p>Add students to this class using the "Add Student" button.</p>
        </div>
        `;
    } else{
        selectedClassStudents.forEach(student => {
            const listItem = createStudentListItem(student.name, student.rollNumber, selectedClass);
            studentsList.appendChild(listItem);
        });
    }

    // Check if attendance is submitted
    const resultSection = document.getElementById('resultSection');
    const isAttendanceSubmitted = resultSection.style.display === 'block';

    if(isAttendanceSubmitted){
        showAttendanceResult(selectedClass);
    } else{
        showSummary(selectedClass);
    }
}

function saveStudentsList(selectedClass){
    const studentList = document.getElementById('studentsList');
    const studentItems = studentList.querySelector('.student-item');
    const savedStudents = JSON.parse(localStorage.getItem('students')) || {};
    const students = Array.from(studentItems).map(item => ({
        name: item.querySelector('.student-name').textContent,
        rollNumber: item.getAttribute('data-roll-number')
    }));

    savedStudents[selectedClass] = students;
    localStorage.setItem('students', JSON.stringify(savedStudents));
}

// STUDENT EDIT / DELETE 

function editStudent(listItem, rollNumber){
    const nameSpan = listItem.querySelector('.student-name');
    const currentName = nameSpan.textContent;
    const newName = prompt('Edit Student Name:, currentName');


    if (newName !== null && newName.trim() !== ''){
        const trimmedName = newName.trim();
        nameSpan.textContent = trimmedName;

        // Update in localStorage
        const selectedClass = document.getElementById('classSelector').value;
        const savedStudents =   JSON.parse(localStorage.getItem('students')) || {};
        const studentIndex = students.findIndex(s => s.rollNumber === rollNumber);


        if (studentIndex !== -1){
            students[studentIndex].name = trimmedName;
            savedStudents[selectedClass] = students;
            localStorage.setItem('students', JSON.stringify(savedStudents));

            // Update attendance records
            const savedAttendance = JSON.parse(localStorage.getItem('attendanceData')) || [];
            savedAttendance.forEach(record => {
                if (record.rollNumber === rollNumber && record.class === selectedClass){
                    record.name = trimmedName;
                }
            });
            localStorage.setItem('attendanceData', JSON.stringify(savedAttendance));
            showToast('Student name updated!', 'success');
        }
    }
}

function deleteStudent(listItem, rollNumber){
    if(!confirm(` Are you sure you want to remove this student?`)) return;

    const selectedClass = document.getElementById('classSelector').value;

    // Remove from localStorage
    const savedStudents = JSON.parse(localStorage.getItem('students')) || {};
    const students = savedStudents[selectedClass] || [];
    const updatedStudents = students.filter(s => s.rollNumber !== rollNumber);
    savedStudents[selectedClass] = updatedStudents;
    localStorage.setItem('students', JSON.stringify(savedStudents));

    // Remove attendance records
    const savedAttendance  = JSON.parse(localStorage.getItem('attendanceData')) || [];
    const updatedAttendance = savedAttendance.filter(
        record => !(record.class === selectedClass && record.rollNumber === rollNumber)
    );
    localStorage.setItem('attendanceData', JSON.stringify(updatedAttendance));

    // Remove color
    const savedColors = JSON.parse(localStorage.getItem('colors')) || {};
if ( savedColors[selectedClass]) {
    delete savedColors[selectedClass][rollNumber];
    if(Object.keys(savedColors[selectedClass]).length === 0){
        delete savedColors[selectedClass];
    }
    localStorage.setItem('colors', JSON.stringify(savedColors));
}

// Remove from UI
listItem.remove();
showSummary(selectedClass);
showToast('Student removed successfully.', 'info');
}

// Attendance 

function markAttendance(status, listItem, selectedClass){
    const newStudentName = listItem.querySelector('.student-name').textContent;
    const rollNumber = listItem.getAttribute('data-roll-number');

    //Update background
    const color = getColorStatusMap()[status];
    listItem.style.backgroundColor = color;
    listItem.style.borderLeftColor = color;

    // update active button
    const actions = listItem.querySelector('.student-actions');
    actions.querySelectorAll('.status-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = actions.querySelector(`.${status}`);
    if (activeBtn) activeBtn.classList.add('active');

    // Save color
    saveColor(selectedClass, rollNumber, color);

    //update attendance record
    updatedAttendanceRecord(studentName, selectedClass, status, rollNumber);
    showSummary(selectedClass);

}

function updatedAttendanceRecord(studentName, selectedClass, status, rollNumber){
    const savedAttendanceData = JSON.parse(localStorage.getItem('attendanceData')) || [];

    const existingRecordIndex = savedAttendanceData.findIndex(
        record => record.rollNumber === rollNumber && record.class === selectedClass);


        const record = {
            name : studentName, 
            rollNumber: rollNumber,
            class: selectedClass,
            status, status,
            date: getCurrentDate(),
            timestamp: new Date().toISOString()
        };

        if(existingRecordIndex !== -1){
            savedAttendanceData[existingRecordIndex] = record;
        }else{
            savedAttendanceData.push(record);
        }

        localStorage.setItem('attendanceData', JSON.stringify(savedAttendanceData));
}


function saveColor(selectedClass, rollNumber, color){
    const savedColors = JSON.parse(localStorage.getItem('colors')) || {};
    if(!savedColors[selectedClass]) {
        savedColors[selectedClass] = {};
    }
    savedColors[selectedClass][rollNumber] = color;
    localStorage.setItem('colors', JSON.stringify(savedColors));
}

function getSavedColor(selectedClass, rollNumber) {
    const savedColors = JSON.parse(localStorage.getItem('colors')) || {};
    return savedColors[selectedClass] ? savedColors[selectedClass][rollNumber] : null;
}