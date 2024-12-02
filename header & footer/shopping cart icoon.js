// Functie om het totale aantal producten (op basis van quantity) uit localStorage te halen en bij te werken
function getCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || []; // Haal cart op uit localStorage

    // Tel de quantities van alle items in de winkelwagen bij elkaar op
    const totalQuantity = cart.reduce((total, item) => total + (item.quantity || 0), 0);
    return totalQuantity; // Geef het totale aantal items terug
}

// Update het aantal in het winkelwagen-icoon
function updateCartCountDisplay() {
    const cartCount = document.getElementById('cart-count');
    const count = getCartCount(); // Verkrijg het totale aantal producten in de cart

    if (count > 99) {
        cartCount.textContent = '99+'; // Toon 99+ als het groter is dan 99
    } else {
        cartCount.textContent = count; // Toon het echte aantal
    }

    // Toon of verberg de cirkel op basis van de waarde van count
    if (count > 0) {
        cartCount.style.display = 'flex'; // Toon de cirkel
    } else {
        cartCount.style.display = 'none'; // Verberg de cirkel als count 0 is
    }
}

// Functie die wordt aangeroepen bij het klikken op de winkelwagenknop
function cartIcon(event) {
    event.preventDefault(); // Voorkom pagina navigatie

    // Update de weergave van het winkelwagen-icoon
    updateCartCountDisplay();
}

// Roep deze functie aan om het aantal in de winkelwagen-icoon te tonen wanneer de pagina laadt
document.addEventListener('DOMContentLoaded', updateCartCountDisplay);
