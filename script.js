// 1. Mobile Hamburger Menu Toggle
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

// Close Mobile Menu automatically upon clicking any standard link
document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
  });
});

// 2. Fetch API Connection to send inquiry details directly to Python Server
const enrollmentForm = document.getElementById("enrollmentForm");

enrollmentForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevents standard full page reload

  // Form inputs grouped into a clean JSON structure
  const studentData = {
    studentName: document.getElementById("studentName").value,
    parentEmail: document.getElementById("parentEmail").value,
    gradeLevel: document.getElementById("gradeLevel").value,
    message: document.getElementById("message").value,
  };

  try {
    // Send POST request directly to the Flask backend endpoint
    const response = await fetch("/api/enroll", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(studentData),
    });

    const result = await response.json();

    if (response.ok) {
      // Flash server's dynamic message back in the browser
      alert(result.message);
      enrollmentForm.reset(); // clear input form on success
    } else {
      alert(`Inquiry Error: ${result.message}`);
    }
  } catch (error) {
    console.error("Network Error: ", error);
    alert(
      "Could not connect to the server. Please verify your Python Flask server is active."
    );
  }
});

// --- LANGUAGE SWITCHER LOGIC ---
const langToggle = document.getElementById("langToggle");
const langText = document.getElementById("langText");
let currentLang = "en"; // Defaults to English

langToggle.addEventListener("click", () => {
  // 1. Swap current language tracker
  currentLang = currentLang === "en" ? "ar" : "en";

  // 2. Change target abbreviation inside the button (AR or EN)
  langText.textContent = currentLang === "en" ? "AR" : "EN";

  // 3. Toggle layout to right-to-left (RTL) for Arabic
  if (currentLang === "ar") {
    document.body.classList.add("rtl");
  } else {
    document.body.classList.remove("rtl");
  }

  // 4. Find every element with translations and swap text
  const translatableElements = document.querySelectorAll("[data-en]");
  translatableElements.forEach((element) => {
    // Find if this specific element has child elements inside (like <span>)
    if (element.children.length === 0) {
      // If it is just plain text, translate it directly
      element.textContent = element.getAttribute(`data-${currentLang}`);
    } else {
      // If it has complex nested elements, check translation of its internal texts
      const textSpan = element.querySelector("span");
      if (textSpan) {
        const parentText = element.getAttribute(`data-${currentLang}`);
        const spanText = textSpan.getAttribute(`data-${currentLang}`);

        element.textContent = parentText;

        const newSpan = document.createElement("span");
        newSpan.textContent = " " + spanText;
        newSpan.setAttribute(`data-en`, textSpan.getAttribute("data-en"));
        newSpan.setAttribute(`data-ar`, textSpan.getAttribute("data-ar"));
        element.appendChild(newSpan);
      }
    }
  });
});
