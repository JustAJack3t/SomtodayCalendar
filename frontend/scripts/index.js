// Document variables
const logo = document.getElementById("logo");
const calendarBtn = document.getElementById("calendarBtn");
const homeBtn = document.getElementById("homeBtn");
const homeworkBtn = document.getElementById("homeworkBtn");
const homeScreen = document.getElementById("homeScreen");
const homeWorkScreen = document.getElementById("homeWorkScreen");
const calendarScreen = document.getElementById("calendarScreen");


// Event listeners
logo.addEventListener("click", () => {
    document.querySelector(".active")?.classList.remove("active");
    homeScreen.classList.add("active");
});

calendarBtn.addEventListener("click", () => {
    document.querySelector(".active")?.classList.remove("active");
    calendarScreen.classList.add("active");
});

homeBtn.addEventListener("click", () => {
    document.querySelector(".active")?.classList.remove("active");
    homeScreen.classList.add("active");
});

homeworkBtn.addEventListener("click", () => {
    document.querySelector(".active")?.classList.remove("active");
    homeWorkScreen.classList.add("active");
});

// CALENDAR
const PIXELS_PER_MIN = 1; // 1 minute = 1px (so 60px = 1hr)

function addEvent(day, start, end, title) {
  const dayColumn = document.querySelector(`.day[dayName="${day}"]`);

  // Convert "HH:MM" to minutes
  function toMinutes(time) {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  }

  const startMin = toMinutes(start);
  const endMin = toMinutes(end);

  const event = document.createElement("div");
  event.classList.add("event");
  event.style.top = (startMin + 60) * PIXELS_PER_MIN + "px"; 
  // assuming calendar starts at 08:00 (480 min from midnight)
  event.style.height = (endMin - startMin) * PIXELS_PER_MIN + "px";
  event.textContent = title;

  dayColumn.appendChild(event);
}

// Example usage
addEvent("monday", "09:30", "11:00", "Team Meeting");
addEvent("wednesday", "13:00", "14:30", "Doctor Appointment");