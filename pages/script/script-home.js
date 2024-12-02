document.addEventListener('DOMContentLoaded', () => {
    const carouselTrack = document.querySelector('.home-carousel-track');
    const slides = Array.from(carouselTrack.children);
    const nextButton = document.querySelector('.home-carousel-button.right');
    const prevButton = document.querySelector('.home-carousel-button.left');
    
    let currentSlide = 0;
    let isPaused = false; // Variable to track if carousel is paused
    const slideIntervalTime = 3000; // Time in ms between automatic slide transitions
    const slideWidth = 265; // Set slide width to match the width of the images (250px)

    // Set the position of each slide next to each other
    const setSlidePosition = (slide, index) => {
        slide.style.left = `${index * slideWidth}px`; // arrange slides based on their index
    };
    
    slides.forEach(setSlidePosition);

    // Function that moves the carousel to a specific slide based on the current index
    const moveToSlide = (currentIndex) => {
        carouselTrack.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    };

    // Automatically move to the next slide
    const autoSlide = () => {
        if (!isPaused) {
            currentSlide = (currentSlide + 1) % slides.length;
            moveToSlide(currentSlide);
        }
    };

    // Start auto-sliding
    let slideInterval = setInterval(autoSlide, slideIntervalTime);

    // Pause on hover
    carouselTrack.addEventListener('mouseover', () => {
        isPaused = true;
    });

    // Resumes the carousel sliding when the mouse leaves the carousel track
    carouselTrack.addEventListener('mouseout', () => {
        isPaused = false;
    });

    // Reset the slide interval
    const resetSlideInterval = () => {
        clearInterval(slideInterval);
        slideInterval = setInterval(autoSlide, slideIntervalTime);
    };

    // Move to the next slide on right button click
    nextButton.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % slides.length;
        moveToSlide(currentSlide);
        resetSlideInterval();
    });

    // Move to the previous slide on left button click
    prevButton.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        moveToSlide(currentSlide);
        resetSlideInterval();
    });

});

// Video control to play when mouse enters
const video = document.querySelector('.home-hero-video');
if (video) {
    video.addEventListener('mouseenter', () => {
        video.play(); // Speel de video af als je eroverheen gaat
    });
}
