document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("signupForm");
    const password = document.getElementById("signup_password");
    const confirmPassword = document.getElementById("confirm_password");
    const confirmPasswordError = document.getElementById("confirmPasswordError");
    const submitButton = document.getElementById("signupButton");

    function validatePasswordMatch() {
        const matches = password.value === confirmPassword.value;
        confirmPassword.setCustomValidity(
            matches ? "" : "Passwords do not match."
        );
        confirmPasswordError.textContent =
            matches || !confirmPassword.value ? "" : "Passwords do not match.";
        return matches;
    }

    confirmPassword.addEventListener("input", validatePasswordMatch);
    password.addEventListener("input", validatePasswordMatch);

    form.addEventListener("submit", event => {
        if (!validatePasswordMatch()) {
            event.preventDefault();
            confirmPassword.reportValidity();
            return;
        }

        submitButton.classList.add("loading");
        submitButton.disabled = true;
    });
});
