// Laad de zoekterm uit de URL
const urlParams = new URLSearchParams(window.location.search);
const searchTerm = urlParams.get('query');

// Vul de zoekterm in de zoekbalk in
document.getElementById('search-results-input').value = searchTerm;

// Functie om de zoekindex te laden en te zoeken
async function searchText() {
    const term = document.getElementById('search-results-input').value.trim();

    if (!term) {
        document.getElementById('results').innerHTML = '<p>Enter a search term.</p>';
        return;
    }

    try {
        // Laad de zoekindex
        const response = await fetch('../header & footer/search-index.json');
        const data = await response.json();

        // Configureer Fuse.js
        const options = {
            keys: ['title', 'content'],
            includeMatches: true,
            threshold: 0.4 // Aanpasbare gevoeligheid
        };

        const fuse = new Fuse(data, options);

        // Voer de zoekopdracht uit
        const results = fuse.search(term);

        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = '';

        if (results.length > 0) {
            results.forEach(result => {
                const item = result.item;
                const snippet = getSnippet(item.content, term);
                const resultElement = document.createElement('div');
                resultElement.classList.add('result-item');

                resultElement.innerHTML = `
                    <h3><a href="${item.url}">${item.title}</a></h3>
                    <p>${snippet}</p>
                `;
                resultsDiv.appendChild(resultElement);
            });
        } else {
            resultsDiv.innerHTML = '<p>No results found.</p>';
        }
    } catch (error) {
        console.error('Error loading the search index:', error);
        document.getElementById('results').innerHTML = '<p>An error occurred while executing the search query.</p>';
    }
}

function checkEnter(event) {
    if (event.key === 'Enter') {
        searchText();
    }
}

// Functie om een snippet met gemarkeerde zoekterm te maken
function getSnippet(content, term) {
    const index = content.toLowerCase().indexOf(term.toLowerCase());
    if (index === -1) return content;

    const start = Math.max(index - 30, 0);
    const end = Math.min(index + term.length + 30, content.length);
    const snippet = content.substring(start, end);
    const regex = new RegExp(`(${term})`, 'gi');
    return '...' + snippet.replace(regex, '<strong>$1</strong>') + '...';
}

// Voer direct de zoekactie uit op basis van de zoekterm
searchText();
