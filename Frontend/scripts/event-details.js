document.addEventListener('DOMContentLoaded', async function() {
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get("id");
  const eventContainer = document.getElementById("event-container");

  if (!eventId) {
    if (eventContainer) {
      eventContainer.innerHTML = "<p>Event not found.</p>";
    }
    return;
  }

  try {
    const res = await fetch(`http://localhost:3000/api/events/${eventId}`);
    if (!res.ok) throw new Error("Event not found");
    const data = await res.json();
    const event = data.event || data; // adjust based on your backend response

    // Fill in the details
    const elements = {
      image: document.getElementById("event-image"),
      title: document.getElementById("event-title"),
      date: document.getElementById("event-date"),
      location: document.getElementById("event-location"),
      description: document.getElementById("event-description"),
      price: document.getElementById("event-price"),
      registerBtn: document.getElementById("register-btn")
    };

    if (elements.image) elements.image.src = event.image || "../photos/LECTURES.jpeg";
    if (elements.title) elements.title.textContent = event.title;
    if (elements.date) elements.date.innerHTML = `<i class="fas fa-calendar-alt"></i> ${event.date}`;
    if (elements.location) elements.location.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${event.venue_name || event.venue_id}`;
    if (elements.description) elements.description.innerHTML = "<b>Event Description:</b> " + event.description;
    if (elements.price) elements.price.innerHTML = `<strong>Price:</strong> ${event.price || 'Free'}`;

    // Add registration button event listener if it exists
    if (elements.registerBtn) {
      elements.registerBtn.addEventListener("click", async function() {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          alert('Please log in to register for this event.');
          return;
        }

        if (!confirm('Are you sure you want to register for this event?')) {
          return;
        }

        try {
          const res = await fetch(`http://localhost:3000/api/registrations/${eventId}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            }
          });

          const data = await res.json();

          if (res.ok) {
            alert("Registration successful!");
            // Optionally disable the register button after successful registration
            elements.registerBtn.disabled = true;
            elements.registerBtn.textContent = "Registered";
          } else {
            throw new Error(data.message || "Registration failed");
          }
        } catch (error) {
          console.error('Registration error:', error);
          alert(error.message || "Registration failed. Please try again.");
        }
      });
    }
  } catch (err) {
    console.error('Error loading event:', err);
    if (eventContainer) {
      eventContainer.innerHTML = "<p>Failed to load event details. Please try again later.</p>";
    }
  }
});

