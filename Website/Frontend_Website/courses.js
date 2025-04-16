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
    const profileData = await profileResponse.json();
    document.getElementById("usernameDisplay").innerText = profileData.learner.username;
    // Optionally update learner level (if stored in profile)
    // document.querySelector("#learnerLevel b").innerText = profileData.learner.level;

    // --- Fetch Enrolled Courses ---
    // This endpoint should return an array of enrollment records, each containing course info.
   // In courses.js:
const enrolledResponse = await fetch(`/api/enrollments/${profileData.learner.learner_id}/all`, {
  headers: { "Authorization": "Bearer " + token }
});

    const enrolledCourses = await enrolledResponse.json();
    const enrolledContainer = document.getElementById("enrolledCoursesContainer");
    enrolledContainer.innerHTML = "";
    enrolledCourses.forEach(enrollment => {
      // Assume each enrollment record has a nested "course" object.
      const course = enrollment.course;
      const courseDiv = document.createElement("div");
      courseDiv.className = "courseCont";
      courseDiv.innerHTML = `<h2>${course.title}</h2>
        <p>Progress: ${enrollment.current_level} - Lesson ${enrollment.current_lesson}</p>`;
      courseDiv.addEventListener("click", () => {
        localStorage.setItem("currentEnrollment", JSON.stringify(enrollment));
        localStorage.setItem("currentCourse", JSON.stringify(course));
        window.location.href = "course-detail.html";
      });
      enrolledContainer.appendChild(courseDiv);
    });

    // --- Fetch All Courses ---
    const coursesResponse = await fetch("/api/courses");
    const courses = await coursesResponse.json();
    const allCoursesContainer = document.getElementById("allCoursesContainer");
    allCoursesContainer.innerHTML = "";
    courses.forEach(course => {
      const courseDiv = document.createElement("div");
      courseDiv.className = "courseCont";
      courseDiv.innerHTML = `<h2>${course.title}</h2>
        <p>Progress: Not Enrolled</p>`;
      // Add an enrollment button
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
