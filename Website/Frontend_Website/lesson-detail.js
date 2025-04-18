document.addEventListener("DOMContentLoaded", () => {
    // Retrieve the lesson data from localStorage (set from the previous page)
    const lesson = JSON.parse(localStorage.getItem("currentLesson"));
    if (!lesson) {
      document.getElementById("lessonContent").innerHTML = "<p>No lesson found.</p>";
      return;
    }
    
    // Set the lesson title
    document.getElementById("lessonTitle").innerText = lesson.title;
  
    const contentContainer = document.getElementById("lessonContent");
    
    // Render Objectives Section
    if (lesson.content.objectives && lesson.content.objectives.length > 0) {
      const objectivesDiv = document.createElement("div");
      objectivesDiv.classList.add("section-content");
      objectivesDiv.innerHTML = `<h2>Lesson Objectives</h2>`;
      const objList = document.createElement("ul");
      lesson.content.objectives.forEach(obj => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${obj}</strong>`;  // Bold each objective if needed
        objList.appendChild(li);
      });
      objectivesDiv.appendChild(objList);
      contentContainer.appendChild(objectivesDiv);
    }
  
    // Render Explanation Section
    if (lesson.content.explanation && lesson.content.explanation.length > 0) {
      const explanationDiv = document.createElement("div");
      explanationDiv.classList.add("section-content");
      explanationDiv.innerHTML = `<h2>Explanation</h2>`;
      lesson.content.explanation.forEach(paragraph => {
        const p = document.createElement("p");
        // Assume the text may include formatting tags (e.g. <b>, <i>) as per your document
        p.innerHTML = paragraph;
        explanationDiv.appendChild(p);
      });
      contentContainer.appendChild(explanationDiv);
    }
    
    // Render Example Code Section (if any)
    if (lesson.content.exampleCode) {
      const exampleDiv = document.createElement("div");
      exampleDiv.classList.add("section-content");
      exampleDiv.innerHTML = `<h2>${lesson.content.exampleCode.title}</h2>`;
      const pre = document.createElement("pre");
      const codeElement = document.createElement("code");
      codeElement.textContent = lesson.content.exampleCode.code;
      pre.appendChild(codeElement);
      exampleDiv.appendChild(pre);
      contentContainer.appendChild(exampleDiv);
    }
    
    // Render Exercises Section
    if (lesson.content.exercises && lesson.content.exercises.length > 0) {
      // For simplicity, we'll load the first exercise
      const exercise = lesson.content.exercises[0];
      // Format title and description
      document.getElementById("exerciseDescription").innerHTML =
        `<p><strong>${exercise.title}:</strong> ${exercise.description}</p>`;
      // Pre-fill the code editor with the suggested code
      document.getElementById("exerciseCode").value = exercise.code;
    }
    
    // Render Summary Section (if any)
    if (lesson.content.summary && lesson.content.summary.length > 0) {
      const summaryDiv = document.createElement("div");
      summaryDiv.classList.add("section-content");
      summaryDiv.innerHTML = `<h2>Summary</h2>`;
      const ul = document.createElement("ul");
      lesson.content.summary.forEach(item => {
        const li = document.createElement("li");
        li.innerHTML = item;
        ul.appendChild(li);
      });
      summaryDiv.appendChild(ul);
      contentContainer.appendChild(summaryDiv);
    }
    
    // Interactive Code Runner for the exercise
    document.getElementById("runCodeBtn").addEventListener("click", () => {
      const code = document.getElementById("exerciseCode").value;
      let output = "";
      try {
        // Optionally capture console.log output in a simple array:
        const originalLog = console.log;
        let logs = [];
        console.log = function(...args) {
          logs.push(args.join(" "));
        };
        
        // WARNING: Using eval() can be unsafe if running untrusted code.
        // Consider sandboxing in an iframe if security is a concern.
        eval(code);
        
        console.log = originalLog;
        output = logs.join("\n") || "Code executed successfully.";
      } catch (err) {
        output = err.toString();
      }
      document.getElementById("codeOutput").innerText = output;
    });
  });
  