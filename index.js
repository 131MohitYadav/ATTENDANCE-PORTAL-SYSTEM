// INITILIZATION 
document.addEventListener("DOMContentLoaded", function() {
    populateClasses();
    showStudentsList();
    loadThemePreference();
    updateDateTime();
    setInterval(updateDateTime, 1000);
});


// THEME MANAGEMENT
function toggleTheme(){
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcon();
}
function loadThemePreference(){
    const theme = localStorage.getItem('theme');
    if (theme === 'dark'){
        document.body.classList.add('dark-mode')
    }
    updateThemeIcon();
}

function updateThemeIcon(){
    const btn = document.querySelector('.theme-toggle');
    if(btn){
        const isDark = document.body.classList.contains('dark-mode');
        btn.innerHTML = isDark ? ' Light' : 'Dark';
    }
}

// DATE AND TIME // 
 
function updateDateTime(){
    const now = new Date();
    const options = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    };
    const dateStr = now.toLocaleDateString('en-IN', options);
    const timeStr = now.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    const dateTimeEl = document.getElementById('currentDateTime');
    if(dateTimeEl){
        dateTimeEl.textContent = `${dateStr} | ${timeStr}`;
    }
}

function getCurrentDate(){
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2,'0');
    return `${year}-${month}-${day}`;
}

function getCurrentDate(){
    const now = new Date();
    return now.toLocaleDateString('en-IN', {
        hour:'2-digit',
        minute:'2-digit',
        second: '2-digit'
    });
}


// TOAST NOTIFICATION //
function showToast(message, type = 'info'){
    const container = document.querySelector('.toast-container');
    if(!container) return;

    const toast = document.createElement('div');
    const typeClasses = {
        success: 'toast-success',
        error: 'toast-error',
        info: 'toast-info',
        warning: 'toast-warning'
    };

    toast.className = `toast ${typeClasses[type] || typeClasses.info}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('toast-exit');
        setTimeout(() => toast.remove(), 300);
    },3000);
}


// CLASS MANAGEMENT // 
function populateClasses(){
    const savedClasses = JSON.parse(localStorage.getItem('classes')) || [];
    const classSelector = doucment.getElementById('classSelector');

    // Clear existing options (keep first option)
    classSelector.innerHTML = '<option value="">-- Select a Class --</option>';

    savedClasses.forEach(className => {
        const option = doucment.createElement('option');
        option.value = className;
        option.textContent = className;
        classSelector.appendChild(option);
    });
}

function saveClasses(){
    const classSelector = document.getElementById('classSelector');
    const options = Array.from(classSelector.options);
    const savedClasses = options
    .filter(opt => opt.value !== '')
    .map(opt => opt.value);
    localStorage.setItem('classes', JSON.stringify(savedClasses));
}

function showAddClassForm(){
    doucment.getElementById('addClassPopup').classList.add('active');
    document.getElementById('newClassName').value = '';
    document.getElementById('newClassName').focus();

}

function addClass(){
    const newClassName = document.getElementById('newClassName').value.trim();

    if(!newClassName){
        showToast('Please enter a class name.', 'error');
        return;
    }
    // Check for duplicate
    const classSelector = document.getElementById('classSelector');
    const existingClasses = Array.from(classSelector.options).map(opt => opt.value);
    if(existingClasses.includes(newClassName)){
        showToast('Class already exists!', 'warning');
        return;
    }

    const option = document.createElement('option');
    option.value = newClassName;
    option.textContent = newClassName;
    classSelector.appendChild(option);

    saveClasses();
    closePopup();
    showToast(`Class "${newClassName}" added successfully!`, 'success');
    classSelector.value = newClassName;
    showStudentsList();
}

// STUDENT MANAGEMENT //

function showAddStudentForm(){
    const classSelector = document.getElementById('classSelector');
    if(!classSelector.value){
        showToast('Please select a class first.', 'warning');
        return;
    }

    document.getElementById('addStudentPopup').classList.add('active');
    doucment.getElementById('newStudentName').value = '';
    document.getElementById('newStudentRoll').value = '';

    if(!classSelector.value){
        showToast('Please select a class first.', 'warning');
        return;
    }
    document.getElementById('addStudentPopup').classList.add('active');
    document.getElementById('newStudentName').value = '';
    document.getElementById('newStudentName').focus();
}
function addStudent(){
    const name = document.getElementById('newStudentName').value.trim();
    const roll = document.getElementById('newStudentRoll').value.trim();

    if(!name || !roll){
        showToast('please provide both name and roll number.', 'error');
        return;
    }
    const classSelector = document.getElementById('classSelector');
    const selectedClass = classSelector.value;

    if(!selectedClass){
        showToast('Please select a class.','error');
        return;
    }

    // check for duplicate roll number
    const savedStudents = JSON.parse(localStorage.getItem('students'))||
    {};
    const existingStudents = savedStudents[selectedClass] || [];
    if(existingStudents.some(s => s.rollNumber === roll)){
        showToast(`Roll number "${roll}" already exists in this class.`, 'error');
        return;
    }

    // Add to User Interface
    const studentsList = document.getElementById('studentsList');
    const listItem = createStudentListItem(name, roll, selectedClass);
    studentsList.appendChild(listItem);


    // save to localStorage
    saveStudentsList(selectedClass);
    showSummary(selectedClass);
    closePopup();
    showToast(`Student "${name}" added successfully!`, 'success');

    // clear inputs
    document.getElementById('newStudentName').value = '';
    document.getElementById('newStudentRoll').value = '';
}

function createStudentListItem(name, rollNumber, selectedClass){
    const listItem = document.createElement('li');
    listItem.className = 'student-item';
    listItem.setAttribute('data-roll-number', rollNumber);


    const inforDiv = document.createElement('div');
    inforDiv.className = 'student-info';
    inforDiv.innerHTML = `
    <span class= "student-name">${escapeHtml(name)}</span>
    <span class="student-roll">#${escapeHtml(rollNumber)}</span>
    ;`
    listItem.appendChild(infoDiv);

    const actionDiv = document.createElement('div');
    actionsDiv.className = 'student-actions';

    const statuses = [
        {
            key: 'present', label: 'P', color:"#2ecc71"
        },
        {
            key: 'absent', label: 'A', color: "#e74c3c"
        },
        {
            key:'leave', label:'L', color: '#f39c12'
        }
    ];

    statuses.forEach(status=> {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `status-btn ${status.key`;
            btn.textContent = status.label;
            btn.title = status.key.charAt(0).toUpperCase() + status.key.slice(1);
            btn.onclick = () => markAttendance(status.key.listItem, selectedClass);
            actionsDiv.appendChild(btn);
    });

    // Edit button

    
}