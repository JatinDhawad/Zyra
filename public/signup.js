document.addEventListener("DOMContentLoaded", () => {
    const signupBtn = document.querySelector(".signup-btn");

    signupBtn.addEventListener("click", async (event) => {
        event.preventDefault(); // Prevent form submission

        const name = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        // Basic Validation
        if (!name || !email || !password) {
            alert("Please fill out all fields!");
            return;
        }

        try {
            // Send data to the backend
            const response = await fetch("http://localhost:3000/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password }),
            });

            if (response.ok) {
                alert("Signup Successful! Please Sign In");
                window.location.href = "signin.html";
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Error during signup:", error);
            alert("An error occurred. Please try again later.");
        }
    });
});