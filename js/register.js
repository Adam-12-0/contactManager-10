document.addEventListener("DOMContentLoaded", function() {
    const welcomeMessage = document.getElementById("welcomeMessage");
    const introMessage = document.getElementById("introMessage");
    const promptMessage = document.getElementById("promptMessage");
    const registerForm = document.getElementById("registerForm");

    function showElement(element, delay) {
        setTimeout(() => {
            element.style.display = "block";
            element.classList.add("typing-effect");
        }, delay);
    }

    function makeVisible(element, delay) {
        setTimeout(() => {
            element.style.visibility = "visible";
            element.classList.add("visible");
        }, delay);
    }

    // Show messages one after the other with a delay
    showElement(introMessage, 3000); // Show after 3 seconds
    showElement(promptMessage, 6000); // Show after 6 seconds

    // Show form elements with a "water wave" animation after all messages
    setTimeout(() => {
        registerForm.style.display = "block";
        const formLabels = registerForm.querySelectorAll('.form-label');
        const formControls = registerForm.querySelectorAll('.form-control');
        const submitButton = document.querySelector("button[type='submit']");
        
        formLabels.forEach((label, index) => {
            makeVisible(label, 7000 + (index * 500)); // Decreased delay
        });
        formControls.forEach((control, index) => {
            makeVisible(control, 7000 + (index * 500)); // Decreased delay
        });
        makeVisible(submitButton, 7000 + (formControls.length * 500)); // Show submit button last
    }, 7000);
});

document.getElementById("registerForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const usernameFeedback = usernameInput.nextElementSibling;
    const passwordFeedback = passwordInput.nextElementSibling;
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    
    // Log the value of username and password after trimming
    console.log("Trimmed Username entered:", username);
    console.log("Trimmed Password entered:", password);

    // Reset previous validation feedback
    usernameInput.classList.remove("is-invalid");
    passwordInput.classList.remove("is-invalid");
    usernameFeedback.textContent = "";
    passwordFeedback.textContent = "";

    // Validate input fields
    if (username === "") {
        usernameInput.classList.add("is-invalid");
        usernameFeedback.textContent = "Username is required.";
        console.log("Username is empty"); // Debugging statement
        return;
    }

    if (password === "") {
        passwordInput.classList.add("is-invalid");
        passwordFeedback.textContent = "Password is required.";
        console.log("Password is empty"); // Debugging statement
        return;
    }

    // Send data to API
    fetch('http://localhost/contactManager-10/LAMPAPI/register.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username, password: password })
    })
    .then(response => response.json())
    .then(data => {
        // Log the response from the API
        console.log("Response from API:", data);

        if (data.error && data.error !== "") {
            usernameInput.classList.add("is-invalid");
            usernameFeedback.textContent = data.error;
            console.log("API returned error:", data.error); // Debugging statement
        } else {
            console.log("No error, user registered"); // Debugging statement
            alert("User registered successfully!");
            usernameInput.classList.remove("is-invalid");
            passwordInput.classList.remove("is-invalid");
            usernameFeedback.textContent = "";
            passwordFeedback.textContent = "";
            // Optionally, redirect to another page or reset the form
        }
    })
    .catch(error => {
        console.error("Error fetching data:", error); // Debugging statement
    });
});