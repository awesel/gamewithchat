class Main {
  constructor() {
    // Check if localStorage has a 'counter' key, if not set it to 0
    this.counter = localStorage.getItem("counter")
      ? parseInt(localStorage.getItem("counter"))
      : 0;

    // Increment the counter for each page view
    this.incrementCounter();

    // Display the initial count
    document.getElementById("count").innerText = "views: " + this.counter;

    // Event Bindings
    this.bindEvents();

    // Load any custom settings or methods
    this.loadCustomFeatures();
  }

  incrementCounter() {
    this.counter++;
    localStorage.setItem("counter", this.counter);
    document.getElementById("count").innerText = "views: " + this.counter;
  }

  // 1. Event Bindings
  bindEvents() {
    // Event listener for incrementing counter
    document.getElementById("incrementButton").addEventListener("click", () => {
      this.incrementCounter();
    });

    // Event listener for resetting counter
    document.getElementById("resetButton").addEventListener("click", () => {
      this.resetCounter();
    });
  }

  // 2. Custom Functions
  // Function to reset counter
  resetCounter() {
    this.counter = 0;
    localStorage.setItem("counter", this.counter);
    document.getElementById("count").innerText = "views: " + this.counter;
  }

  // Function to log the current counter
  logCounter() {
    console.log(`Current counter value: ${this.counter}`);
  }

  // Function to display a greeting message based on the counter
  loadCustomFeatures() {
    const messageElement = document.getElementById("message");
    if (this.counter <= 5) {
      messageElement.innerText = "Thanks for visiting a few times!";
    } else if (this.counter > 5 && this.counter <= 15) {
      messageElement.innerText = "You seem to like this page. Keep visiting!";
    } else {
      messageElement.innerText = "Wow! You are a regular visitor here!";
    }
  }
}

// Initialize the Main class
document.addEventListener("DOMContentLoaded", () => {
  new Main();
});
