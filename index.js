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