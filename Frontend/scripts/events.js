//this is a temporary file to store events
//will be removed later

// const events = [
//     {
//       id: 1,
//       title: "Technology Lecture Series",
//       date: "March 15, 2025",
//       venue: "Tech Auditorium",
//       image: "../photos/LECTURES.jpeg",
//       description: "A full deep dive into the latest technological advancements...",
//       price: "$50",
//     },
//     {
//       id: 2,
//       title: "Creative Writing Workshop",
//       date: "March 20, 2025",
//       venue: "Downtown Library",
//       image: "../photos/workshops.jpg",
//       description: "A hands-on experience to improve your creative writing...",
//       price: "Free",
//     },
//     {
//       id: 3,
//       title: "Corporate Marketing Summit",
//       date: "March 25, 2025",
//       venue: "City Convention Center",
//       image: "../photos/Certified\ Marketing\ Professional®\ \(CMP\)\ Course.jpg",
//       description: "Network with industry professionals and learn new marketing strategies...",
//       price: "$100",
//     },
//   ];

// export {events};

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