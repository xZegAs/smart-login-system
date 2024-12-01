// Global variables and DOM elements
var users = JSON.parse(localStorage.getItem("users")) || [];
var currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

var registerForm = document.getElementById("registerForm");
var loginForm = document.getElementById("loginForm");
var homePage = document.getElementById("homePage");

var registerName = document.getElementById("registerName");
var registerEmail = document.getElementById("registerEmail");
var registerPassword = document.getElementById("registerPassword");
var loginEmail = document.getElementById("loginEmail");
var loginPassword = document.getElementById("loginPassword");

var registerMessage = document.getElementById("registerMessage");
var loginMessage = document.getElementById("loginMessage");
var welcomeMessage = document.getElementById("welcomeMessage");

var registerButton = document.querySelector("#registerForm .btn-primary");
var loginButton = document.querySelector("#loginForm .btn-primary");
var logoutButton = document.querySelector(".btn-outline-light");

var PASSWORD_MIN_LENGTH = 8;
var PASSWORD_RULES = {
  minLength: PASSWORD_MIN_LENGTH,
  hasUpperCase: /[A-Z]/,
  hasLowerCase: /[a-z]/,
  hasNumbers: /\d/,
  hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/,
};

function updatePageTitle(page) {
  var baseTitle = "Smart Login System";
  switch (page) {
    case "register":
      document.title = `Register | ${baseTitle}`;
      break;
    case "login":
      document.title = `Login | ${baseTitle}`;
      break;
    case "home":
      document.title = `Welcome | ${baseTitle}`;
      break;
    default:
      document.title = baseTitle;
  }
}

function isValidEmail(email) {
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPassword(password) {
  var errors = [];

  if (password.length < PASSWORD_RULES.minLength) {
    errors.push(
      "Password must be at least " +
        PASSWORD_RULES.minLength +
        " characters long"
    );
  }
  if (!PASSWORD_RULES.hasUpperCase.test(password)) {
    errors.push("Include at least one uppercase letter");
  }
  if (!PASSWORD_RULES.hasLowerCase.test(password)) {
    errors.push("Include at least one lowercase letter");
  }
  if (!PASSWORD_RULES.hasNumbers.test(password)) {
    errors.push("Include at least one number");
  }
  if (!PASSWORD_RULES.hasSpecialChar.test(password)) {
    errors.push("Include at least one special character");
  }

  return {
    isValid: errors.length === 0,
    errors: errors,
  };
}

function showMessage(element, message, isError) {
  element.textContent = message;
  element.classList.remove("d-none", "alert-success", "alert-danger");
  element.classList.add(isError ? "alert-danger" : "alert-success");

  element.style.animation = "none";
  element.offsetHeight;
  element.style.animation = "fadeIn 0.5s ease-out";
}

function toggleForms(showForm) {
  registerForm.classList.add("d-none");
  loginForm.classList.add("d-none");
  homePage.classList.add("d-none");
  showForm.classList.remove("d-none");

  if (showForm === registerForm) {
    updatePageTitle("register");
  } else if (showForm === loginForm) {
    updatePageTitle("login");
  } else if (showForm === homePage) {
    updatePageTitle("home");
  }

  showForm.style.animation = "none";
  showForm.offsetHeight;
  showForm.style.animation = "fadeIn 0.5s ease-out";
}

function clearInputs() {
  registerName.value = "";
  registerEmail.value = "";
  registerPassword.value = "";
  loginEmail.value = "";
  loginPassword.value = "";
}

function saveUsers() {
  localStorage.setItem("users", JSON.stringify(users));
}

function saveCurrentUser(user) {
  currentUser = user;
  localStorage.setItem("currentUser", JSON.stringify(user));
}

function clearCurrentUser() {
  currentUser = null;
  localStorage.removeItem("currentUser");
}

function handleRegister(e) {
  e.preventDefault();
  var name = registerName.value;
  var email = registerEmail.value;
  var password = registerPassword.value;

  if (!name || !email || !password) {
    showMessage(registerMessage, "Please fill in all fields", true);
    return;
  }

  if (!isValidEmail(email)) {
    showMessage(registerMessage, "Please enter a valid email address", true);
    return;
  }

  var passwordValidation = isValidPassword(password);
  if (!passwordValidation.isValid) {
    showMessage(
      registerMessage,
      "Password requirements:\n" + passwordValidation.errors.join("\n"),
      true
    );
    return;
  }

  var existingUser = null;
  for (var i = 0; i < users.length; i++) {
    if (users[i].email === email) {
      existingUser = users[i];
      break;
    }
  }

  if (existingUser) {
    showMessage(registerMessage, "Email is already registered", true);
    return;
  }

  users.push({ name: name, email: email, password: password });
  saveUsers();

  showMessage(
    registerMessage,
    "Registration successful! Redirecting to login...",
    false
  );

  setTimeout(function () {
    toggleForms(loginForm);
    clearInputs();
  }, 2000);
}

function handleLogin(e) {
  e.preventDefault();
  var email = loginEmail.value;
  var password = loginPassword.value;

  if (!email || !password) {
    showMessage(loginMessage, "Please fill in all fields", true);
    return;
  }

  var user = null;
  for (var i = 0; i < users.length; i++) {
    if (users[i].email === email && users[i].password === password) {
      user = users[i];
      break;
    }
  }

  if (!user) {
    showMessage(loginMessage, "Invalid email or password", true);
    return;
  }

  saveCurrentUser(user);
  welcomeMessage.textContent = "Welcome, " + user.name + "!";
  toggleForms(homePage);
  clearInputs();
}

function handleLogout(e) {
  e.preventDefault();
  clearCurrentUser();
  toggleForms(loginForm);
}

function handleFormToggle(e, form) {
  e.preventDefault();
  toggleForms(form);
}

function setupInputEffects() {
  var inputs = document.querySelectorAll(".form-control");
  for (var i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener("focus", function () {
      this.parentElement.querySelector("i").style.color = "#667eea";
    });

    inputs[i].addEventListener("blur", function () {
      this.parentElement.querySelector("i").style.color = "#764ba2";
    });
  }
}

function setupPasswordValidation() {
  registerPassword.addEventListener("input", function () {
    var password = this.value;
    var validation = isValidPassword(password);

    if (password.length > 0) {
      showMessage(
        registerMessage,
        validation.isValid
          ? "Password meets all requirements!"
          : "Password requirements:\n" + validation.errors.join("\n"),
        !validation.isValid
      );
    } else {
      registerMessage.classList.add("d-none");
    }
  });
}

function preventFormSubmission(form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
  });
}

// Event Listeners
document.addEventListener("DOMContentLoaded", function () {
  setupInputEffects();
  setupPasswordValidation();

  if (currentUser) {
    welcomeMessage.textContent = "Welcome, " + currentUser.name + "!";
    toggleForms(homePage);
  } else {
    updatePageTitle("register");
  }

  registerButton.addEventListener("click", handleRegister);
  document
    .querySelector("#loginForm a")
    .addEventListener("click", function (e) {
      handleFormToggle(e, registerForm);
    });

  loginButton.addEventListener("click", handleLogin);
  document
    .querySelector("#registerForm a")
    .addEventListener("click", function (e) {
      handleFormToggle(e, loginForm);
    });

  logoutButton.addEventListener("click", handleLogout);

  var allForms = document.querySelectorAll("form");
  for (var i = 0; i < allForms.length; i++) {
    preventFormSubmission(allForms[i]);
  }
});
