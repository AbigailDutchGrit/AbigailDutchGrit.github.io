const nameField = document.getElementById('name');
nameField.classList.add('name'); // Dit voegt de klasse toe

// Formulier indienen met validatie en opslaan in localStorage
function submitForm(event) {
    event.preventDefault(); // Voorkom standaard formulier indienen

    const nameField = document.getElementById('name');
    const lastnameField = document.getElementById('lastname');
    const emailField = document.getElementById('email');
    const telephoneField = document.getElementById('telephone');

    // Validatie van de velden
    if (!nameField.value || !lastnameField.value || !emailField.value || !telephoneField.value) {
        alert("Vul alle velden correct in.");
        return;
    }

    // Opslaan in localStorage
    localStorage.setItem('name', nameField.value);
    localStorage.setItem('lastname', lastnameField.value);
    localStorage.setItem('email', emailField.value);
    localStorage.setItem('telephone', telephoneField.value);

    // Redirect nadat formuliergegevens zijn opgeslagen
    window.location.href = 'request.html';
}

// Haal gebruikersgegevens op met een sessie token
async function getUserData() {
    const token = sessionStorage.getItem('token');
    if (!token) {
        console.error('Geen token gevonden in sessionStorage');
        return;
    }

    try {
        const response = await fetch('https://localhost:7190/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error(`Fout: ${response.statusText}`);

        const data = await response.json();
        document.getElementById('name').value = data.name || '';
        document.getElementById('email').value = data.email || '';
    } catch (error) {
        console.error('Fout bij ophalen van gegevens:', error);
    }
}

function displayCartItems() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const productListContainer = document.querySelector('.product-list');
    cartItemsContainer.innerHTML = '';
    productListContainer.innerHTML = '';

    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        document.querySelector(".total-price").textContent = `€0.00`;
        return;
    }

    cartItems.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.setAttribute('data-id', index + 1);

        itemElement.innerHTML = `
            <div class="item-info">
                <div class="item-icon material-icons">article</div>
                <div class="item-description">
                    <h3>${item.title}</h3> 
                    <p>${item.description}</p> 
                </div>
            </div>
            <div class="item-quantity-price">
                <span class="item-price">${item.price}</span> 
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

    updateSubtotal(cartItems);
}

// Functie om de subtotaal en productlijst weer te geven
function updateSubtotal(cartItems) {
    let subtotal = 0;
    const productListContainer = document.querySelector('.product-list');
    productListContainer.innerHTML = '';

    cartItems.forEach(item => {
        const itemPrice = parseFloat(item.price.replace('€', '')) * item.quantity;
        subtotal += itemPrice;

        const productItem = document.createElement('div');
        productItem.textContent = `${item.title} (${item.quantity}) - €${itemPrice.toFixed(2)}`;
        productListContainer.appendChild(productItem);
    });

    document.querySelector(".total-price").textContent = `€${subtotal.toFixed(2)}`;
}

// Toon items vanuit localStorage in de opgegeven container en bereken subtotaal
function displayItemsFromStorage() {
    const items = JSON.parse(localStorage.getItem('cart')) || [];
    const container = document.querySelector('.product-list');
    const subtotalContainer = document.querySelector('.total-price');
    
    container.innerHTML = ''; // Maak de container leeg

    let totalPrice = 0;
    if (items.length > 0) {
        items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.innerHTML = `${item.title} (${item.quantity}) - €${(parseFloat(item.price.replace('€', '')) * item.quantity).toFixed(2)}`;
            container.appendChild(itemDiv);

            totalPrice += parseFloat(item.price.replace('€', '')) * item.quantity; // Bereken de totale prijs
        });
    } else {
        container.innerHTML = "<p>Je winkelwagen is leeg.</p>";
    }

    // Zet de totale prijs in het subtotaal veld
    subtotalContainer.textContent = `€${totalPrice.toFixed(2)}`;
}

// Initialiseer pagina functies bij het laden van de pagina
window.onload = function() {
    getUserData(); // Haal gebruikersdata op als er een token is
    displayItemsFromStorage(); // Toon winkelwagen items en bereken subtotaal

    const form = document.getElementById('yourFormId'); // Zorg ervoor dat je de juiste ID gebruikt voor je formulier
    if (form) {
        form.addEventListener('submit', submitForm);
    }
};
