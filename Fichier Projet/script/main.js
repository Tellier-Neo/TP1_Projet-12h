// Sélection des éléments du DOM
const toggleSwitch = document.getElementById('toggle-switch');
const loginTypeLabel = document.getElementById('login-type-label');
const emailInput = document.getElementById('email-input');
const usernameInput = document.getElementById('username-input');
const emailLabel = document.getElementById('email-label');
const usernameLabel = document.getElementById('username-label');

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const switchToRegister = document.getElementById('switch-to-register');
const switchToLogin = document.getElementById('switch-to-login');

// Fonction pour basculer entre email et username
toggleSwitch.addEventListener('change', () => {
    if (toggleSwitch.checked) {
        
        emailInput.classList.add('hidden');
        emailLabel.classList.add('hidden');
        usernameInput.classList.remove('hidden');
        usernameLabel.classList.remove('hidden');
    } else {
        
        emailInput.classList.remove('hidden');
        emailLabel.classList.remove('hidden');
        usernameInput.classList.add('hidden');
        usernameLabel.classList.add('hidden');
    }
});

// Fonction pour basculer vers le formulaire d'inscription
switchToRegister.addEventListener('click', () => {
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
});

// Fonction pour basculer vers le formulaire de connexion
switchToLogin.addEventListener('click', () => {
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
});
