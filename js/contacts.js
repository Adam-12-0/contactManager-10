document.addEventListener("DOMContentLoaded", function() {
    const contactList = document.getElementById("contact-list");
    const searchBar = document.getElementById("search-bar");
    const addContactButton = document.getElementById("add-contact-button");
    const addContactPopup = document.getElementById("add-contact-popup");
    const closePopupButton = document.getElementById("close-popup-button");
    const addContactForm = document.getElementById("add-contact-form");
    const contactPage = document.getElementById("contact-page");
    const wrapper = document.querySelector('.wrapper');

    // Load contacts from the API
    function loadContacts() {
        fetch('http://localhost/contactManager-10/LAMPAPI/load.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id: localStorage.getItem('user_id') })
        })
        .then(response => response.json())
        .then(data => {
            if(data.contacts) {
                renderContacts(data.contacts);
            } else {
                console.error('Error: No contacts returned');
            }
        })
        .catch(error => console.error('Error:', error));
    }

    // Render contacts to the DOM
    function renderContacts(contacts) {
        contactList.innerHTML = '';

        let currentLetter = '';
        contacts.forEach(contact => {
            let displayName = contact.organization || contact.last_name || contact.first_name || contact.email_address || contact.phone_number;
            if (contact.organization && contact.last_name && contact.first_name) {
                displayName = `${contact.first_name} ${contact.last_name} ${contact.organization}`;
            }

            const contactElement = document.createElement('div');
            contactElement.className = 'contact';
            
            const contactNameElement = document.createElement('div');
            contactNameElement.className = 'contact-name';
            contactNameElement.textContent = displayName;
            
            const contactDetailsElement = document.createElement('div');
            contactDetailsElement.className = 'contact-details';
            contactDetailsElement.innerHTML = `
                <div>${contact.email_address || ''}</div>
                <div>${contact.phone_number || ''}</div>
            `;
            
            if (contact.email_address && contact.phone_number) {
                contactElement.style.height = '40px';
            } else {
                contactElement.style.height = '20px';
            }

            contactElement.appendChild(contactNameElement);
            contactElement.appendChild(contactDetailsElement);
            contactList.appendChild(contactElement);
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
        wrapper.classList.toggle('side-panel-open');
    });

    closePopupButton.addEventListener('click', () => {
        wrapper.classList.remove('side-panel-open');
    });

    // Handle add contact form submission
    addContactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(addContactForm);
        const contactData = {
            organization: formData.get('organization'),
            last_name: formData.get('last_name'),
            first_name: formData.get('first_name'),
            phone_number: formData.get('phone_number'),
            email_address: formData.get('email_address'),
            user_id: localStorage.getItem('user_id')
        };

        fetch('http://localhost/contactManager-10/LAMPAPI/add.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contactData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                addContactPopup.classList.remove('show');
                contactPage.classList.remove('with-popup');
                loadContacts();
            }
        })
        .catch(error => console.error('Error:', error));
    });

    // Initial load of contacts
    loadContacts();
});
