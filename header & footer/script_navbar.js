document.querySelector('.nav-bar-menu-icon').addEventListener('click', function() {
    const navbar = document.querySelector('.navbar');
    const userIconContainer = document.querySelector('.user-icon-container');
    const dropdown = document.querySelector('.dropdown');
    const menuIcon = document.querySelector('.nav-bar-menu-icon span');

    // Toggle de navbar
    navbar.classList.toggle('expanded');
    menuIcon.textContent = navbar.classList.contains('expanded') ? 'close' : 'menu';

    // Toegepaste dropdown logica
    if (navbar.classList.contains('expanded')) {
        if (window.innerWidth > 1200) {
            dropdown.style.display = 'block'; // Maak de dropdown zichtbaar bij grotere schermen
            dropdown.style.opacity = '1';
        } else {
            dropdown.style.display = 'none'; // Verberg de dropdown bij kleinere schermen
        }
        userIconContainer.style.display = 'block'; // Maak de user-icon-container zichtbaar
    } else {
        dropdown.style.opacity = '0'; // Zet opacity naar 0 bij het sluiten
        setTimeout(() => {
            dropdown.style.display = 'none'; // Verberg de dropdown na de overgang
        }, 300);
    }
});
