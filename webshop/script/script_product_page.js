// Globale variabelen
let product; // Maak product globaal

// Functie om de queryparameters uit de URL te halen
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Haal de productcode uit de URL
const productCode = getQueryParam('code');

// Laad de producten JSON
fetch('products.json')
    .then(response => response.json())
    .then(data => {
        // Zoek het product op basis van de code
        for (const [group, productsList] of Object.entries(data.discipline_group)) {
            product = productsList.find(p => p.code === productCode);
            if (product) break; // Stop met zoeken als het product is gevonden
        }

        // Controleer of het product gevonden is
        if (product) {
            renderProductPage(product);
        } else {
            console.error('Product not found');
            document.querySelector('#product-title').textContent = "Product not found";
        }
    })
    .catch(error => console.error('Error loading products:', error));

// Functie om de productgegevens op de pagina weer te geven
async function renderProductPage(product) {
    document.querySelector('#product-title').textContent = product.product;
    document.querySelector('#product-image').src = product.image || 'https://via.placeholder.com/600x800';
    document.querySelector('#product-description').textContent = product.long_description;

    // Update de prijs in de popup
    document.querySelector('#product-price').textContent = `Price: €${product.price}`;

    // Haal aanbevolen producten op voor de 'Frequently Bought Together' sectie
    const recommendedProducts = await fetchRecommendedProducts(product.code);
    displayFrequentlyBoughtTogether(recommendedProducts);
}

function displayFrequentlyBoughtTogether(recommendedProducts) {
    const thumbnailsContainer = document.querySelector('.product-thumbnails');
    thumbnailsContainer.innerHTML = ''; // Leeg de container

    // Voeg elk aanbevolen product toe aan de thumbnails-container
    recommendedProducts.forEach(product => {
        const productThumbnail = document.createElement('div');
        productThumbnail.classList.add('thumbnail-wrapper'); // Voeg deze klasse toe
        productThumbnail.innerHTML = `
            <img src="${product.image}" alt="${product.product}" class="thumbnail-image">
            <div class="overlay">${truncatefreq(product.product)}</div>
        `;

        // Voeg een click event listener toe die naar de productpagina leidt
        productThumbnail.addEventListener('click', () => {
            window.location.href = `product.html?code=${product.code}`; // Zorg ervoor dat dit de juiste URL is
        });

        thumbnailsContainer.appendChild(productThumbnail);
    });
}

function truncatefreq(title, maxLength = 15) {
    return title.length > maxLength ? title.slice(0, maxLength) + '...' : title;
}

// Voeg een event listener toe aan de "Add to Cart" knop
document.querySelector('.add-to-cart').addEventListener('click', function () {
    const productTitle = document.querySelector('#product-title').textContent;
    const productImage = document.querySelector('#product-image').src;
    const shortDescription = document.querySelector('#product-description').textContent;

    const quantityInput = document.querySelector('#quantity-input'); // Zorg ervoor dat je een input hebt met deze ID
    const quantity = quantityInput ? parseInt(quantityInput.value, 10) : 1; // Standaard naar 1 als er geen input is

    const productPrice = product.price; // Gebruik de prijs uit het globale product object

    addToCart(productTitle, productCode, productPrice, productImage, shortDescription, quantity);
});

