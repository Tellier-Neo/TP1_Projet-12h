// Select elements from the DOM
const toggleSwitch = document.getElementById("toggle-switch");
const loginTypeLabel = document.getElementById("login-type-label");
const emailInput = document.getElementById("email-input");
const usernameInput = document.getElementById("username-input");
const emailLabel = document.getElementById("email-label");
const usernameLabel = document.getElementById("username-label");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const switchToRegister = document.getElementById("switch-to-register");
const switchToLogin = document.getElementById("switch-to-login");
const registerButton = document.getElementById("register-button");
const loginButton = document.getElementById("login-button");

// Function to toggle between email and username input
toggleSwitch.addEventListener("change", () => {
  if (toggleSwitch.checked) {
    emailInput.classList.add("hidden");
    emailLabel.classList.add("hidden");
    usernameInput.classList.remove("hidden");
    usernameLabel.classList.remove("hidden");
  } else {
    emailInput.classList.remove("hidden");
    emailLabel.classList.remove("hidden");
    usernameInput.classList.add("hidden");
    usernameLabel.classList.add("hidden");
  }
});

// Function to switch to register form
switchToRegister.addEventListener("click", () => {
  loginForm.classList.add("hidden");
  registerForm.classList.remove("hidden");
});

// Function to switch to login form
switchToLogin.addEventListener("click", () => {
  registerForm.classList.add("hidden");
  loginForm.classList.remove("hidden");
});

// Function to register a user
function registerUser() {
  const username = usernameInput.value;
  const email = emailInput.value;
  const data = { username, email };

  fetch("http://192.168.65.103:5560/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Register response:", data);
      if (data.error) {
        loginTypeLabel.textContent = "Registration failed";
        loginTypeLabel.style.color = "red";
      }
    })
    .catch((error) => {
      console.error("Error registering user:", error);
    });
}

// Function to login a user
function loginUser() {
  const usernameOrEmail = toggleSwitch.checked
    ? usernameInput.value
    : emailInput.value;
  const data = { usernameOrEmail };

  fetch("http://192.168.65.103:5560/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Login response:", data);
      if (data.error) {
      } else {
        const token = data.token;
        document.cookie = `LawrenceToken=${token}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;

        setTimeout(() => {
          // Redirect to another page after a few seconds
          window.location.href = "/dashboard"; // Replace with the actual page URL
        }, 2000);
      }
    })
    .catch((error) => {
      console.error("Error logging in user:", error);
    });
}

// Add event listeners to the register and login buttons
registerButton.addEventListener("click", registerUser);
loginButton.addEventListener("click", loginUser);
