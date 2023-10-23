// 1. makeButton

function makeButton(buttonText) {
  let btn = document.createElement("button");
  btn.innerHTML = buttonText;
  btn.addEventListener("click", function () {
    alert("Button clicked!");
  });
  document.body.appendChild(btn);
}

// 2. makeAlert
function makeAlert(message) {
  alert(message);
}

// 3. makeHeader
function makeHeader(headerText) {
  let header = document.createElement("h1");
  header.innerHTML = headerText;
  document.body.appendChild(header);
}

// 4. makeSubHeader
function makeSubHeader(subHeaderText, id) {
  let subHeader = document.createElement("h2");
  subHeader.innerHTML = subHeaderText;
  if (id) {
    subHeader.id = id;
  }
  document.body.appendChild(subHeader);
}

// 5. changeTextOfSubheader
function changeTextOfSubheader(id, newText) {
  let subHeader = document.getElementById(id);
  if (subHeader) {
    subHeader.innerHTML = newText;
  } else {
    console.error("No element found with the given ID.");
  }
}
// 6. makeButtonToChangeSubheader
function makeButtonToChangeSubheader(buttonText, subheaderId, newText) {
  let btn = document.createElement("button");
  btn.innerHTML = buttonText;
  btn.addEventListener("click", function () {
    changeTextOfSubheader(subheaderId, newText);
  });
  document.body.appendChild(btn);
}
// 7. makeToggleButtonForSubheader
function makeToggleButtonForSubheader(buttonText, subheaderId, text1, text2) {
  let btn = document.createElement("button");
  btn.innerHTML = buttonText;

  btn.addEventListener("click", function () {
    let subHeader = document.getElementById(subheaderId);
    if (subHeader) {
      if (subHeader.innerHTML === text1) {
        subHeader.innerHTML = text2;
      } else {
        subHeader.innerHTML = text1;
      }
    } else {
      console.error("No element found with the given ID.");
    }
  });

  document.body.appendChild(btn);
}
// 9. makeButtonToChangeColorOfSubheader
function makeButtonToChangeColorOfSubheader(buttonText, subheaderId, color) {
  let btn = document.createElement("button");
  btn.innerHTML = buttonText;
  btn.addEventListener("click", function () {
    changeColorOfSubheader(subheaderId, color);
  });
  document.body.appendChild(btn);
}
function changeColorOfSubheader(id, color) {
  // Get the subheader using its ID
  let subHeader = document.getElementById(id);

  // Check if the subheader exists
  if (subHeader) {
    // Set the color
    subHeader.style.color = color;
  } else {
    // Log an error if the subheader isn't found
    console.error("No element found with the given ID: " + id);
  }
}

makeButton("Click me!"); // This will append a button with text "Click me!" to the body.
makeHeader("This is a header!"); // This will append an h1 header with text "This is a header!" to the body.
makeSubHeader("This is a subheader!", "mySubHeader"); // This will append an h2 subheader with text "This is a subheader!" and ID "mySubHeader" to the body.
makeToggleButtonForSubheader(
  "Toggle subheader text",
  "mySubHeader",
  "New text for subheader.",
  "This is a subheader!"
);
makeButtonToChangeColorOfSubheader("make subheader red", "mySubHeader", "red");
makeButtonToChangeColorOfSubheader(
  "make subheader blue",
  "mySubHeader",
  "blue"
);
