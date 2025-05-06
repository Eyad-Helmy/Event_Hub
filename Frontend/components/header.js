// Header Component
export function createHeader() {
    const header = `
    <header>
        <div class="container">
            <div class="header-content">
                <a href="../../views/index.html" class="logo">
                    <i>📅</i> EventHub
                </a>
                <nav>
                    <ul>
                        <li><a href="../../views/index.html">Home</a></li>
                        <li><a href="../../views/events.html">Events</a></li>
                        <li><a href="../../views/venues.html">Venues</a></li>
                        <li><a href="../../views/about.html">About</a></li>
                        <li><a href="../../views/contact.html">Contact</a></li>
                        <li id="profileNav" style="display:none;"><a href="../../views/profile.html">Profile</a></li>
                        <li id="attendeeDashboardNav" style="display:none;"><a href="../../views/attendee/dashboard.html">Attendee Dashboard</a></li>
                        <li id="organizerDashboardNav" style="display:none;"><a href="../../views/organizer/dashboard.html">Organizer Dashboard</a></li>
                    </ul>
                </nav>
                <div class="user-actions">
                    <button class="btn btn-outline" id="loginBtn">Log In</button>
                    <button class="btn btn-primary" id="signupBtn">Sign Up</button>
                    <button class="btn btn-primary" id="logoutBtn" style="display: none;">Log Out</button>
                </div>
            </div>
        </div>
    </header>`;

    return header;
}

// Header functionality
export function initializeHeader() {
    // Prevent scroll restoration
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

    // Hide content until header is loaded
    document.body.style.visibility = 'hidden';
    
    const token = localStorage.getItem('jwtToken');
    const profileNav = document.getElementById('profileNav');
    const attendeeDashboardNav = document.getElementById('attendeeDashboardNav');
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const organizerDashboardNav = document.getElementById('organizerDashboardNav');
    const organizerDashboardLabel = document.getElementById('organizerDashboardLabel');

    if (token) {
        // Fetch user info to check role
        fetch('http://localhost:3000/api/users/me', {
            headers: { 
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(user => {
            if (profileNav) profileNav.style.display = 'inline-block';
            if (loginBtn) loginBtn.style.display = 'none';
            if (signupBtn) signupBtn.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'inline-block';
            
            // Show attendee dashboard only for attendees
            if (attendeeDashboardNav) {
                attendeeDashboardNav.style.display = user.user.active_role === 'attendee' ? 'inline-block' : 'none';
            }
            // Show organizer dashboard only for organizers and set username
            if (organizerDashboardNav) {
                if (user.user.active_role === 'organizer') {
                    organizerDashboardNav.style.display = 'inline-block';
                    if (organizerDashboardLabel) {
                        organizerDashboardLabel.textContent = user.user.username + "'s Dashboard";
                    }
                } else {
                    organizerDashboardNav.style.display = 'none';
                }
            }
            // Show content after header is loaded
            document.body.style.visibility = 'visible';
            window.scrollTo(0, 0);
        })
        .catch(() => {
            // If fetch fails, hide everything
            if (profileNav) profileNav.style.display = 'none';
            if (attendeeDashboardNav) attendeeDashboardNav.style.display = 'none';
            if (loginBtn) loginBtn.style.display = 'inline-block';
            if (signupBtn) signupBtn.style.display = 'inline-block';
            if (logoutBtn) logoutBtn.style.display = 'none';
            // Show content after header is loaded
            document.body.style.visibility = 'visible';
            window.scrollTo(0, 0);
        });
    } else {
        if (profileNav) profileNav.style.display = 'none';
        if (attendeeDashboardNav) attendeeDashboardNav.style.display = 'none';
        if (loginBtn) loginBtn.style.display = 'inline-block';
        if (signupBtn) signupBtn.style.display = 'inline-block';
        if (logoutBtn) logoutBtn.style.display = 'none';
        // Show content after header is loaded
        document.body.style.visibility = 'visible';
        window.scrollTo(0, 0);
    }

    // Setup logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('jwtToken');
            window.location.href = '../../index.html';
        });
    }

    // Remove My Events button if it exists
    const myEventsBtn = document.getElementById('myEventsNav');
    if (myEventsBtn) myEventsBtn.remove();
} 