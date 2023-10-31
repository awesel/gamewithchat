// Your Firebase configuration
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
const messagesDiv = document.getElementById("messages");
const usernameInput = document.getElementById("usernameInput");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");

// Send message to Firestore
sendButton.addEventListener("click", function () {
  const username = usernameInput.value.trim();
  const text = messageInput.value.trim();

  if (username && text) {
    db.collection("messages").add({
      username: username,
      text: text,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    messageInput.value = "";
  } else {
    if (!username) alert("Please enter a username.");
    if (!text) alert("Message cannot be empty.");
  }
});

// Display messages from Firestore
db.collection("messages")
  .orderBy("timestamp")
  .onSnapshot((snapshot) => {
    messagesDiv.innerHTML = "";
    snapshot.forEach((doc) => {
      const message = doc.data();
      const messageBox = document.createElement("div");
      messageBox.classList.add(
        "bg-white",
        "p-3",
        "my-2",
        "rounded-md",
        "shadow-md"
      );

      const formattedMessage = `<span class="font-bold underline">${message.username}</span>: ${message.text}`;
      const timestamp = new Date(message.timestamp?.toDate()).toLocaleString(); // Convert Firestore timestamp to JS Date and then format as string
      const timestampSpan = `<span class="float-right text-gray-500 text-sm">${timestamp}</span>`;

      messageBox.innerHTML = formattedMessage + timestampSpan;

      messagesDiv.appendChild(messageBox);
    });

    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });

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
      db.collection("highFives").doc("count").set({ value: 0 });
    }
  });

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
