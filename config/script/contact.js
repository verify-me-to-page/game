// Contact form functionality
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactForm();
        });
    }
});

function handleContactForm() {
    const form = document.getElementById('contactForm');
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Basic validation
    const name = formData.get('name').trim();
    const email = formData.get('email').trim();
    const message = formData.get('message').trim();
    
    if (!name || !email || !message) {
        alert('Please fill in all required fields');
        return;
    }
    
    if (!validateEmail(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    // Add loading state
    addLoadingState(submitBtn);
    
    // Simulate form submission
    setTimeout(() => {
        // Hide form and show success message
        form.style.display = 'none';
        document.getElementById('formSuccess').style.display = 'block';
        
        removeLoadingState(submitBtn);
        
        // Reset form
        form.reset();
    }, 1500);
}

function resetForm() {
    const form = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    
    form.style.display = 'block';
    formSuccess.style.display = 'none';
}

// Form field enhancements
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        // Add focus/blur effects
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
            if (this.value.trim() !== '') {
                this.parentElement.classList.add('filled');
            } else {
                this.parentElement.classList.remove('filled');
            }
        });
        
        // Check if already filled on page load
        if (input.value.trim() !== '') {
            input.parentElement.classList.add('filled');
        }
    });
});