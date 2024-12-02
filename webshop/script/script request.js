document.addEventListener('DOMContentLoaded', function() {
    // Display customer information
    document.getElementById('display-name').textContent = localStorage.getItem('name') || 'N/A';
    document.getElementById('display-lastname').textContent = localStorage.getItem('lastname') || 'N/A';
    document.getElementById('display-email').textContent = localStorage.getItem('email') || 'N/A';
    document.getElementById('display-telephone').textContent = localStorage.getItem('telephone') || 'N/A';
    document.getElementById('display-message').textContent = localStorage.getItem('message') || 'N/A';
})

// Functie om de producten op de request-pagina weer te geven
function displayRequestPageItems() {
    const requestItemsContainer = document.querySelector('.request-items'); // Zorg ervoor dat deze container in je HTML bestaat
    requestItemsContainer.innerHTML = '';

    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    if (cartItems.length === 0) {
        requestItemsContainer.innerHTML = '<p>Your request list is empty.</p>';
        return;
    }

    cartItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('request-item');
    
        // Haal het numerieke deel van de prijs op en vermenigvuldig met de hoeveelheid
        const itemPrice = parseFloat(item.price.replace('€', '')); 
        const totalPrice = itemPrice * item.quantity;
    
        itemElement.innerHTML = `
            <div class="item-info">
                <div class="item-image">
                    <img src="${item.image}" alt="${item.title}">
                </div>
                <div class="item-description">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                </div>
            </div>
            <div class="item-quantity-price">
                <span class="item-price" style="font-size: 15px; color: #333; margin-right: 10px; margin-left: 15px;">Price: €${totalPrice.toFixed(2)}</span>
                <span class="item-quantity" style="font-size: 15px; color: #333;">Quantity: ${item.quantity}</span>
            </div>
        `;
    
        requestItemsContainer.appendChild(itemElement);
    });
    
}

// Laad de request-pagina-items bij het laden van de pagina
document.addEventListener("DOMContentLoaded", function () {
    displayRequestPageItems();
});