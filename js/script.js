// --- STEP 1: IMPORT FIREBASE MODULES ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";

// --- STEP 2: PASTE YOUR FIREBASE CONFIG HERE ---
// PASTE YOUR REAL FIREBASE CONFIG OBJECT HERE
const firebaseConfig = {
  apiKey: "AIzaSyAFPzLksJDtKIdsiPUee-FXPpbGUdCGjRE",
  authDomain: "gurukripa-hostel-7f12b.firebaseapp.com",
  projectId: "gurukripa-hostel-7f12b",
  storageBucket: "gurukripa-hostel-7f12b.firebasestorage.app",
  messagingSenderId: "10388060466",
  appId: "1:10388060466:web:47e2f0e181030e33afff2b",
  measurementId: "G-FVQQR3EEYS"
};

// --- STEP 3: INITIALIZE FIREBASE ---
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);


// --- STEP 4: ALL YOUR PAGE LOGIC ---
document.addEventListener('DOMContentLoaded', function() {
    
    // --- MODAL (POP-UP) LOGIC ---
    const form = document.querySelector('.booking-form-container form');
    const successModal = document.getElementById('success-modal');
    const failModal = document.getElementById('fail-modal');
    const overlay = document.querySelector('.overlay');
    const closeButtons = document.querySelectorAll('.btn-close-modal');

    if (form && successModal && overlay) {
        
        const closeModal = function() {
            const openModal = document.querySelector('.modal:not(.hidden)');
            if (openModal) openModal.classList.add('hidden');
            overlay.classList.add('hidden');
        };

        closeButtons.forEach(btn => btn.addEventListener('click', closeModal));
        overlay.addEventListener('click', closeModal);

        // --- UPDATED FORM SUBMIT LOGIC ---
        form.addEventListener('submit', async function(event) {
            event.preventDefault(); 
            const submitButton = form.querySelector('button[type="submit"]');
            
            // 1. If it's the REVIEW FORM
            if (form.closest('.review-form')) {
                submitButton.disabled = true;
                submitButton.textContent = "Submitting...";
                
                const name = document.getElementById('name').value;
                const rating = document.getElementById('rating').value;
                const message = document.getElementById('review-message').value;

                try {
                    await addDoc(collection(db, "reviews"), {
                        name: name,
                        rating: Number(rating),
                        message: message,
                        submittedAt: serverTimestamp() 
                    });
                    
                    successModal.classList.remove('hidden');
                    overlay.classList.remove('hidden');
                    form.reset();
                    // Reset stars after successful submit
                    const starWrapper = document.querySelector('.star-rating');
                    if (starWrapper) {
                        starWrapper.querySelectorAll('.fa-star').forEach(s => s.classList.remove('selected'));
                        document.getElementById('rating').value = 0;
                    }

                } catch (error) {
                    console.error("Error adding review: ", error);
                    failModal.classList.remove('hidden');
                    overlay.classList.remove('hidden');
                } finally {
                    submitButton.disabled = false;
                    submitButton.textContent = "Submit Review";
                }
            }

            // 2. If it's the RESIDENCY FORM (book.html)
            else if (form.id === 'residency-form') {
                submitButton.disabled = true;
                submitButton.textContent = "Submitting, please wait...";

                try {
                    const formData = new FormData(form);
                    const textData = {};
                    formData.forEach((value, key) => {
                        if (typeof value !== 'object') {
                            textData[key] = value;
                        }
                    });

                    const uploadFile = async (fileInputId) => {
                        const file = document.getElementById(fileInputId).files[0];
                        if (!file) return null; 
                        
                        const filePath = `applications/${textData.name.replace(/\s+/g, '_')}_${fileInputId}_${Date.now()}_${file.name}`;
                        const fileRef = ref(storage, filePath);
                        await uploadBytes(fileRef, file);
                        const url = await getDownloadURL(fileRef);
                        return url;
                    };

                    const aadhaarUrl = await uploadFile('aadhaar-card');
                    const collegeIdUrl = await uploadFile('college-id-file');
                    const photoUrl = await uploadFile('passport-photo');
                    const policeVerificationUrl = await uploadFile('police-verification');

                    const finalApplication = {
                        ...textData,
                        fileUploads: {
                            aadhaarCard: aadhaarUrl,
                            collegeId: collegeIdUrl,
                            passportPhoto: photoUrl,
                            policeVerification: policeVerificationUrl
                        },
                        submittedAt: serverTimestamp()
                    };

                    await addDoc(collection(db, "applications"), finalApplication);
                    
                    successModal.classList.remove('hidden');
                    overlay.classList.remove('hidden');
                    form.reset();

                } catch (error) {
                    console.error("Error submitting application: ", error);
                    failModal.classList.remove('hidden');
                    overlay.classList.remove('hidden');
                } finally {
                    submitButton.disabled = false;
                    submitButton.textContent = "Submit Application";
                }
            }
        });
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
    // This is the code that makes the stars work
    const starWrapper = document.querySelector('.star-rating');
    if (starWrapper) {
        const stars = starWrapper.querySelectorAll('.fa-star');
        const ratingInput = document.getElementById('rating');

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
            star.addEventListener('mouseover', () => setStars(star.dataset.value));
            star.addEventListener('mouseleave', () => setStars(ratingInput.value));
            star.addEventListener('click', () => {
                ratingInput.value = star.dataset.value;
                setStars(ratingInput.value);
            });
        });
    } // End of star rating logic

});