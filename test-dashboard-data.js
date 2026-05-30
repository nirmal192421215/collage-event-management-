console.log("Checking dashboard state simulator...");
const user = { eventsRegistered: ["6a1a56c2422e88db7b338a71", "6a1a61937b22ec734ddc61c3", "6a1a5f67ae8955693f10d0e6"] };
const events = [
  { id: "6a1a56c2422e88db7b338a71", title: "Event 1" },
  { id: "6a1a61937b22ec734ddc61c3", title: "Event 2" },
  { id: "6a1a5f67ae8955693f10d0e6", title: "Event 3" }
];
const myEvents = events.filter(e => user.eventsRegistered.includes(e.id));
console.log("myEvents.length:", myEvents.length);
console.log("user.eventsRegistered.length:", user.eventsRegistered.length);
