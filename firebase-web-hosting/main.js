const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "personalwebsite-andrew",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// DOM Elements
const highFiveCountDisplay = document.getElementById("highFiveCount");
const highFiveButton = document.getElementById("highFiveButton");

// Fetch the current high five count on page load
db.collection("highFives")
  .doc("count")
  .get()
  .then((doc) => {
    if (doc.exists) {
      const count = doc.data().value;
      updateHighFiveDisplay(count);
    } else {
      // Initialize count if it doesn't exist
      db.collection("highFives").doc("count").set({ value: 0 });
    }
  });

// Update Firestore and local display when the "High Five" button is pressed
highFiveButton.addEventListener("click", function () {
  const docRef = db.collection("highFives").doc("count");
  docRef
    .update({
      value: firebase.firestore.FieldValue.increment(1),
    })
    .then(() => {
      docRef.get().then((doc) => {
        updateHighFiveDisplay(doc.data().value);
      });
    });
});

function updateHighFiveDisplay(count) {
  highFiveCountDisplay.textContent = "High Fives: " + count;
}
