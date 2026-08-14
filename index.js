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