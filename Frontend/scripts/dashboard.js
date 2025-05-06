// Add event listener for My Events link
document.addEventListener('DOMContentLoaded', function() {
    // Sidebar navigation
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            const target = this.getAttribute('href');
            if (target && target.startsWith('#')) {
                e.preventDefault();
                // Hide all sections
                document.querySelectorAll('.dashboard-section').forEach(sec => sec.classList.remove('active'));
                // Show the target section
                const section = document.querySelector(target);
                if (section) section.classList.add('active');

                // If My Events, load events
                if (target === '#my-events') {
                    loadMyEvents();
                }
            }
        });
    });

    // Initial load (optional: show overview or my-events by default)
    // document.querySelector('.sidebar-nav a[href="#overview"]').click();
});

function loadMyEvents() {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        window.location.href = '../../views/index.html';
        return;
    }
    fetch('http://localhost:3000/api/registerations/my-events', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(res => {
        if (!res.ok) throw new Error('Failed to fetch events');
        return res.json();
    })
    .then(data => {
        const eventsList = document.querySelector('#my-events .events-list');
        if (eventsList && data.events) {
            eventsList.innerHTML = data.events.map(event => `
                <div class="event-card">
                    <div class="event-img" style="background-image: url('../../photos/LECTURES.jpeg')"></div>
                    <div class="event-content">
                        <h3>${event.title}</h3>
                        <div class="event-meta">
                            <div><i class="fas fa-calendar"></i> ${event.date}</div>
                            <div><i class="fas fa-map-marker-alt"></i> ${event.venue_id}</div>
                        </div>
                        <div class="event-actions">
                            <button onclick="viewEventDetails('${event.id}')" class="btn btn-outline">View Details</button>
                            <button onclick="cancelRegistration('${event.id}')" class="btn btn-primary">Cancel Registration</button>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        const eventsList = document.querySelector('#my-events .events-list');
        if (eventsList) {
            eventsList.innerHTML = '<p class="error-message">Failed to load events. Please try again later.</p>';
        }
    });
} 