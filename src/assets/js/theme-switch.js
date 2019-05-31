/*
* Based on https://dev.to/ananyaneogi/create-a-dark-light-mode-switch-with-css-variables-34l8
* Added support for "prefers-color-scheme"
*/

const toggleSwitch = document.getElementById("theme-switch-input");
const currentTheme = localStorage.getItem('theme');
const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);

    if (currentTheme === 'dark') {
        toggleSwitch.checked = true;
    }
}

if (prefersDarkMode) {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
    toggleSwitch.checked = true;
}

function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
    else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }    
}

toggleSwitch.addEventListener('change', switchTheme, false);