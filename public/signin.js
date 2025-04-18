document.addEventListener("DOMContentLoaded", () => {
    const signinBtn = document.querySelector(".signin-btn"); // Sign In button

    if (!signinBtn) {
        console.error("Sign In button not found");
        return;
    }

    console.log("Sign In button found"); // Debugging log

    signinBtn.addEventListener("click", async (event) => {
        event.preventDefault(); // Prevent form submission

        const email = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        // Basic Validation
        if (!email || !password) {
            alert("Please fill out all fields!");
            return;
        }

        try {
            // Send data to the backend
            const response = await fetch("http://localhost:3000/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();

                // Store user details in localStorage
                localStorage.setItem("user", JSON.stringify(data.user));

                alert("Sign In Successful!");
                window.location.href = "index.html"; // Redirect to homepage
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Error during sign-in:", error);
            alert("An error occurred. Please try again later.");
        }
    });
});