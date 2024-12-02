function redirectToSearchPage() {
    const searchTerm = document.getElementById('search-input').value;
    if (searchTerm.trim() !== "") {
        window.location.href = `../pages/search-results.html?query=${encodeURIComponent(searchTerm)}`;
    }
}
