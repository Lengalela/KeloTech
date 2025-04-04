document.addEventListener("DOMContentLoaded", function () {
    const inputField = document.getElementById("user-input");
    const responseDiv = document.getElementById("response");
    const sendButton = document.querySelector(".send-button");

    function sendToOllama() {
        const message = inputField.value.trim();
        if (!message) return;

        // Display user's message
        responseDiv.innerHTML += `<p><strong>You:</strong> ${message}</p>`;
        inputField.value = "";

        fetch("http://localhost:8000/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message }),
        })
            .then((response) => response.json())
            .then((data) => {
                responseDiv.innerHTML += `<p><strong>Bot:</strong> ${data.response}</p>`;
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }

    // Detect button click
    sendButton.addEventListener("click", sendToOllama);

    // Detect "Enter" key press
    inputField.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            sendToOllama();
        }
    });
});
