// courses.js
document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("jwt");
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  try {
    // Fetch learner profile
    const profileResponse = await fetch("/api/learners/profile", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      }
    });
    if (!profileResponse.ok) {
      window.location.href = "login.html";
      return;
    }
    document.getElementById("viewLeaderboard").addEventListener("click", () => {
      window.location.href = "leaderboard.html";
    });

    const profileData = await profileResponse.json();
    document.getElementById("usernameDisplay").innerText = profileData.learner.username;

    const logoutBtn = document.getElementById("logoutBtn");
    logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("jwt");         // clear session
  window.location.href = "login.html";    // back to login
       });
    // --- Fetch Enrolled Courses ---
    const enrolledResponse = await fetch(
      `/api/enrollments/${profileData.learner.learner_id}/all`,
      { headers: { "Authorization": "Bearer " + token } }
    );
    const enrolledCourses = enrolledResponse.ok ? await enrolledResponse.json() : [];
    const enrolledContainer = document.getElementById("enrolledCoursesContainer");
    enrolledContainer.innerHTML = "";

    enrolledCourses.forEach(enrollment => {
      // ▶️ Build course object from aliased fields
      const course = {
        course_id: enrollment.course_id,
        title: enrollment.course_title,
        description: enrollment.course_description
      };
      if (!course.title) return;  // skip if undefined

      const courseDiv = document.createElement("div");
      courseDiv.className = "courseCont";
      courseDiv.innerHTML = `
        <h2>${course.title}</h2>
        <p>Progress: ${enrollment.current_level} - Lesson ${enrollment.current_lesson}</p>
      `;
      courseDiv.addEventListener("click", () => {
        localStorage.setItem("currentEnrollment", JSON.stringify(enrollment));
        localStorage.setItem("currentCourse", JSON.stringify(course));
        // adjust filename to match your actual HTML
        window.location.href = "course_detail.html";
      });
      enrolledContainer.appendChild(courseDiv);
    });

    // --- Fetch All Courses ---
    const coursesResponse = await fetch("/api/courses", {
      headers: { "Authorization": "Bearer " + token }
    });
    const courses = coursesResponse.ok ? await coursesResponse.json() : [];
    const allCoursesContainer = document.getElementById("allCoursesContainer");
    allCoursesContainer.innerHTML = "";

    courses.forEach(course => {
      if (!course.title) return;  // skip invalid
      const courseDiv = document.createElement("div");
      courseDiv.className = "courseCont";
      courseDiv.innerHTML = `
        <h2>${course.title}</h2>
        <p>Progress: Not Enrolled</p>
      `;
      const enrollBtn = document.createElement("button");
      enrollBtn.textContent = "Enroll";
      enrollBtn.addEventListener("click", async () => {
        const enrollResponse = await fetch("/api/enrollments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
          },
          body: JSON.stringify({
            learner_id: profileData.learner.learner_id,
            course_id: course.course_id,
            current_level: "Beginner",
            current_lesson: 0
          })
        });
        if (enrollResponse.ok) {
          const newEnrollment = await enrollResponse.json();
          localStorage.setItem("currentEnrollment", JSON.stringify(newEnrollment));
          localStorage.setItem("currentCourse", JSON.stringify(course));
          window.location.href = "course_detail.html";
        } else {
          alert("Enrollment failed. Please try again.");
        }
      });
      courseDiv.appendChild(enrollBtn);
      allCoursesContainer.appendChild(courseDiv);
    });

  } catch (error) {
    console.error("Error loading courses:", error);
  }
});
