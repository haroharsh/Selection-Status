const enrollmentInput = document.getElementById("Enrollment");
const checkButton = document.getElementById("btn");

function showMessage(message, type) {
  let messageDiv = document.getElementById("message");
  if (!messageDiv) {
    messageDiv = document.createElement("div");
    messageDiv.id = "message";
    document.querySelector(".login").appendChild(messageDiv);
  }
  messageDiv.textContent = message;
  messageDiv.className = `message ${type}`;
}

checkButton.addEventListener("click", async function () {
  const enrollmentNo = enrollmentInput.value.trim();
  
  if (!enrollmentNo) {
    showMessage("Please enter your enrollment number", "error");
    return;
  }

  if (enrollmentNo.length !== 9 || !/^[0-9]+$/.test(enrollmentNo)) {
    showMessage("Please enter a valid 9-digit enrollment number", "error");
    return;
  }

  if (!enrollmentNo.startsWith('24') && !enrollmentNo.startsWith('25')) {
    showMessage("Incorrenct enrolment. Please try again!", "error");
    return;
  }

  try {
    const response = await fetch('students.json');
    const data = await response.json();
    const isSelected = data.selectedStudents.includes(enrollmentNo);
    
    localStorage.setItem('enrollmentNo', enrollmentNo);
    localStorage.setItem('isSelected', isSelected);
    window.location.href = "canva.html";
  } catch (error) {
    showMessage("Error checking selection status", "error");
  }
});