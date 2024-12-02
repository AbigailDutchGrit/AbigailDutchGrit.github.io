// Functie om winkelmand in localStorage op te slaan
function saveCartToLocalStorage(cartItems) {
    // Sla de bijgewerkte cart-items op in localStorage
    localStorage.setItem('cart', JSON.stringify(cartItems));
    updateCartCount();  // Update de winkelwagenteller wanneer de inhoud is opgeslagen
    fetchProducts(); // Aanroepen om aanbevelingen te tonen wanneer een nieuw product wordt toegevoegd
}

// Functie om winkelwagenitems weer te geven
function displayCartItems() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const productListContainer = document.querySelector('.product-list');
    const emptyCartMessage = document.querySelector('.empty-cart-message');
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    cartItemsContainer.innerHTML = '';
    productListContainer.innerHTML = '';

    if (cartItems.length === 0) {
        // Toon lege winkelmand boodschap en verberg de andere secties
        emptyCartMessage.style.display = 'block';
        cartItemsContainer.style.display = 'none'; // Verberg de cart-items sectie

        // Zet de totale prijs op €0.00
        document.querySelector(".total-price").textContent = `€0.00`;
        updateCartCount();  // Bijwerken van de winkelwagenteller wanneer de winkelmand leeg is

        return;  // Stop de verdere uitvoering
    }

    // Verberg de lege winkelmand boodschap en toon de cart-items sectie
    emptyCartMessage.style.display = 'none';
    cartItemsContainer.style.display = 'block';

    cartItems.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.setAttribute('data-id', index + 1);

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
                <span class="item-price">€${item.price}</span>
                <div class="quantity-control">
                    <input type="number" value="${item.quantity}" min="1" class="quantity-input">
                </div>
                <button class="delete-item" aria-label="Remove Product ${index + 1}">
                    <span class="material-icons">delete</span>
                </button>
            </div>
        `;

        const quantityInput = itemElement.querySelector('.quantity-input');
        quantityInput.addEventListener('change', function () {
            const newQuantity = parseInt(this.value, 10);
            if (newQuantity > 0) {
                updateQuantity(item.title, newQuantity);
            } else {
                this.value = item.quantity;
            }
        });

        const deleteButton = itemElement.querySelector('.delete-item');
        deleteButton.addEventListener('click', function () {
            removeItem(item.title);
        });

        cartItemsContainer.appendChild(itemElement);
    });

    updateSubtotal(cartItems);  // Bijwerken van de subtotaal
    updateCartCount();  // Bijwerken van de winkelwagenteller
    fetchProducts();  // Aanroepen om aanbevelingen te tonen
}

// Laad winkelwagenitems bij het laden van de pagina
document.addEventListener("DOMContentLoaded", function () {
    displayCartItems();
});

// Functie om de subtotal en productlijst bij te werken
function updateSubtotal() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const subtotalContainer = document.querySelector('.subtotal-container');
    const productListContainer = document.querySelector('.product-list');

    if (!subtotalContainer || !productListContainer) return;

    // Als de winkelwagen leeg is, verberg de subtotaal container
    if (cartItems.length === 0) {
        subtotalContainer.style.display = 'none';
    } else {
        subtotalContainer.style.display = 'block';
    }

    // Reset de productlijst weergave
    productListContainer.innerHTML = '';

    let subtotal = 0;

    // Loop door de items in de winkelwagen en toon ze in de productlijst
    cartItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('product-info');
        itemElement.setAttribute('data-id', item.id);

        // Voeg de naam van het product en de prijs toe
        itemElement.innerHTML = `
            <span class="product-name">${item.title} (${item.quantity})</span>
            <span class="product-price">€${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
        `;

        productListContainer.appendChild(itemElement);

        // Bereken de subtotal voor alle producten
        const price = parseFloat(item.price.replace(/[^\d.-]/g, ''));
        if (!isNaN(price)) {
            subtotal += price * item.quantity;
        }
    });

    // Update de totaalprijs in de container
    const totalPriceContainer = document.querySelector('.total-price');
    if (totalPriceContainer) {
        totalPriceContainer.textContent = `€${subtotal.toFixed(2)}`;
    }
}


// Functie om de hoeveelheid van een item bij te werken
function updateQuantity(title, newQuantity) {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cartItems.find(item => item.title === title);

    if (item) {
        item.quantity = newQuantity;
        saveCartToLocalStorage(cartItems); // Sla de gewijzigde winkelwagen op in localStorage
        displayCartItems();  // Vernieuw de winkelwagenweergave
    }
}

function removeItem(title) {
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    cartItems = cartItems.filter(item => item.title !== title);

    saveCartToLocalStorage(cartItems); // Sla de winkelwagen zonder het verwijderde item op
    displayCartItems();  // Vernieuw de winkelwagenweergave

    // Toon de pop-up met het bericht
    showPopup(`${title} is verwijderd uit je winkelwagen.`);
    updateSubtotal(); // Werk de subtotal bij
}


// Functie om de pop-up weer te geven
function showPopup(message) {
    const popupMessage = document.getElementById('popup-message');
    popupMessage.textContent = message;
    popupMessage.style.display = 'block';

    // Verberg de pop-up na 3 seconden
    setTimeout(() => {
        popupMessage.style.display = 'none';
    }, 3000);
}

// Laad winkelwagenitems bij het laden van de pagina
document.addEventListener("DOMContentLoaded", function () {
    displayCartItems();
});

// Functie om de winkelwagenteller bij te werken en het icoon zichtbaar/verberg te maken
function updateCartCount() {
    // Haal de winkelwageninhoud op uit localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Tel de hoeveelheden van alle producten op (totaal aantal items)
    let itemCount = cart.reduce((total, item) => total + item.quantity, 0);

    // Update de teller in de HTML
    document.getElementById('cart-count').textContent = itemCount;

    // Toon of verberg het winkelwagentje-icoon op basis van de inhoud van de winkelwagen
    const cartIcon = document.querySelector('.cart-icon');
    if (cart.length === 0) {
        // Toon het icoon als de winkelmand leeg is
        cartIcon.style.display = 'block';
    } else {
        // Verberg het icoon als er items in de winkelmand zijn
        cartIcon.style.display = 'none';
    }
}

let cachedRecommendations = []; // Variabele om de aanbevolen producten op te slaan

/// Functie om producten uit JSON te fetchen
function fetchProducts() {
    // Kijk of de aanbevolen producten al in de localStorage staan
    const storedRecommendations = localStorage.getItem('recommendations');

    if (storedRecommendations) {
        // Als de aanbevolen producten al opgeslagen zijn, gebruik deze
        displayRecommendations(JSON.parse(storedRecommendations));
    } else {
        // Als er geen opgeslagen producten zijn, haal ze op en sla ze op in localStorage
        fetch('products.json')
            .then(response => response.json())
            .then(data => {
                const allProducts = collectAllProducts(data); // Verzamel alle producten
                const randomProducts = getRandomRecommendations(allProducts, 4); // Kies willekeurige producten

                // Sla de aanbevolen producten op in de localStorage
                localStorage.setItem('recommendations', JSON.stringify(randomProducts));

                displayRecommendations(randomProducts); // Weergeven van aanbevolen producten
            })
            .catch(error => console.error('Error fetching products:', error));
    }
}

// Functie om producten uit alle disciplinegroepen te verzamelen
function collectAllProducts(data) {
    const allProducts = [];
    for (const group in data.discipline_group) {
        if (Array.isArray(data.discipline_group[group])) {
            allProducts.push(...data.discipline_group[group]);
        }
    }
    return allProducts;
}

// Functie om willekeurige aanbevelingen te selecteren
function getRandomRecommendations(products, count) {
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Functie om aanbevelingen weer te geven
function displayRecommendations(recommendations) {
    const recommendationsContainer = document.querySelector('.recommendations');

    recommendationsContainer.innerHTML = ''; // Oude aanbevelingen verwijderen

    recommendations.forEach(product => {
        const item = document.createElement('div');
        item.classList.add('recommendation-item');

        // Maak een link die naar de productpagina leidt, gebaseerd op de product code
        const productLink = document.createElement('a');
        productLink.href = `product.html?code=${product.code}`; // Verwijst naar productpagina met de product code in de URL

        item.innerHTML = `
            <img src="${product.image}" alt="${product.product}" class="recommendation-image">
            <h3 class="recommendation-title">${product.product}</h3>
            <span class="recommendation-price">€${product.price}</span>
        `;

        // Voeg de link toe rond de item-content
        productLink.appendChild(item);

        recommendationsContainer.appendChild(productLink);
    });
}

// Verkrijg de product ID uit de URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

// Haal de productinformatie op basis van de ID (bijvoorbeeld via een fetch naar je productgegevens)
fetch('products.json')
    .then(response => response.json())
    .then(data => {
        const product = data.find(p => p.id === productId);  // Zoek het product op basis van de ID

        if (product) {
            // Toon de productinformatie op de pagina
            document.querySelector('.product-title').textContent = product.product;
            document.querySelector('.product-description').textContent = product.description;
            document.querySelector('.product-price').textContent = `€${product.price}`;
            document.querySelector('.product-image').src = product.image;
        } else {
            // Product niet gevonden
            document.querySelector('.product-info').textContent = 'Product niet gevonden';
        }   
    })
    .catch(error => console.error('Error fetching product data:', error));

// Vervolgens haal je de productinformatie op basis van deze ID (mogelijk via een fetch naar je productgegevens of een lokale dataset)
// Aanroepen om producten te fetchen bij het laden van de pagina
fetchProducts();

window.addEventListener('load', function() {
    const continueBtn = document.querySelector('.continue-shopping-btn');
    if (continueBtn) {
        continueBtn.classList.add('styled');
    }
});

document.addEventListener("DOMContentLoaded", function () {
    displayCartItems();
    updateSubtotal(); // Zorg dat de subtotal wordt bijgewerkt bij het laden
});

function showPopup(message) {
    const popupMessage = document.getElementById('popup-message');
    if (!popupMessage) {
        console.error("Popup element not found");
        return;
    }
    popupMessage.textContent = message; // Stel de tekst van de pop-up in
    popupMessage.style.display = 'block'; // Toon de pop-up

    // Verberg de pop-up na 3 seconden
    setTimeout(() => {
        popupMessage.style.display = 'none';
    }, 3000);
}

