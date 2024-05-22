document.addEventListener("DOMContentLoaded", () => {
    const welcomeMessage = document.getElementById("welcomeMessage");
    const introMessage = document.getElementById("introMessage");
    const loginForm = document.getElementById("loginForm");
    const loginUsername = document.getElementById("loginUsername");
    const loginPassword = document.getElementById("loginPassword");
    const toggleLoginPassword = document.getElementById("toggleLoginPassword");
    const registerLink = document.getElementById("registerLink");

    welcomeMessage.addEventListener("animationend", () => {
        introMessage.style.display = "block";
        introMessage.classList.add("typing-effect");
    });

    introMessage.addEventListener("animationend", () => {
        setTimeout(() => {
            loginUsername.classList.add("visible");
            loginPassword.classList.add("visible");
            registerLink.classList.add("visible");
            loginForm.style.display = "block";
        }, 500);
    });

    registerLink.addEventListener("click", () => {
        window.location.href = "register.html";
    });

    toggleLoginPassword.addEventListener("click", () => {
        const type = loginPassword.getAttribute("type") === "password" ? "text" : "password";
        loginPassword.setAttribute("type", type);
        toggleLoginPassword.textContent = type === "password" ? "👁️" : "👁️‍🗨️";
    });

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const username = loginUsername.value.trim();
        const password = loginPassword.value.trim();

        if (!username) {
            loginUsername.classList.add("is-invalid");
            return;
        } else {
            loginUsername.classList.remove("is-invalid");
        }

        if (!password) {
            loginPassword.classList.add("is-invalid");
            return;
        } else {
            loginPassword.classList.remove("is-invalid");
        }

        try {
            const response = await fetch("LAMPAPI/login.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (data.error) {
                if (data.error === "Username does not exist") {
                    loginUsername.classList.add("is-invalid");
                    document.getElementById("usernameFeedback").textContent = "Username does not exist";
                } else if (data.error === "Incorrect password") {
                    loginPassword.classList.add("is-invalid");
                    document.getElementById("passwordFeedback").textContent = "Incorrect password";
                } else {
                    console.log("API returned error: ", data.error);
                }
            } else {
                loginUsername.classList.remove("is-invalid");
                loginPassword.classList.remove("is-invalid");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    });
});
