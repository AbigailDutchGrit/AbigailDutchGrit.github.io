const cookieBox = document.querySelector(".cookie-wrapper"),
    acceptButton = document.querySelector("#acceptBtn"),
    infoButton = document.querySelector("#infoBtn"),
    anonymousButton = document.querySelector("#anonymousBtn"),
    fullFunctionButton = document.querySelector("#fullFunctionBtn"),
    popupOverlay = document.querySelector("#popupOverlay"),
    closePopup = document.querySelector("#closePopup");

const hidePopup = () => {
    popupOverlay.style.display = "none"; // Sluit popup
};

const setCookie = (name, value, days) => {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
};

// Nieuwe functie om de cookie-status te controleren
const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

const executeCodes = () => {
    const cookieConsent = getCookie("cookieConsent");

    // Toon de cookie-box als er geen cookie is of als deze is geweigerd
    if (!cookieConsent || cookieConsent === "rejected") {
        cookieBox.classList.add("show");
    }

    // Verberg de cookie-box bij 'Accept'
    acceptButton.addEventListener("click", () => {
        setCookie("cookieConsent", "accepted", 30); // Sla acceptatie op voor 30 dagen
        cookieBox.classList.remove("show"); // Verberg de cookie-box
    });

    // Toon de settings popup bij 'Info & settings'
    infoButton.addEventListener("click", () => {
        popupOverlay.style.display = "flex";
    });

    // Verberg popup en stel cookie in als geweigerd bij 'Anonymous Browsing'
    anonymousButton.addEventListener("click", () => {
        setCookie("cookieConsent", "rejected", 30); // Sla afwijzing op voor 30 dagen
        hidePopup(); // Verberg de popup
        cookieBox.classList.remove("show"); // Verberg de cookie-box
    });

    // Verberg popup en accepteer cookies bij 'Fully Functioning Website'
    fullFunctionButton.addEventListener("click", () => {
        setCookie("cookieConsent", "accepted", 30); // Sla acceptatie op voor 30 dagen
        hidePopup(); // Verberg de popup
        cookieBox.classList.remove("show"); // Verberg de cookie-box
    });

    // Sluit popup bij klikken op kruisje
    closePopup.addEventListener("click", hidePopup);

    // Sluit popup bij klikken buiten de box
    popupOverlay.addEventListener("click", (e) => {
        if (e.target === popupOverlay) {
            hidePopup();
        }
    });
};

// Voer de functie uit wanneer de pagina volledig geladen is
window.addEventListener("load", executeCodes);

document.addEventListener("DOMContentLoaded", () => {
    const infoprivacy = document.getElementById("infoprivacy");
    const popupOverlay = document.getElementById("popupOverlay"); // Zorg ervoor dat je het juiste element selecteert
    const popupbtn = document.getElementsByClassName("popup-options")

    infoprivacy.addEventListener("click", () => {
        popupOverlay.style.display = "flex";
    });
});
