document.addEventListener("DOMContentLoaded", function() {
    const token = sessionStorage.getItem("token");
    const userIconSymbol = document.getElementById("user-icon-symbol");
    const dropdown = document.getElementById("user-dropdown");
    const portalLink = document.getElementById("portal-link");

    // Start de dropdown als verborgen en met opacity 0
    dropdown.style.display = "none"; 
    dropdown.style.opacity = "1"; 

    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const isAdmin = payload.IsAdmin === "True";

            userIconSymbol.textContent = "how_to_reg"; 

            portalLink.textContent = isAdmin ? "Admin Portal" : "Portal";
            portalLink.href = isAdmin ? "../portal/admin.html" : "../portal/portal.html"; 
        } catch (error) {
            console.error("Fout bij het decoderen van de token:", error);
        }
    } else {
        userIconSymbol.textContent = "person"; 
    }
});

// Toggle de dropdown
function toggleDropdown() {
    const token = sessionStorage.getItem("token");
    const dropdown = document.getElementById("user-dropdown");

    console.log("Dropdown clicked"); // Debug statement
    console.log("Token:", token); // Show the token in the console

    if (!token) {
        console.log("No token found, redirecting to login."); // Debug statement
        window.location.href = "../portal/login.html"; // Redirect naar login
    } else {
        // Toggle de zichtbaarheid van de dropdown met fade-effect
        if (dropdown.style.display === "none" || dropdown.style.display === "") {
            dropdown.style.display = "block"; // Toegang
            setTimeout(() => {
                dropdown.style.opacity = "1"; // Maak de dropdown zichtbaar
            }, 10); // Kleine vertraging voor overgang
        } else {
            dropdown.style.opacity = "0"; // Maak de dropdown onzichtbaar
            setTimeout(() => {
                dropdown.style.display = "none"; // Verberg de dropdown na de overgang
            }, 300); // Dit komt overeen met de overgangstijd
        }
        console.log("Dropdown displayed:", dropdown.style.display); // Debug statement
    }
}

// Logout functie
function logout() {
    sessionStorage.removeItem("token"); // Verwijder de token
    window.location.href = "../portal/login.html"; // Redirect naar login
}


