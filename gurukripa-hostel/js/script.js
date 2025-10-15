document.addEventListener('DOMContentLoaded', function() {
    
    const bookingForm = document.querySelector('.booking-form-container form');
    const successModal = document.getElementById('success-modal');
    const failModal = document.getElementById('fail-modal');
    const overlay = document.querySelector('.overlay');
    const closeButtons = document.querySelectorAll('.btn-close-modal');

    // A function to close any open modal
    const closeModal = function() {
        // We find which modal is currently not hidden and hide it
        const openModal = document.querySelector('.modal:not(.hidden)');
        if (openModal) {
            openModal.classList.add('hidden');
        }
        overlay.classList.add('hidden');
    };

    // Listen for the form to be submitted
    bookingForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const isSuccess = true; // Change this to false to test the fail pop-up

        
        if (isSuccess) {
            successModal.classList.remove('hidden');
        } else {
            failModal.classList.remove('hidden');
        }
        overlay.classList.remove('hidden');
    });

    
    closeButtons.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    
    overlay.addEventListener('click', closeModal);

});