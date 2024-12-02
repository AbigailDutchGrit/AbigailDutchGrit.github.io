function sendAnalytics(buttonName) {
    console.log(`Button clicked: ${buttonName}`); // Log de naam van de knop

    const apiUrl = "https://localhost:7190/analytics"; // De API-URL voor analytics

    const payload = {
        button: buttonName, // De naam van de knop
        amount: 1 // Aantal, zoals aangegeven
    };

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Stel de content-type header in op JSON
        },
        body: JSON.stringify(payload) // Zet de payload om naar JSON
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json(); // Verwerk de response als JSON
    })
    .then(data => {
        console.log("Analytics data sent successfully", data); // Log de response van de server
    })
    .catch(error => {
        console.error("Er is een fout opgetreden bij het verzenden van de analytics data:", error);
    });
}
