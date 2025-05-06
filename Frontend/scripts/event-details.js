document.addEventListener('DOMContentLoaded', async function() {
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get("id");

  if (!eventId) {
      document.getElementById("event-container").innerHTML = "<p>Event not found.</p>";
      return;
  }

  try {
      const res = await fetch(`http://localhost:3000/api/events/${eventId}`);
      if (!res.ok) throw new Error("Event not found");
      const data = await res.json();
      const event = data.event || data; // adjust based on your backend response

      // Fill in the details
      document.getElementById("event-image").src = event.image || "../photos/LECTURES.jpeg";
      document.getElementById("event-title").textContent = event.title;
      document.getElementById("event-date").innerHTML = `<i class="fas fa-calendar-alt"></i> ${event.date}`;
      document.getElementById("event-location").innerHTML = `<i class="fas fa-map-marker-alt"></i> ${event.venue_name || event.venue_id}`;
      document.getElementById("event-description").innerHTML = "<b>Event Description:</b> " + event.description;
      document.getElementById("event-price").innerHTML = `<strong>Price:</strong> ${event.price || 'Free'}`;
  } catch (err) {
      document.getElementById("event-container").innerHTML = "<p>Event not found.</p>";
  }

  document.getElementById("register-btn").addEventListener("click", async function() {
    const eventId = urlParams.get("id");
    const token = localStorage.getItem('jwtToken');
    const userRole = localStorage.getItem('userRole'); // or get it from your user object

    const res = await fetch(`http://localhost:3000/api/registerations/${eventId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      }
    });

    // Optionally handle the response here
    if (res.ok) {
      alert("Registration successful!");
    } else {
      alert("Registration failed: " + (await res.text()));
    }
  });
});

