document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const formStatus = document.getElementById('form-status');
    const progressBar = document.getElementById('progress-bar');
    const submitButton = form.querySelector('button[type="submit"]');

    // Utility to validate email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Function to validate the form
    function validateForm() {
        let isValid = true;
        // Clear previous errors
        form.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        form.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));

        // Fields to validate: [inputId, errorId, errorMessage]
        const fieldsToValidate = [
            ['name-input', 'name-error', 'Votre nom complet est requis.'],
            ['email-input', 'email-error', 'Une adresse email valide est requise.'],
            ['subject-select', 'subject-error', 'Veuillez choisir un sujet.'],
            ['message-textarea', 'message-error', 'Un message est requis.']
        ];

        fieldsToValidate.forEach(([inputId, errorId, message]) => {
            const input = document.getElementById(inputId);
            const error = document.getElementById(errorId);
            let fieldIsValid = true;

            if (!input.value.trim()) {
                fieldIsValid = false;
            }

            if (input.type === 'email' && !isValidEmail(input.value.trim())) {
                fieldIsValid = false;
            }

            if (!fieldIsValid) {
                error.textContent = message;
                input.classList.add('invalid');
                isValid = false;
            }
        });

        // NOTE POUR RECAPTCHA : Si vous réactivez reCAPTCHA dans contact.html,
        // vous devrez ajouter la logique de validation ici. Par exemple :
        // const recaptchaResponse = grecaptcha.getResponse();
        // if (!recaptchaResponse) {
        //     // Affichez un message d'erreur pour le reCAPTCHA
        //     isValid = false;
        return isValid;
    }

    // Handle form submission
    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        // 1. Validate form
        if (!validateForm()) {
            return;
        }

        // 2. Update UI for submission
        submitButton.disabled = true;
        submitButton.textContent = 'Envoi en cours...';
        formStatus.innerHTML = '';
        formStatus.className = '';
        progressBar.style.display = 'block';
        progressBar.style.width = '0%';

        // Simulate progress
        setTimeout(() => { progressBar.style.width = '50%'; }, 100);
        setTimeout(() => { progressBar.style.width = '90%'; }, 500);

        const formData = new FormData(form);

        try {
            // 3. Send data
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            // 4. Handle response
            if (response.ok) {
                progressBar.style.width = '100%';
                setTimeout(() => {
                    // Hide form and show success message
                    form.style.display = 'none';
                    formStatus.innerHTML = `
                        <div class="form-success-message">
                            <i class="fas fa-check-circle"></i>
                            <h2>Message envoyé avec succès !</h2>
                            <p>Merci de nous avoir contactés. Nous reviendrons vers vous très prochainement.</p>
                        </div>
                    `;
                }, 500); // Wait for progress bar animation
            } else {
                throw new Error('Network response was not ok.');
            }

        } catch (error) {
            console.error('Error:', error);
            // 5. Handle errors
            progressBar.style.display = 'none';
            formStatus.textContent = 'Une erreur est survenue. Impossible d\'envoyer le message. Veuillez réessayer.';
            formStatus.className = 'error';
            submitButton.disabled = false;
            submitButton.textContent = 'Envoyer le message';
        }
    });

    // Add real-time validation feedback as user types
    form.querySelectorAll('input, textarea, select').forEach(input => {
        input.addEventListener('blur', validateForm);
        input.addEventListener('input', () => {
            if (input.classList.contains('invalid')) {
                validateForm(); // Re-validate to clear error when user starts typing
            }
        });
    });
});