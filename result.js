document.addEventListener('DOMContentLoaded', function() {
  const enrollmentNo = localStorage.getItem('enrollmentNo');
  const resultContainer = document.querySelector('.result-container');
  
  if (!enrollmentNo) {
    window.location.href = 'index.html';
    return;
  }
  
  const isSelected = localStorage.getItem('isSelected') === 'true';
  
  if (isSelected) {
    resultContainer.innerHTML = `
      <div class="message success">
        Congratulations! <br> Enrollment No: ${enrollmentNo} - You have been selected for SIAM!
      </div>
      <button class="home-btn" onclick="goHome()">Go Home</button>
    `;
  } else {
    resultContainer.innerHTML = `
      <div class="message rejected">
        Sorry! <br> Enrollment No: ${enrollmentNo} - You have not been selected this time.
        <br><br>Keep trying and best of luck for next time!
      </div>
      <button class="home-btn" onclick="goHome()">Go Home</button>
    `;
  }
});

function goHome() {
  localStorage.clear();
  window.location.href = 'index.html';
}