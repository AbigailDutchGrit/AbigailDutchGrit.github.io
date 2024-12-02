// Google Translate initialisatie
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',  // Zet de pagina taal op Engels
        includedLanguages: 'af,sq,am,ar,hy,az,eu,bs,bg,ca,ceb,ny,zh-CN,zh-TW,co,hr,da,nl,en,eo,et,tl,fi,fr,gl,ka,de,el,gu,hu,is,id,ga,it,ja,jw,kn,kk,km,ko,hr,la,lv,lt,mk,ms,mt,mi,mr,mn,ne,no,fa,pl,pt,pt-BR,ro,ru,sr,sd,sk,sl,es,sw,ta,te,th,cs,tr,uk,ur,vi,cy,be,xh,zu',  // Talen waarin je wilt vertalen
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false,
        multilanguagePage: true
    }, 'google_translate_element');
}

// Voorkomt dat de pagina omhoog springt bij het selecteren van een taal
document.addEventListener("DOMContentLoaded", function() {
    const translateElement = document.getElementById("google_translate_element");
    if (translateElement) {
        translateElement.addEventListener("click", function(event) {
            event.preventDefault();
        });
    }
});
