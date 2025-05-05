import { events } from "./events.js";

const urlParams = new URLSearchParams(window.location.search);
const eventId = parseInt(urlParams.get("id"));
// console.log(eventId)

const event = events.find(e => e.id === eventId);

if (event) {
    document.getElementById("event-image").src = event.image;
    document.getElementById("event-title").textContent = event.title;
    document.getElementById("event-date").textContent = `Date: ${event.date}`;
    document.getElementById("event-location").textContent = `Venue: ${event.venue}`;
    document.getElementById("event-description").textContent = event.description;
    document.getElementById("event-price").textContent = `Price: ${event.price}`;
  } else {
    document.getElementById("event-container").innerHTML = "<p>Event not found.</p>";
  }