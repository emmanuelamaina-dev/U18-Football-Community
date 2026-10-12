/* =========================================================
   LOGIN PAGE JAVASCRIPT
========================================================= */


/* ---------------------------------------------------------
   GET ELEMENTS
--------------------------------------------------------- */

const loginForm = document.getElementById("loginForm");

const usernameInput = document.getElementById("username");

const passwordInput = document.getElementById("password");

const togglePassword = document.getElementById("togglePassword");

const loginButton = document.getElementById("loginButton");

const statusMessage = document.getElementById("statusMessage");

const usernameError = document.getElementById("usernameError");

const passwordError = document.getElementById("passwordError");

const forgotPassword = document.getElementById("forgotPassword");


/* =========================================================
   SHOW / HIDE PASSWORD
========================================================= */

togglePassword.addEventListener("click", function () {

    const passwordType =
        passwordInput.getAttribute("type");

    if (passwordType === "password") {

        passwordInput.setAttribute("type", "text");

        togglePassword.textContent = "🙈";

        togglePassword.setAttribute(
            "aria-label",
            "Hide password"
        );

    } else {

        passwordInput.setAttribute("type", "password");

        togglePassword.textContent = "👁";

        togglePassword.setAttribute(
            "aria-label",
            "Show password"
        );
    }

});


/* =========================================================
   REMOVE ERROR WHEN USER TYPES
========================================================= */

usernameInput.addEventListener("input", function () {

    usernameInput.classList.remove("input-error");

    usernameError.textContent = "";

});


passwordInput.addEventListener("input", function () {

    passwordInput.classList.remove("input-error");

    passwordError.textContent = "";

});


/* =========================================================
   EMAIL / USERNAME VALIDATION
========================================================= */

function validateUsername() {

    const value =
        usernameInput.value.trim();


    if (value === "") {

        usernameError.textContent =
            "Please enter your email or username.";

        usernameInput.classList.add("input-error");

        return false;
    }


    return true;
}


/* =========================================================
   PASSWORD VALIDATION
========================================================= */

function validatePassword() {

    const value =
        passwordInput.value.trim();


    if (value === "") {

        passwordError.textContent =
            "Please enter your password.";

        passwordInput.classList.add("input-error");

        return false;
    }


    if (value.length < 6) {

        passwordError.textContent =
            "Password must contain at least 6 characters.";

        passwordInput.classList.add("input-error");

        return false;
    }


    return true;
}


/* =========================================================
   STATUS MESSAGE
========================================================= */

function showStatus(message, type) {

    statusMessage.textContent = message;

    statusMessage.className =
        "status-message show " + type;
}


function clearStatus() {

    statusMessage.textContent = "";

    statusMessage.className =
        "status-message";
}


/* =========================================================
   LOGIN FORM
========================================================= */

loginForm.addEventListener("submit", function (event) {

    event.preventDefault();


    clearStatus();


    const validUsername =
        validateUsername();

    const validPassword =
        validatePassword();


    if (!validUsername || !validPassword) {

        showStatus(
            "Please correct the highlighted fields.",
            "error"
        );

        return;
    }


    loginButton.classList.add("loading");
    loginButton.disabled = true;

    loginForm.submit();

});


/* =========================================================
   FORGOT PASSWORD
========================================================= */

forgotPassword.addEventListener("click", function (event) {

    event.preventDefault();


    clearStatus();


    const username =
        usernameInput.value.trim();

    if (username === "") {

        usernameInput.focus();

        showStatus(
            "Enter your email or username first.",
            "error"
        );

        return;
    }


    showStatus(
        "If an account exists, password-reset instructions will be sent.",
        "success"
    );

});


/* =========================================================
   ENTER KEY EXPERIENCE
========================================================= */

usernameInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

        passwordInput.focus();

    }

});


/* =========================================================
   REMEMBER ME
========================================================= */

const rememberCheckbox =
    document.getElementById("remember");


/*
   Save username locally when Remember Me
   is selected.

   NOTE:
   Do NOT store passwords in localStorage.
*/

rememberCheckbox.addEventListener("change", function () {

    if (this.checked) {

        localStorage.setItem(
            "u18RememberUser",
            usernameInput.value.trim()
        );

    } else {

        localStorage.removeItem(
            "u18RememberUser"
        );

    }

});


/* =========================================================
   LOAD REMEMBERED USER
========================================================= */

window.addEventListener("DOMContentLoaded", function () {

    const rememberedUser =
        localStorage.getItem("u18RememberUser");


    if (rememberedUser) {

        usernameInput.value =
            rememberedUser;

        rememberCheckbox.checked =
            true;

    }

});