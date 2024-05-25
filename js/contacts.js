document.addEventListener("DOMContentLoaded", function() {
    const contactList = document.getElementById("contact-list");
    const searchBar = document.getElementById("search-bar");
    const addContactButton = document.getElementById("add-contact-button");
    const closePopupButton = document.getElementById("close-popup-button");
    const contactForm = document.getElementById("contact-form");
    const wrapper = document.querySelector('.wrapper');
    const searchSection = document.querySelector('.search-section');
    const usernameSpan = document.getElementById('username');
    let currentContactId = null;

    console.log("DOMContentLoaded event fired");

    // Set the welcome message with the username
    const username = localStorage.getItem('username');
    if (username) {
        usernameSpan.textContent = username;
    }

    // Load contacts from the API
    function loadContacts() {
        console.log("loadContacts function called");
        fetch('http://localhost/contactManager-10/LAMPAPI/load.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id: localStorage.getItem('user_id') })
        })
        .then(response => {
            console.log("API response received");
            return response.json();
        })
        .then(data => {
            console.log("API response data: ", data);
            if (data.contacts) {
                console.log("Contacts found: ", data.contacts.length);
                renderContacts(data.contacts);
            } else {
                console.error('Error: No contacts returned');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    // Render contacts to the DOM
    function renderContacts(contacts) {
        console.log("renderContacts function called");
        contactList.innerHTML = '';

        let currentLetter = '';
        contacts.forEach(contact => {
            let sortingKeyFirstLetter = contact.sorting_key.charAt(0).toUpperCase();
            console.log("Processing contact: ", contact);

            // Create a new sticky header if the first letter changes
            if (sortingKeyFirstLetter !== currentLetter) {
                currentLetter = sortingKeyFirstLetter;
                const headerElement = document.createElement('div');
                headerElement.className = 'sticky-header';
                headerElement.textContent = currentLetter;
                contactList.appendChild(headerElement);
                console.log("Added sticky header: ", currentLetter);
            }

            let displayName = contact.organization || contact.last_name || contact.first_name || contact.email_address || contact.phone_number;
            if (contact.organization && contact.last_name && contact.first_name) {
                displayName = `${contact.first_name} ${contact.last_name} ${contact.organization}`;
            }

            const contactElement = document.createElement('div');
            contactElement.className = 'contact';
            contactElement.dataset.contactId = contact.id;
            contactElement.addEventListener('click', () => showUpdateForm(contact));

            const contactNameElement = document.createElement('div');
            contactNameElement.className = 'contact-name';
            contactNameElement.textContent = displayName;

            const contactDetailsElement = document.createElement('div');
            contactDetailsElement.className = 'contact-details';
            contactDetailsElement.innerHTML = `
                <div>${contact.email_address || ''}</div>
                <div>${contact.phone_number || ''}</div>
            `;

            contactElement.appendChild(contactNameElement);
            contactElement.appendChild(contactDetailsElement);
            contactList.appendChild(contactElement);
            console.log("Added contact element: ", displayName);
        });
    }
    
    // Handle search functionality
    searchBar.addEventListener('input', function() {
        const query = searchBar.value.toLowerCase();
        const contacts = document.querySelectorAll('.contact');
        contacts.forEach(contact => {
            const contactText = contact.textContent.toLowerCase();
            if (contactText.includes(query)) {
                contact.style.display = 'block';
            } else {
                contact.style.display = 'none';
            }
        });
    });

    // Handle panel functionality for the "Add Contact" section
    addContactButton.addEventListener('click', () => {
        currentContactId = null;
        wrapper.classList.toggle('side-panel-open');
        searchSection.classList.toggle('search-section-full');
        contactForm.reset();
        document.querySelector('.contact-form-title').textContent = 'Contact Form';
        document.querySelector('.contact-button').textContent = 'Add';
    });

    closePopupButton.addEventListener('click', () => {
        wrapper.classList.remove('side-panel-open');
        searchSection.classList.add('search-section-full');
    });

    // Handle form submission for both adding and updating contact
    contactForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const formData = new FormData(contactForm);
        const contactData = {
            organization: formData.get('organization'),
            last_name: formData.get('last_name'),
            first_name: formData.get('first_name'),
            phone_number: formData.get('phone_number'),
            email_address: formData.get('email_address'),
            user_id: localStorage.getItem('user_id')
        };
    
        const url = currentContactId ? "LAMPAPI/update.php" : "LAMPAPI/add.php";
        if (currentContactId) contactData.id = currentContactId;
    
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(contactData),
            });
    
            const data = await response.json();
    
            if (data.error) {
                handleErrors(data.error);
            } else {
                // Clear form and errors if submission is successful
                contactForm.reset();
                clearErrors();
                // Reload contacts
                loadContacts();
                wrapper.classList.remove('side-panel-open');
                searchSection.classList.add('search-section-full');
            }
        } catch (error) {
            console.error("Error:", error);
        }
    });
    
    function handleErrors(errors) {
        clearErrors();
        const errorMessage = errors.join('\n');
        
        // Display all errors at the bottom of the form
        const bottomErrorFeedback = document.getElementById('bottomErrorFeedback');
        if (bottomErrorFeedback) {
            bottomErrorFeedback.textContent = errorMessage;
            bottomErrorFeedback.style.display = 'block';
        }

        // Mark relevant fields as invalid
        errors.forEach(error => {
            if (error.includes('Either phone number or email')) {
                markFieldAsInvalid('phone_number');
                markFieldAsInvalid('email_address');
            } else if (error.includes('first name, last name, or organization')) {
                markFieldAsInvalid('first_name');
                markFieldAsInvalid('last_name');
                markFieldAsInvalid('organization');
            } else {
                const field = getFieldFromError(error);
                markFieldAsInvalid(field);
            }
        });
    }

    function markFieldAsInvalid(fieldId) {
        const field = document.getElementById(fieldId);
        if (field) {
            field.classList.add("is-invalid");
        }
    }

    function getFieldFromError(error) {
        if (error.includes('Invalid email format')) return 'email_address';
        if (error.includes('Phone number must be at least 10 digits long')) return 'phone_number';
        if (error.includes('Phone number already exists')) return 'phone_number';
        if (error.includes('Email address already exists')) return 'email_address';
        if (error.includes('Organization must contain only letters and numbers')) return 'organization';
        if (error.includes('Last name must contain only letters and numbers')) return 'last_name';
        if (error.includes('First name must contain only letters and numbers')) return 'first_name';
        return '';
    }

    function clearErrors() {
        const fields = ['organization', 'last_name', 'first_name', 'phone_number', 'email_address'];
        fields.forEach(field => {
            const inputField = document.getElementById(field);
            if (inputField) {
                inputField.classList.remove("is-invalid");
            }
        });

        const bottomErrorFeedback = document.getElementById('bottomErrorFeedback');
        if (bottomErrorFeedback) {
            bottomErrorFeedback.textContent = '';
            bottomErrorFeedback.style.display = 'none';
        }
    }
    
    function showUpdateForm(contact) {
        currentContactId = contact.id;
        wrapper.classList.add('side-panel-open');
        searchSection.classList.remove('search-section-full');
        document.querySelector('.contact-form-title').textContent = 'Contact Form';
        document.querySelector('.contact-button').textContent = 'Update';

        document.getElementById('organization').value = contact.organization || '';
        document.getElementById('last_name').value = contact.last_name || '';
        document.getElementById('first_name').value = contact.first_name || '';
        document.getElementById('phone_number').value = contact.phone_number || '';
        document.getElementById('email_address').value = contact.email_address || '';
    }

    // Initial load of contacts
    loadContacts();
});