// Functie voor het valideren van het formulier
document.querySelector('.contact-form form').addEventListener('submit', function(event) {
    event.preventDefault(); // Verhindert de standaard submissie

    // Haal de waarden van de velden op
    const email = this.querySelector('input[type="email"]').value;
    const phone = this.querySelector('input[type="tel"]').value;
    const message = this.querySelector('textarea').value;

    // Validatie van het e-mailadres
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Vul een geldig e-mailadres in.");
        return;
    }

    // Validatie van het telefoonnummer
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
        alert("Vul een geldig telefoonnummer in (10 cijfers).");
        return;
    }

    // Controleer of er een bericht is ingevoerd
    if (!message.trim()) {
        alert("Laat een bericht achter.");
        return;
    }

    // Als alles geldig is, verstuur het formulier (of doe iets anders)
    alert("Formulier succesvol verzonden!");
    // this.submit(); // Dit zou het formulier verzenden
});