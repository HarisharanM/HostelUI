
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {  
  apiKey: "AIzaSyAFPzLksJDtKIdsiPUee-FXPpbGUdCGjRE",
  authDomain: "gurukripa-hostel-7f12b.firebaseapp.com",
  projectId: "gurukripa-hostel-7f12b",
  storageBucket: "gurukripa-hostel-7f12b.firebasestorage.app",
  messagingSenderId: "10388060466",
  appId: "1:10388060466:web:47e2f0e181030e33afff2b",
  measurementId: "G-FVQQR3EEYS"
};

const CLOUDINARY_CLOUD_NAME = "dzokzb1rj"; 
const CLOUDINARY_UPLOAD_PRESET = "hostel-application"; 

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


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

        form.addEventListener('submit', async function(event) {
            event.preventDefault(); 
            const submitButton = form.querySelector('button[type="submit"]');
            
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

            else if (form.id === 'residency-form') {
                submitButton.disabled = true;
                submitButton.textContent = "Uploading files, please wait...";

                try {
                    const uploadFile = async (fileInputId) => {
                        const file = document.getElementById(fileInputId).files[0];
                        if (!file) return null; 

                        const formData = new FormData();
                        formData.append('file', file);
                        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

                        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`, {
                            method: 'POST',
                            body: formData
                        });

                        const data = await response.json();
                        if (data.secure_url) {
                            return data.secure_url; 
                        } else {
                            throw new Error('File upload to Cloudinary failed.');
                        }
                    };

                    const formElementData = new FormData(form);
                    const textData = {};
                    formElementData.forEach((value, key) => {
                        if (typeof value !== 'object') {
                            textData[key] = value;
                        }
                    });

                    const aadhaarUrl = await uploadFile('aadhaar-card');
                    const collegeIdUrl = await uploadFile('college-id-file');
                    const photoUrl = await uploadFile('passport-photo');
                    const policeVerificationUrl = await uploadFile('police-verification');
                    
                    submitButton.textContent = "Saving application...";

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
                    
                    window.location.href = 'payment.html';
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


    const videoContainer = document.getElementById('video-container');
    if (videoContainer) {
       
    } 


    const starWrapper = document.querySelector('.star-rating');
    if (starWrapper) {
    } 

});