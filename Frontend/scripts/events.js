
async function fetchEvents() {
  const res = await fetch('http://localhost:3000/api/events');
  const data = await res.json();

  const container = document.getElementById("event-cards");
  container.innerHTML = ""; // clear existing

  data.events.forEach(event => {        //events is the array returned by the backend
    const card = document.createElement("div");
    card.classList.add("event-card");

    // Assume image file is named after event ID or title
    // const imagePath = `photos/events/${event.id || sanitize(event.title)}.jpg`;

    card.innerHTML = `
      <div class="event-card">
                    <div class="event-img" style="background-image: url('../photos/LECTURES.jpeg')"></div>
                    <div class="event-content">
                        <h3>${event.title}</h3>
                        <div class="event-meta">
                            <div><i>📅</i> ${event.date}</div>
                            <div><i>📍</i> ${event.venue_id}</div>
                        </div>
                        <p>${event.description}</p>
                        <div class="event-actions">
                            <a href="event-details.html?id=${event.id}" class="btn btn-outline">Learn More</a>
                            <div class="event-price">$50</div>
                        </div>
                    </div>
      </div>
    `;

    container.appendChild(card);
  });
}
fetchEvents();