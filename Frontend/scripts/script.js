document.addEventListener('DOMContentLoaded', () => {
    setupModals();
    setupFormValidation();
    // loadFeaturedEvents();
    setupNavigationLinks();
    // setupSearch();
});

function setupModals() {
    const modals = {
        login: document.getElementById('loginModal'),
        signup: document.getElementById('signupModal'),
        forgotPassword: document.getElementById('forgotPasswordModal')
    };

    const triggers = {
        login: document.getElementById('loginBtn'),
        signup: document.getElementById('signupBtn'),
        forgotPassword: document.getElementById('forgotPasswordLink'),
        loginLink: document.getElementById('loginLink'),
        signupLink: document.getElementById('signupLink')
    };

    const closeButtons = document.querySelectorAll('.modal-close');

    triggers.login.addEventListener('click', () => show(modals.login));
    triggers.signup.addEventListener('click', () => show(modals.signup));
    triggers.forgotPassword.addEventListener('click', (e) => {
        e.preventDefault();
        hide(modals.login);
        show(modals.forgotPassword);
    });
    triggers.loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        hide(modals.signup);
        show(modals.login);
    });
    triggers.signupLink.addEventListener('click', (e) => {
        e.preventDefault();
        hide(modals.login);
        show(modals.signup);
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            hide(modals.login);
            hide(modals.signup);
            hide(modals.forgotPassword);
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target === modals.login) {
            hide(modals.login);
        }
        if (e.target === modals.signup) {
            hide(modals.signup);
        }
        if (e.target === modals.forgotPassword) {
            hide(modals.forgotPassword);
        }
    });

    function show(modal) {
        modal.style.display = 'flex';
    }

    function hide(modal) {
        modal.style.display = 'none';
    }
}

function setupNavigationLinks() {
    const navLinks = document.querySelectorAll('nav ul li a');
    const homeLink = document.querySelector('a.logo');
    const footerLinks = document.querySelectorAll('footer a');
    const categoryLinks = document.querySelectorAll('.category-content a');
    const eventLinks = document.querySelectorAll('.event-actions a');

    [...navLinks, ...footerLinks, ...categoryLinks, ...eventLinks].forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            handleNavigation(link.getAttribute('href'));
        });
    });

    homeLink && homeLink.addEventListener('click', (e) => {
        e.preventDefault();
        handleNavigation('index.html');
    });
}

function handleNavigation(url) {
    console.log(`Navigating to: ${url}`);
    window.location.href = url;
}
//comment 34wa2y
function setupFormValidation() {
    const forms = {
        login: document.getElementById('loginForm'),
        signup: document.getElementById('signupForm'),
        // forgotPassword: document.getElementById('forgotPasswordForm')
    };

    forms.login && forms.login.addEventListener('submit', handleLogin);
    forms.signup && forms.signup.addEventListener('submit', handleSignup);
    // forms.forgotPassword && forms.forgotPassword.addEventListener('submit', handleForgotPassword);       function not implemented yet due to needing backend functionality
}

async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (!email || !password) {
        alert('Please fill in all fields.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('jwtToken', data.token);
            alert('Login successful!');
            window.location.reload();
        } else {
            alert(data.message || 'Login failed.');
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred. Please try again.');
    }
}

async function handleSignup(event) {
    event.preventDefault();
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value.trim();
    const role = document.getElementById('signupRole').value;

    if (!name || !email || !password || !role) {
        alert('Please fill in all fields.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: name, email, password, role })
        });

        const data = await response.json();
        if (response.ok) {
            alert('Registration successful! You can now log in.');
            document.getElementById('signupModal').style.display = 'none';
            document.getElementById('loginModal').style.display = 'flex';
        } else {
            alert(data.message || 'Registration failed.');
        }
    } catch (error) {
        console.error('Error during registration:', error);
        alert('An error occurred. Please try again.');
    }
}