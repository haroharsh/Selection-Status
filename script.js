const enrollmentInput = document.getElementById("Enrollment");
const checkButton = document.getElementById("btn");

function showMessage(message, type) {
  let messageDiv = document.getElementById("message");
  if (!messageDiv) {
    messageDiv = document.createElement("div");
    messageDiv.id = "message";
    const loginElement = document.querySelector(".login");
    if (loginElement) {
      loginElement.appendChild(messageDiv);
    } else {
      document.body.appendChild(messageDiv);
    }
  }
  messageDiv.textContent = message;
  messageDiv.className = `message ${type}`;
  messageDiv.style.display = "block";
}

checkButton.addEventListener("click", function () {
  const enrollmentNo = enrollmentInput.value.trim();

  if (!enrollmentNo) {
    showMessage("Please enter your enrollment number", "error");
    return;
  }

  if (enrollmentNo.length !== 9 || !/^[0-9]+$/.test(enrollmentNo)) {
    showMessage("Please enter a valid 9-digit enrollment number", "error");
    return;
  }

  const selectedStudents = [
    "123456789",
    "987654321",
    "111111111",
    "222222222",
    "241030093",
  ];
  const isSelected = selectedStudents
    .map((student) => student === enrollmentNo)
    .includes(true);

  if (isSelected) {
    showMessage("Congratulations! You have been selected.", "success");
  } else {
    showMessage("Sorry, you were not selected this time.", "info");
  }
});
