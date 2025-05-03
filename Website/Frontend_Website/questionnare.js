const redirectButton = document.getElementsByClassName('qsubmit-btn')[0];

redirectButton.addEventListener('click', () => {
  const fields = ['puzzles','design','code','interactive','animations','structure'];
  const answers = fields.map((name, idx) => {
    const val = document.querySelector(`input[name="${name}"]:checked`);
    return { question: idx + 1, answer: val ? val.value : 'no' };
  });

  // 🧠 Save to localStorage
  localStorage.setItem('student_answers', JSON.stringify(answers));

  // 🚪 Redirect
  window.location.href = 'recommends.html';
});
