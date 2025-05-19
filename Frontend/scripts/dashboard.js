// Add event listener for My Events link
document.addEventListener('DOMContentLoaded', function() {
    // Sidebar navigation
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            const target = this.getAttribute('href');
            console.log('Sidebar link clicked:', target); // Debug log
            if (target && target.startsWith('#')) {
                e.preventDefault();
                // Hide all sections
                document.querySelectorAll('.dashboard-section').forEach(sec => sec.classList.remove('active'));
                // Show the target section
                const section = document.querySelector(target);
                if (section) section.classList.add('active');

                // If Attendee My Events, load attendee events
                if (target === '#my-events') {
                    console.log('Calling loadMyEvents()'); // Debug log
                    loadMyEvents();
                }
                // If Organizer My Events, load organizer events
                if (target === '#events') {
                    loadOrganizerEvents();
                }
                // If Organizer Dashboard, load organizer dashboard
                if (target === '#organizer-dashboard') {
                    loadOrganizerDashboard();
                }
                if (target === '#create-event') {
                    loadCreateEvent();
                }
                if (target === '#registrations') {
                    loadForOrganizerRegistrations();
                }
            }
        });
    });

    // Add click handler for Create Event button in events filter
    const createEventBtn = document.getElementById('createEventBtn');
    if (createEventBtn) {
        createEventBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Hide all sections
            document.querySelectorAll('.dashboard-section').forEach(sec => sec.classList.remove('active'));
            // Show create event section
            const createSection = document.getElementById('create-event');
            if (createSection) createSection.classList.add('active');
            // Load form logic
            loadCreateEvent();
        });
    }

    // Initial load (optional: show overview or my-events by default)
    // document.querySelector('.sidebar-nav a[href="#overview"]').click();

    // Show the correct dashboard section based on user role
    const token = localStorage.getItem('jwtToken');
    if (token) {
        fetch('http://localhost:3000/api/users/me', {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(user => {
            if (user.user.active_role === 'organizer') {
                // Show organizer dashboard section
                document.querySelectorAll('.dashboard-section').forEach(sec => sec.classList.remove('active'));
                const orgSection = document.getElementById('organizer-dashboard');
                if (orgSection) orgSection.classList.add('active');
            } else if (user.user.active_role === 'venue_admin') {
                // Show venue admin dashboard section
                document.querySelectorAll('.dashboard-section').forEach(sec => sec.classList.remove('active'));
                const venueSection = document.getElementById('venue-dashboard');
                if (venueSection) venueSection.classList.add('active');
                loadVenueAdminDashboard();
            } else if (user.user.active_role === 'attendee') {
                // Show attendee dashboard section (default overview)
                document.querySelectorAll('.dashboard-section').forEach(sec => sec.classList.remove('active'));
                const attSection = document.getElementById('overview');
                if (attSection) attSection.classList.add('active');
            }
        });
    }
});

