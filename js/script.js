// Wait until the page content is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // --- MODAL (POP-UP) LOGIC ---
    // This logic is shared by both book.html and reviews.html
    const form = document.querySelector('.booking-form-container form');
    const successModal = document.getElementById('success-modal');
    const failModal = document.getElementById('fail-modal');
    const overlay = document.querySelector('.overlay');
    const closeButtons = document.querySelectorAll('.btn-close-modal');

    // Check if we are on a page with a form and modals
    if (form && successModal && overlay) {
        
        // Function to close any open modal
        const closeModal = function() {
            const openModal = document.querySelector('.modal:not(.hidden)');
            if (openModal) {
                openModal.classList.add('hidden');
            }
            overlay.classList.add('hidden');
        };

        // Listen for the form to be submitted
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent page reload
            
            // For demonstration, we'll just show success.
            const isSuccess = true; 

            if (isSuccess) {
                successModal.classList.remove('hidden');
            } else {
                failModal.classList.remove('hidden');
            }
            overlay.classList.remove('hidden');
        });

        // Add a click listener to each close button
        closeButtons.forEach(btn => {
            btn.addEventListener('click', closeModal);
        });

        // Also close the modal if the user clicks on the dark overlay
        overlay.addEventListener('click', closeModal);
    } // End of modal form logic


    // --- VIDEO PLAYER LOGIC (for index.html) ---
    const videoContainer = document.getElementById('video-container');
    if (videoContainer) {
        const video = document.getElementById('hostel-video');
        const playBtn = document.getElementById('play-pause-btn');
        const bookBtn = document.getElementById('book-now-video-btn');

        playBtn.addEventListener('click', () => {
            if (video.paused) video.play(); else video.pause();
        });

        video.addEventListener('play', () => {
            videoContainer.classList.add('playing');
            playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        });

        video.addEventListener('pause', () => {
            videoContainer.classList.remove('playing');
            playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        });

        video.addEventListener('ended', () => {
            bookBtn.classList.remove('hidden');
        });

        video.addEventListener('click', () => {
            if (!video.paused) video.pause();
        });
    } // End of video player logic


    // --- STAR RATING LOGIC (for reviews.html) ---
    const starWrapper = document.querySelector('.star-rating');
    if (starWrapper) {
        const stars = starWrapper.querySelectorAll('.fa-star');
        const ratingInput = document.getElementById('rating');

        // Function to set the star appearance
        const setStars = (rating) => {
            stars.forEach(star => {
                if (star.dataset.value <= rating) {
                    star.classList.add('selected');
                } else {
                    star.classList.remove('selected');
                }
            });
        };

        stars.forEach(star => {
            // Fill stars on hover
            star.addEventListener('mouseover', () => {
                setStars(star.dataset.value);
            });

            // On mouse out, reset to the clicked rating
            star.addEventListener('mouseleave', () => {
                setStars(ratingInput.value);
            });

            // On click, set the rating value
            star.addEventListener('click', () => {
                ratingInput.value = star.dataset.value;
                setStars(ratingInput.value);
            });
        });
    } // End of star rating logic

});