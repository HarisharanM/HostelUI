// Wait until the page content is fully loaded
document.addEventListener('DOMContentLoaded', function() {

    // --- BOOKING FORM LOGIC ---
    // Find all the form elements
    const bookingForm = document.querySelector('.booking-form-container form');
    const successModal = document.getElementById('success-modal');
    const failModal = document.getElementById('fail-modal');
    const overlay = document.querySelector('.overlay');
    const closeButtons = document.querySelectorAll('.btn-close-modal');

    // This "if" check is important. It only runs the form code IF we are on the booking page.
    if (bookingForm) {

        // A function to close any open modal
        const closeModal = function() {
            const openModal = document.querySelector('.modal:not(.hidden)');
            if (openModal) {
                openModal.classList.add('hidden');
            }
            overlay.classList.add('hidden');
        };

        // Listen for the form to be submitted
        bookingForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent page reload

            // For demonstration, we'll just show success.
            // A real backend would determine if it's a success or fail.
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
    } // End of booking form logic


    // --- NEW VIDEO PLAYER LOGIC ---
    // Find all the video elements
    const videoContainer = document.getElementById('video-container');
    const video = document.getElementById('hostel-video');
    const playBtn = document.getElementById('play-pause-btn');
    const bookBtn = document.getElementById('book-now-video-btn');

    // This "if" check is important. It only runs the video code IF we are on the home page.
    if (videoContainer) {

        // 1. Play/Pause on button click
        playBtn.addEventListener('click', () => {
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        });

        // 2. When video starts playing, hide the play button
        video.addEventListener('play', () => {
            videoContainer.classList.add('playing');
            playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>'; // Change icon to pause
        });

        // 3. When video is paused, show the play button
        video.addEventListener('pause', () => {
            videoContainer.classList.remove('playing');
            playBtn.innerHTML = '<i class="fa-solid fa-play"></i>'; // Change icon back to play
        });

        // 4. When the video ENDS, show the "Book Room" button
        video.addEventListener('ended', () => {
            bookBtn.classList.remove('hidden');
        });

        // 5. If user clicks video to pause, also show play button
        video.addEventListener('click', () => {
            if (!video.paused) {
                video.pause();
            }
        });

    } // End of video player logic

});