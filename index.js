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