function loadMyEvents() {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        window.location.href = '../../views/index.html';
        return;
    }
    fetch('http://localhost:3000/api/registrations/my-events', {
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

function loadOrganizerDashboard() {
    // Placeholder: implement organizer dashboard loading logic here
    // For now, just log
    console.log('Organizer dashboard loaded');
}

function loadOrganizerEvents() {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        window.location.href = '../../views/index.html';
        return;
    }
    fetch('http://localhost:3000/api/events/my', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(res => {
        if (!res.ok) throw new Error('Failed to fetch organizer events');
        return res.json();
    })
    .then(data => {
        const eventsList = document.querySelector('#events .events-list');
        if (eventsList && data.events && data.events.length > 0) {
            eventsList.innerHTML = data.events.map(event => `
                <div class="event-card">
                    <div class="event-img" style="background-image: url('../../photos/LECTURES.jpeg')"></div>
                    <div class="event-content">
                        <h3>${event.title}</h3>
                        <div class="event-meta">
                            <div><i class="fas fa-calendar"></i> ${event.date}</div>
                            <div><i class="fas fa-map-marker-alt"></i> ${event.venue_name || event.venue_id}</div>
                        </div>
                        <div class="event-actions">
                            <button onclick="editEvent('${event.id}')" class="btn btn-outline">Edit</button>
                            <button onclick="viewRegistrations('${event.id}')" class="btn btn-primary">View Registrations</button>
                            <button onclick="cancelEvent('${event.id}')" class="btn btn-danger">Cancel Event</button>
                        </div>
                    </div>
                </div>
            `).join('');
        } else if (eventsList) {
            eventsList.innerHTML = '<p class="error-message">No events found. Create your first event!</p>';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        const eventsList = document.querySelector('#events .events-list');
        if (eventsList) {
            eventsList.innerHTML = '<p class="error-message">Failed to load your events. Please try again later.</p>';
        }
    });
}

export async function loadCreateEvent() {
    // Placeholder: implement create event loading logic here
    console.log('Create event loaded');
    const form = document.getElementById('createEventForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('jwtToken');
        if (!token) {
            alert('You must be logged in to create an event.');
            return;
        }

        // Get form values
        const title = document.getElementById('eventTitle').value;
        const description = document.getElementById('eventDescription').value;
        const date = document.getElementById('eventDate').value;
        const venueId = document.getElementById('eventVenue').value;

        try {
            const response = await fetch('http://localhost:3000/api/events/create-event', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    description, 
                    date,
                    venueId
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create event');
            }

            const data = await response.json();
            alert('Event created successfully!');
            
            // Reset form
            form.reset();
            
            // Reload events list
            loadMyEvents();

        } catch (error) {
            console.error('Error creating event:', error);
            alert(error.message || 'Failed to create event. Please try again.');
        }
    });
}

export async function cancelRegistration(eventId) {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        alert('You must be logged in to cancel registration.');
        return;
    }
    if (!confirm('Are you sure you want to cancel your registration for this event?')) {
        return;
    }
    try {
        const res = await fetch(`http://localhost:3000/api/registrations/${eventId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to cancel registration');
        }
        alert('Registration cancelled successfully.');
        // Reload the events list
        loadMyEvents();
    } catch (error) {
        console.error('Error cancelling registration:', error);
        alert(error.message || 'An error occurred while cancelling registration.');
    }
}

function loadForOrganizerRegistrations() {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        window.location.href = '../../views/index.html';
        return;
    }
    fetch('http://localhost:3000/api/registerations/for-organizer', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(res => {
        if (!res.ok) throw new Error('Failed to fetch registrations');
        return res.json();
    })
    .then(data => {
        const tbody = document.querySelector('#registrations .registrations-table tbody');
        if (tbody && data.registrations && data.registrations.length > 0) {
            tbody.innerHTML = data.registrations.map(reg => `
                <tr>
                    <td>${reg.event_title || ''}</td>
                    <td>${reg.venue_name || ''}</td>
                    <td>${reg.attendee_email || ''}</td>
                    <td>${reg.date || ''}</td>
                    <td>${reg.status || ''}</td>
                </tr>
            `).join('');
        } else if (tbody) {
            tbody.innerHTML = '<tr><td colspan="5" class="error-message">No registrations found.</td></tr>';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        const tbody = document.querySelector('#registrations .registrations-table tbody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="5" class="error-message">Failed to load registrations. Please try again later.</td></tr>';
        }
    });
}

export async function cancelEvent(eventId) {
    if (!confirm('Are you sure you want to cancel this event?')) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/events/${eventId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to cancel event');
        }

        // Show success message
        alert('Event cancelled successfully');
        
        // Refresh the events list
        loadOrganizerEvents();
    } catch (error) {
        console.error('Error cancelling event:', error);
        alert(error.message || 'Failed to cancel event. Please try again.');
    }
}

function loadVenueAdminDashboard() {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        window.location.href = '../../views/index.html';
        return;
    }

    fetch('http://localhost:3000/api/venues/my', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(res => {
        if (!res.ok) throw new Error('Failed to fetch venue data');
        return res.json();
    })
    .then(data => {
        const venueList = document.querySelector('#venue-dashboard .venue-list');
        if (venueList && data.venues && data.venues.length > 0) {
            venueList.innerHTML = data.venues.map(venue => `
                <div class="venue-card">
                    <div class="venue-content">
                        <h3>${venue.name}</h3>
                        <div class="venue-meta">
                            <div><i class="fas fa-map-marker-alt"></i> ${venue.location}</div>
                            <div><i class="fas fa-users"></i> Capacity: ${venue.capacity}</div>
                        </div>
                        <div class="venue-actions">
                            <button onclick="editVenue('${venue.id}')" class="btn btn-outline">Edit Venue</button>
                            <button onclick="viewVenueBookings('${venue.id}')" class="btn btn-primary">View Bookings</button>
                        </div>
                    </div>
                </div>
            `).join('');
        } else if (venueList) {
            venueList.innerHTML = '<p class="error-message">No venues found. Add your first venue!</p>';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        const venueList = document.querySelector('#venue-dashboard .venue-list');
        if (venueList) {
            venueList.innerHTML = '<p class="error-message">Failed to load venue data. Please try again later.</p>';
        }
    });
}

// Add venue admin specific functions
export async function editVenue(venueId) {
    // Implement venue editing logic
    console.log('Editing venue:', venueId);
}

export async function viewVenueBookings(venueId) {
    // Implement venue bookings view logic
    console.log('Viewing bookings for venue:', venueId);
} 