document.addEventListener('DOMContentLoaded', () => {
    // Target the specific IDs inside login.html
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const authMessage = document.getElementById('authMessage');
    const formToggle = document.getElementById('form-toggle'); // Fixed: 'form-toggle'

    // Reusable function to display success/error alerts
    function showMessage(message, type) {
        if (!authMessage) return;
        authMessage.textContent = message;
        authMessage.className = `auth-message ${type}`;
        authMessage.style.display = 'block';

        // Hide the message after 3 seconds
        setTimeout(() => {
            authMessage.style.display = 'none';
        }, 3000);
    }

    // Handle signup form submission
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('signupName').value;      // Fixed: 'signupName'
            const email = document.getElementById('signupEmail').value;    // Fixed: added email
            const password = document.getElementById('signupPassword').value; // Fixed: removed duplicate

            // Check if email already exists in browser storage
            if (localStorage.getItem(email)) {
                showMessage('Email already exists. Please use a different email.', 'error');
                return;
            }

            // Save user to local storage
            const user = { name: name, password: password };
            localStorage.setItem(email, JSON.stringify(user));
            showMessage('Signup successful! You can now sign in.', 'success');
            signupForm.reset();

            // Uncheck the css toggle after 1.5s to reveal login view
            setTimeout(() => {
                if (formToggle) formToggle.checked = false;
            }, 1500);
        });
    }

    // Handle signin form submission
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            // Retrieve user from local storage
            const storedUserData = localStorage.getItem(email);
            if (storedUserData) { // Fixed: inverted logic
                const user = JSON.parse(storedUserData);

                // Validate password
                if (user.password === password) {
                    showMessage(`Welcome back, ${user.name}! Redirecting...`, 'success');
                    localStorage.setItem('currentUser', user.name);

                    // Redirect to the home page
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1500);
                } else {
                    showMessage('Incorrect password. Please try again.', 'error');
                }
            } else {
                showMessage('No account found with this email. Please sign up.', 'error');
            }
        });
    }
});

