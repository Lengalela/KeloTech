// course_detail.js
document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("jwt");
  if (!token) return window.location.href = "login.html";

  const course = JSON.parse(localStorage.getItem("currentCourse"));
  let enrollment = JSON.parse(localStorage.getItem("currentEnrollment"));
  if (!course || !enrollment) {
    alert("Missing course or enrollment data.");
    return window.location.href = "index.html";
  }

  document.getElementById("courseTitle").innerText = course.title;
  document.getElementById("courseDescription").innerText = course.description || "";

  let courseData;
  try {
    const res = await fetch(`/api/courses/${course.course_id}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) throw await res.text();
    courseData = await res.json();
  } catch (err) {
    console.error("Failed to load course:", err);
    return;
  }

  const allLessons = [
    ...(courseData.lessons?.Beginner || []),
    ...(courseData.lessons?.Intermediate || []),
    ...(courseData.lessons?.Advanced || [])
  ];
  const lessonMap = new Map(allLessons.map(l => [l.lesson_id, l]));

  const sidebar = document.getElementById("sidebarLessons");
  sidebar.innerHTML = "";
  for (const level of ["Beginner", "Intermediate", "Advanced"]) {
    sidebar.insertAdjacentHTML("beforeend", `<h2>${level} Lessons</h2>`);
    (courseData.lessons[level] || []).sort((a, b) => a.order_number - b.order_number).forEach(meta => {
      const div = document.createElement("div");
      div.className = "lesson-item";
      div.innerText = meta.title;
      if (meta.order_number > enrollment.current_lesson + 1) {
        div.classList.add("locked");
      } else {
        div.addEventListener("click", () => {
          sidebar.querySelectorAll(".lesson-item").forEach(el => el.classList.remove("selected"));
          div.classList.add("selected");
          renderLesson(lessonMap.get(meta.lesson_id));
          bumpProgress(meta);
        });
      }
      sidebar.appendChild(div);
    });
  }

  const first = sidebar.querySelector(".lesson-item:not(.locked)");
  if (first) first.click();

  function renderLesson(lesson) {
    const area = document.getElementById("lessonArea");
    area.innerHTML = `<h2>${lesson.title}</h2>`;

    let c = lesson.content;
    if (typeof c === "string") {
      try { c = JSON.parse(c); } catch {}
    }

    const temp = document.createElement("div");
    function extractCodeDesc(html) {
      temp.innerHTML = html;
      const codeEl = temp.querySelector("code");
      let codeText = "";
      if (codeEl) {
        codeText = codeEl.textContent;
        const pre = codeEl.closest("pre");
        (pre || codeEl).remove();
      }
      return { codeText, descHTML: temp.innerHTML };
    }

    if (Array.isArray(c.contentBlocks)) {
      c.contentBlocks.forEach(block => {
        if (block.runnable) {
          const { codeText, descHTML } = extractCodeDesc(block.content);

          area.insertAdjacentHTML("beforeend", `<section class="section"><h3>${block.title}</h3>${descHTML}</section>`);

          const codeDiv = document.createElement("div");
          codeDiv.style.cssText = "height:200px;border:1px solid #ccc;";
          area.appendChild(codeDiv);

          const mode = codeText.trim().startsWith("<") ? "html" : "js";
          const cm = window.createEditor(codeDiv, codeText, mode);

          const btn = document.createElement("button");
          btn.textContent = "Run";
          area.appendChild(btn);

          const outputDiv = document.createElement("div");
          outputDiv.className = "code-output";
          area.appendChild(outputDiv);

          btn.addEventListener("click", () => {
            outputDiv.innerHTML = "";
            const userCode = cm.getValue();

            if (mode === "html") {
              const iframe = document.createElement("iframe");
              const iframeId = "iframe_" + Math.random().toString(36).substring(2, 10);
              iframe.id = iframeId;
              iframe.setAttribute("sandbox", "allow-scripts allow-same-origin allow-modals");
              iframe.style.width = "100%";
              iframe.style.height = "400px";
              iframe.style.border = "1px solid #ccc";
              outputDiv.appendChild(iframe);

              const learningEffects = `
                function showAnimatedMessage(message) {
                  const msgDiv = document.createElement("div");
                  msgDiv.innerText = message;
                  msgDiv.style.position = "fixed";
                  msgDiv.style.top = Math.random() * 80 + "%";
                  msgDiv.style.left = Math.random() * 80 + "%";
                  msgDiv.style.fontSize = "24px";
                  msgDiv.style.fontWeight = "bold";
                  msgDiv.style.color = randomColor();
                  msgDiv.style.zIndex = 9999;
                  msgDiv.style.transition = "all 1s ease";
                  document.body.appendChild(msgDiv);
                  setTimeout(() => {
                    msgDiv.style.transform = "translateY(-100px)";
                    msgDiv.style.opacity = "0";
                  }, 100);
                  setTimeout(() => {
                    msgDiv.remove();
                  }, 1500);
                }
                function randomColor() {
                  const colors = ["#ff4b5c", "#3ac569", "#4d7cff", "#ffbb00", "#9b59b6"];
                  return colors[Math.floor(Math.random() * colors.length)];
                }
              `;

              const completeHTML = `
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset="UTF-8">
                  <script>
                    ${learningEffects}
                    const iframeId = "${iframeId}";
                    window.alert = function(msg) {
                      parent.postMessage({ type: "alert", message: msg, iframeId: iframeId }, "*");
                    };
                    console.log = function(...args) {
                      parent.postMessage({ type: "log", message: args.join(" "), iframeId: iframeId }, "*");
                    };
                  <\/script>
                </head>
                <body>
                  ${userCode}
                </body>
                </html>
              `;

              const blob = new Blob([completeHTML], { type: "text/html" });
              const blobURL = URL.createObjectURL(blob);

              iframe.src = blobURL;

            } else {
              trapAndRun(() => {
                const result = eval(userCode);
                if (result !== undefined) {
                  const p = document.createElement("p");
                  p.innerText = result;
                  outputDiv.appendChild(p);
                }
              });
            }
          });

          function trapAndRun(fn) {
            const oldAlert = window.alert;
            const oldLog = console.log;
            try {
              window.alert = (msg) => {
                const p = document.createElement("p");
                p.innerText = "Alert: " + msg;
                outputDiv.appendChild(p);
              };
              console.log = (...args) => {
                const p = document.createElement("p");
                p.innerText = args.join(" ");
                outputDiv.appendChild(p);
              };
              fn();
            } catch (error) {
              const p = document.createElement("p");
              p.innerText = "Error: " + error.message;
              outputDiv.appendChild(p);
            } finally {
              window.alert = oldAlert;
              console.log = oldLog;
            }
          }

          if (block.type === "section") btn.click();
        } else {
          if (block.type === "section") {
            area.insertAdjacentHTML("beforeend", `<section class="section"><h3>${block.title}</h3>${block.content}</section>`);
          }
        }
      });
    }
  }

  async function bumpProgress(meta) {
    if (meta.order_number <= enrollment.current_lesson) return;
    const payload = {
      current_level: meta.level,
      current_lesson: meta.order_number,
      quiz_marks: enrollment.quiz_marks || null,
      quiz_answers: enrollment.quiz_answers || null,
      ai_feedback: enrollment.ai_feedback || null
    };
    try {
      const res = await fetch(`/api/enrollments/${enrollment.enrollment_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        enrollment = await res.json();
        localStorage.setItem("currentEnrollment", JSON.stringify(enrollment));
      }
    } catch (err) {
      console.error("Failed to bump progress:", err);
    }
  }

  const chatButton = document.getElementById("chatButton"),
        chatPopup = document.getElementById("chatPopup"),
        closeChat = document.getElementById("closeChat"),
        msgInput = document.getElementById("message-input"),
        sendBtn = document.getElementById("send-btn"),
        chatMessages = document.getElementById("chatMessages");

  chatButton.addEventListener("click", () => {
    chatPopup.classList.toggle("flex");
  });
  closeChat.addEventListener("click", () => {
    chatPopup.classList.remove("flex");
  });
  sendBtn.addEventListener("click", async () => {
    const m = msgInput.value.trim();
    if (!m) return;
    const u = document.createElement("div");
    u.className = "message user-message";
    u.innerText = m;
    chatMessages.appendChild(u);
    msgInput.value = "";
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
      const r = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: m })
      });
      const { response } = await r.json();
      const b = document.createElement("div");
      b.className = "message bot-message";
      b.innerText = response;
      chatMessages.appendChild(b);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    } catch (err) {
      console.error("Chatbot error:", err);
    }
  });
});

// Trap iframe messages
window.addEventListener("message", (event) => {
  if (!event.data) return;
  if (event.data.type === "alert" || event.data.type === "log") {
    const iframeId = event.data.iframeId;
    const iframe = document.getElementById(iframeId);
    if (iframe) {
      const outputDiv = iframe.parentElement.querySelector(".code-output");
      if (outputDiv) {
        const p = document.createElement("p");
        p.innerText = (event.data.type === "alert" ? "Alert: " : "") + event.data.message;
        outputDiv.appendChild(p);
      }
    }
  }
});


