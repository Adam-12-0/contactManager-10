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
    const themeToggle = document.getElementById('themeToggle');
    const themeImage = document.getElementById('themeImage');

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        if (document.body.classList.contains('light-theme')) {
            themeImage.src = 'images/app-logo-black.png';
            themeToggle.textContent = '☀️';
            localStorage.setItem('theme', 'light');
        } else {
            themeImage.src = 'images/app-logo-white.png';
            themeToggle.textContent = '🌙';
            localStorage.setItem('theme', 'dark');
        }
    });

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
            themeToggle.classList.add("visible");
            loginLink.classList.add("visible");
            themeImage.classList.add("visible");
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

            const data = await registerResponse.json();

            if (data.error) {
                if (data.error === "Username already exists") {
                    usernameInput.classList.add("is-invalid");
                    document.getElementById("usernameFeedback").textContent = "Username already exists";
                } else if(data.error === "Password must contain at least one upper-case letter, one lower-case letter, and one numerical character") {
                    passwordInput.classList.add("is-invalid");
                    document.getElementById("passwordFeedback").textContent = "Password must contain at least 1 upper-case letter, lower-case letter, and numerical character"; 
                } else {
                    console.log("API returned error: ", data.error);
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

                    const data = await loginResponse.json();

                    if (data.error) {
                        console.log("API returned error: ", data.error);
                    } else {
                        // Store the user ID in local storage
                        localStorage.setItem("user_id", data.user_id);
                        localStorage.setItem("username", username);
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