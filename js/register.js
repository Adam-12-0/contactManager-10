document.addEventListener("DOMContentLoaded", () => {
    const welcomeMessage = document.getElementById("welcomeMessage");
    const introMessage = document.getElementById("introMessage");
    const promptMessage = document.getElementById("promptMessage");
    const registerForm = document.getElementById("registerForm");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const registerButton = document.querySelector("button[type='submit']");
    const loginLink = document.getElementById("loginLink");
    const togglePassword = document.getElementById("togglePassword");

    welcomeMessage.addEventListener("animationend", () => {
        introMessage.style.display = "block";
        introMessage.classList.add("typing-effect");
    });

    introMessage.addEventListener("animationend", () => {
        promptMessage.style.display = "block";
        promptMessage.classList.add("typing-effect");
    });

    promptMessage.addEventListener("animationend", () => {
        setTimeout(() => {
            usernameInput.classList.add("visible");
            passwordInput.classList.add("visible");
            registerButton.classList.add("visible");
            loginLink.classList.add("visible");
            registerForm.style.display = "block";
        }, 500);
    });

    loginLink.addEventListener("click", () => {
        window.location.href = "login.html";
    });

    togglePassword.addEventListener("click", () => {
        const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
        passwordInput.setAttribute("type", type);
        togglePassword.textContent = type === "password" ? "👁️" : "👁️‍🗨️";
    });

    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!username) {
            usernameInput.classList.add("is-invalid");
            return;
        } else {
            usernameInput.classList.remove("is-invalid");
        }

        if (!password) {
            passwordInput.classList.add("is-invalid");
            return;
        } else {
            passwordInput.classList.remove("is-invalid");
        }

        try {
            const registerResponse = await fetch("LAMPAPI/register.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const registerData = await registerResponse.json();

            if (registerData.error) {
                if (registerData.error === "Username already exists") {
                    usernameInput.classList.add("is-invalid");
                    document.getElementById("usernameFeedback").textContent = "Username already exists";
                } else {
                    console.log("API returned error: ", registerData.error);
                }
            } else {
                usernameInput.classList.remove("is-invalid");
                // Attempt to log the user in immediately after registration
                try {
                    const loginResponse = await fetch("LAMPAPI/login.php", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ username, password }),
                    });

                    const loginData = await loginResponse.json();

                    if (loginData.error) {
                        console.log("API returned error: ", loginData.error);
                    } else {
                        // Store the user ID in local storage
                        localStorage.setItem("user_id", loginData.user_id);
                        window.location.href = "contacts.html";
                    }
                } catch (loginError) {
                    console.error("Error logging in after registration:", loginError);
                }
            }
        } catch (error) {
            console.error("Error:", error);
        }
    });
});
