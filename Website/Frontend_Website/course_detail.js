// course_detail.js
document.addEventListener("DOMContentLoaded", async () => {
  // 1) Auth guard
  const token = localStorage.getItem("jwt");
  if (!token) return window.location.href = "login.html";

  // 2) Load course & enrollment
  const course     = JSON.parse(localStorage.getItem("currentCourse"));
  let enrollment   = JSON.parse(localStorage.getItem("currentEnrollment"));
  if (!course || !enrollment) {
    alert("Missing course or enrollment data.");
    return window.location.href = "index.html";
  }

  // 3) Fill header
  document.getElementById("courseTitle").innerText       = course.title;
  document.getElementById("courseDescription").innerText = course.description || "";

  // 4) Fetch course + lessons
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

  // 5) Build lesson map
  const allLessons = [
    ...(courseData.lessons?.Beginner     || []),
    ...(courseData.lessons?.Intermediate || []),
    ...(courseData.lessons?.Advanced     || [])
  ];
  const lessonMap = new Map(allLessons.map(l => [l.lesson_id, l]));

  // 6) Render sidebar
  const sidebar = document.getElementById("sidebarLessons");
  sidebar.innerHTML = "";
  for (const level of ["Beginner", "Intermediate", "Advanced"]) {
    sidebar.insertAdjacentHTML("beforeend", `<h2>${level} Lessons</h2>`);
    (courseData.lessons[level] || [])
      .sort((a, b) => a.order_number - b.order_number)
      .forEach(meta => {
        const div = document.createElement("div");
        div.className = "lesson-item";
        div.innerText = meta.title;
        if (meta.order_number > enrollment.current_lesson + 1) {
          div.classList.add("locked");
        } else {
          div.addEventListener("click", () => {
            sidebar.querySelectorAll(".lesson-item")
                   .forEach(el => el.classList.remove("selected"));
            div.classList.add("selected");
            renderLesson(lessonMap.get(meta.lesson_id));
            bumpProgress(meta);
          });
        }
        sidebar.appendChild(div);
      });
  }

  // 7) Auto-click first unlocked
  const first = sidebar.querySelector(".lesson-item:not(.locked)");
  if (first) first.click();

  // 8) renderLesson + CodeMirror integration
  function renderLesson(lesson) {
    const area = document.getElementById("lessonArea");
    area.innerHTML = `<h2>${lesson.title}</h2>`;

    // parse content JSON
    let c = lesson.content;
    if (typeof c === "string") {
      try { c = JSON.parse(c); } catch {}
    }

    // helper: extract code & description
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

    // loop blocks
    if (Array.isArray(c.contentBlocks)) {
      c.contentBlocks.forEach(block => {
        if (block.runnable) {
          // extract
          const { codeText, descHTML } = extractCodeDesc(block.content);

          // description
          area.insertAdjacentHTML("beforeend", `
            <section class="section">
              <h3>${block.title}</h3>
              ${descHTML}
            </section>
          `);

          // editor container
          const codeDiv = document.createElement("div");
          codeDiv.style.cssText = "height:200px;border:1px solid #ccc;";
          area.appendChild(codeDiv);

          // init CodeMirror
          const mode = codeText.trim().startsWith("<") ? "html" : "js";
          const cm   = window.createEditor(codeDiv, codeText, mode);

          // Run button + output pane
          const btn       = document.createElement("button");
          btn.textContent = "Run";
          area.appendChild(btn);

          const outputDiv = document.createElement("div");
          outputDiv.className = "code-output";
          area.appendChild(outputDiv);

          // helpers to trap alerts & console.log
          function withOverrides(fn) {
            const oldA = window.alert, oldL = console.log;
            window.alert = m => {
              const p = document.createElement("p");
              p.innerText = m;
              outputDiv.appendChild(p);
            };
            console.log = (...args) => {
              const p = document.createElement("p");
              p.innerText = args.join(" ");
              outputDiv.appendChild(p);
            };
            try { fn(); }
            catch (e) {
              const p = document.createElement("p");
              p.innerText = "Error: " + e;
              outputDiv.appendChild(p);
            } finally {
              window.alert = oldA;
              console.log   = oldL;
            }
          }

          // click handler
          btn.addEventListener("click", () => {
            outputDiv.innerHTML = "";
            if (mode === "html") {
              // parse HTML + scripts
              const doc = new DOMParser()
                            .parseFromString(cm.state.doc.toString(), "text/html");
              let scripts = "";
              doc.body.querySelectorAll("script")
                 .forEach(s => { scripts += s.textContent + "\n"; s.remove(); });
              outputDiv.appendChild(doc.body.cloneNode(true));
              outputDiv.querySelectorAll("button").forEach(b => {
                b.addEventListener("click", () => {
                  withOverrides(() => {
                    const onclick = doc.body.querySelector("button")
                                       ?.getAttribute("onclick");
                    onclick && eval(onclick);
                    scripts && eval(scripts);
                  });
                });
              });
            } else {
              // pure JS
              withOverrides(() => {
                const result = eval(cm.state.doc.toString());
                if (result !== undefined) {
                  const p = document.createElement("p");
                  p.innerText = result;
                  outputDiv.appendChild(p);
                }
              });
            }
          });

          // auto-run Try This Example
          if (block.type === "section") btn.click();
        }
        else {
          // non-runnable
          if (block.type === "section") {
            area.insertAdjacentHTML("beforeend", `
              <section class="section">
                <h3>${block.title}</h3>
                ${block.content}
              </section>
            `);
          } else if (block.type === "exercise") {
            area.insertAdjacentHTML("beforeend", `
              <section class="section exercise">
                <h4>${block.title}</h4>
                <p>${block.description}</p>
                <pre><code>${block.content}</code></pre>
              </section>
            `);
          } else if (block.type === "quiz") {
            area.insertAdjacentHTML("beforeend", `
              <section class="section quiz">
                <h3>${block.title}</h3>
                ${Array.isArray(block.content)
                  ? block.content.map((q,i)=>`
                      <div>
                        <h4>Q${i+1}: ${q.question}</h4>
                        ${q.options?.map(o=>`<p>${o}</p>`).join("")||""}
                      </div>
                    `).join("")
                  : block.content}
              </section>
            `);
          }
        }
      });
    }
  }

  // 9) bumpProgress
  async function bumpProgress(meta) {
    if (meta.order_number <= enrollment.current_lesson) return;
    const payload = {
      current_level:  meta.level,
      current_lesson: meta.order_number,
      quiz_marks:     enrollment.quiz_marks   || null,
      quiz_answers:   enrollment.quiz_answers || null,
      ai_feedback:    enrollment.ai_feedback  || null
    };
    try {
      const res = await fetch(
        `/api/enrollments/${enrollment.enrollment_id}`, {
          method: "PUT",
          headers: {
            "Content-Type":  "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        }
      );
      if (res.ok) {
        enrollment = await res.json();
        localStorage.setItem("currentEnrollment", JSON.stringify(enrollment));
      }
    } catch (err) {
      console.error("Failed to bump progress:", err);
    }
  }

  // 10) Chatbot wiring
  const chatButton   = document.getElementById("chatButton"),
        chatPopup    = document.getElementById("chatPopup"),
        closeChat    = document.getElementById("closeChat"),
        msgInput     = document.getElementById("message-input"),
        sendBtn      = document.getElementById("send-btn"),
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
      const r = await fetch("/chat", {
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