function addToCart(productTitle, productCode, productPrice, productImage, short_description = 'Geen beschrijving beschikbaar.', quantity = 1, fromPopup = false) {
    if (!productTitle || productTitle.includes('${') || !productCode || productCode.includes('${') || !productPrice || !productImage) {
        return; // Stop de functie als informatie ontbreekt of onjuist is
    }

    console.log("Adding to cart:", { title: productTitle, code: productCode, price: productPrice, description: short_description, quantity });

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let existingProduct = cart.find(item => item.code === productCode);

    if (existingProduct) {
        existingProduct.quantity += quantity; // Verhoog de hoeveelheid als het product al bestaat
    } else {
        let product = {
            title: productTitle,
            code: productCode,
            price: productPrice,
            image: productImage,
            description: short_description,
            quantity: quantity
        };
        cart.push(product);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();

    if (!fromPopup) {
        loadPopup(productTitle, productPrice, productImage, productCode, short_description);
    } else {
        console.log('Geen popup omdat het product via een bestaande popup is toegevoegd.');
    }

    const popupbutton = document.getElementById(`add-to-cart-${productCode}`);
    if (popupbutton) {
        popupbutton.style.backgroundColor = '#2f7193'; // Verander naar donkerblauw
        popupbutton.style.color = 'white';
        popupbutton.style.fontSize = '14px';
        popupbutton.disabled = true;
        popupbutton.innerHTML = 'Added to Cart';
    }
}

async function loadPopup(productName, productPrice, productImage, productCode, short_description) {
    console.log("Loading popup for:", productCode);

    const recommendedProducts = await fetchRecommendedProducts(productCode);
    showPopup(productName, productPrice, productImage, short_description, recommendedProducts);
}

async function fetchRecommendedProducts(productCode) {
    const departmentCode = productCode.slice(0, 3);
    try {
        const response = await fetch('products.json');
        const data = await response.json();
        let allProducts = [];
        for (const group in data.discipline_group) {
            allProducts = allProducts.concat(data.discipline_group[group]);
        }

        return allProducts
            .filter(product => product.code.startsWith(departmentCode) && product.code !== productCode)
            .slice(0, 3)
            .map(product => ({
                code: product.code,
                product: product.product,
                price: product.price || 'Price not available',
                image: product.image || "https://via.placeholder.com/150"
            }));
    } catch (error) {
        console.error("Error loading products.json:", error);
        return [];
    }
}

async function showPopup(productName, productPrice, productImage, short_description, recommendedProducts) {
    console.log("Showing popup for product:", productName);

    const popup = document.getElementById('popup');
    const overlay = document.getElementById('popup-overlay');

    // Update product information in the popup
    document.querySelector('.popup-product img').src = productImage || 'https://via.placeholder.com/150';
    document.querySelector('.popup-product .product-info h3').textContent = productName;

    // Stel de initiële prijs in
    const priceElement = document.getElementById('popup-product-price'); // Zorg dat deze ID aanwezig is in de popup
    priceElement.textContent = `€${parseFloat(productPrice).toFixed(2)}`;

    // Verwijder bestaande hoeveelheid invoer (indien aanwezig)
    const existingQuantityContainer = document.querySelector('.quantity-container');
    if (existingQuantityContainer) {
        existingQuantityContainer.remove();
    }

    // Voeg nieuwe hoeveelheid invoer toe
    const quantityContainer = document.createElement('div');
    quantityContainer.classList.add('quantity-container');
    quantityContainer.innerHTML = `
        <label for="popup-quantity">Aantal:</label>
        <input type="number" id="popup-quantity" value="1" min="1" style="width: 50px; margin-left: 5px;">
    `;
    document.querySelector('.popup-product .product-info').appendChild(quantityContainer);

    // Event listener om de prijs live te berekenen in de popup
    const quantityInput = document.getElementById('popup-quantity');
    quantityInput.addEventListener('input', () => {
        const quantity = parseInt(quantityInput.value, 10) || 1; // Haal de hoeveelheid op, standaard naar 1
        const totalPrice = (parseFloat(productPrice) * quantity).toFixed(2);
        priceElement.textContent = `€${totalPrice}`; // Update alleen in de popup

        updateCartPriceInPopup(productName, totalPrice, quantity);
    });

    // Voeg aanbevolen producten toe aan de popup
    const recommendedProductsContainer = document.querySelector('.popup-recommendations');
    recommendedProductsContainer.innerHTML = ''; // Clear de container

    const headerElement = document.createElement('div');
    headerElement.classList.add('popup-header');
    headerElement.innerHTML = '<p>You may also like</p>';
    recommendedProductsContainer.appendChild(headerElement);

    recommendedProducts.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('popup-recommendation');
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.product}" class="recommendation-image">
            <div class="recommendation-info">
                <h3>${truncatefreq(product.product)}</h3>
                <p>€${parseFloat(product.price).toFixed(2)}</p>
            </div>
            <div class="recommendation-footer">
                <p style="display: none;">${product.short_description || 'Geen beschrijving beschikbaar.'}</p>
                <button class="pink_button" id="add-to-cart-${product.code}" onclick="addToCart('${product.product}', '${product.code}', '${product.price}', '${product.image}', '${product.short_description || ''}', 1, true)">
                    <span class="material-icons notranslate">add_shopping_cart</span>
                </button>
            </div>`;
        recommendedProductsContainer.appendChild(productElement);
    });

    // Toon de popup en overlay
    popup.style.display = 'block';
    overlay.style.display = 'block';
}



function updateCartPriceInPopup(productName, totalPrice, quantity) {
    // Haal de huidige winkelwagen op uit localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Zoek het bestaande product in de winkelwagen
    let existingProduct = cart.find(item => item.title === productName);

    if (existingProduct) {
        // Werk de hoeveelheid bij in de winkelwagen
        existingProduct.quantity = quantity;
        existingProduct.price = totalPrice;
    }

    // Sla de bijgewerkte winkelwagen op in localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Optioneel: update de winkelwagen teller (als je die ergens hebt)
    updateCartCount();
}

function hideStorePopup() {
    document.getElementById('popup').style.display = 'none';
    document.getElementById('popup-overlay').style.display = 'none';
}

function updateCartCount() {
    // Haal de winkelwageninhoud op uit localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Tel de hoeveelheden van alle producten op
    let itemCount = cart.reduce((total, item) => total + item.quantity, 0);

    // Update de teller in de HTML
    document.getElementById('cart-count').textContent = itemCount;
}


document.addEventListener('DOMContentLoaded', updateCartCount);

