// Function to show pop-up and hide it after 3 seconds
function showDeletePopup(productName, cartItemElement) {
    const popup = document.getElementById('delete-popup');
    const productNameElement = document.getElementById('product-name');

    // Zet de naam van het product in de pop-up
    productNameElement.textContent = `${productName} is verwijderd uit je winkelmand.`;

    // Toon de pop-up
    popup.classList.add('show');

    // Verberg de pop-up automatisch na 3 seconden
    setTimeout(() => {
        popup.classList.remove('show');

        // Verwijder het product uit de DOM nadat de pop-up verdwijnt
        cartItemElement.remove();
    }, 3000);
}

// Voeg event listeners toe aan alle delete knoppen
document.querySelectorAll('.delete-item').forEach(button => {
    button.addEventListener('click', function () {
        // Haal de naam van het product op uit de corresponderende cart-item
        const productName = this.closest('.cart-item').querySelector('h3').textContent;

        // Toon de pop-up met de productnaam, maar verwijder het item pas na de popup
        showDeletePopup(productName, this.closest('.cart-item'));
    });
});
