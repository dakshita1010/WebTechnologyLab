(function() {
    const style = document.createElement('style');
    style.textContent = `
        body { font-family: system-ui, sans-serif; background: #f4f7f6; display: flex; justify-content: center; padding: 40px; }
        #form-container { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); width: 100%; max-width: 500px; }
        .progress-wrapper { margin-bottom: 2rem; }
        .progress-bar { height: 8px; background: #eee; border-radius: 4px; overflow: hidden; }
        #progress-fill { height: 100%; background: #4a90e2; width: 25%; transition: width 0.3s ease; }
        .step-labels { display: flex; justify-content: space-between; margin-top: 8px; font-size: 0.8rem; color: #666; }
        .form-stage { display: none; }
        .form-stage.active { display: block; }
        .input-group { margin-bottom: 1.2rem; }
        label { display: block; margin-bottom: 0.5rem; font-weight: bold; }
        input { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
        .error-msg { color: #d0021b; font-size: 0.8rem; margin-top: 4px; height: 1em; }
        .controls { display: flex; justify-content: space-between; margin-top: 2rem; }
        button { padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; font-weight: 600; }
        .btn-next { background: #4a90e2; color: white; }
        .btn-prev { background: #e0e0e0; color: #333; }
        button:disabled { opacity: 0.5; cursor: not-allowed; }
        .summary { background: #f9f9f9; padding: 10px; border-radius: 4px; }
    `;
    document.head.appendChild(style);

    const formData = {
        1: { name: '', email: '' },
        2: { phone: '', city: '' },
        3: { company: '', Role: '' },
        4: { terms: false }
    };

    let currentStep = 1;

    const container = document.createElement('div');
    container.id = 'form-container';
    document.body.appendChild(container);

    function render() {
        container.innerHTML = `
            <div class="progress-wrapper">
                <div class="progress-bar"><div id="progress-fill" style="width: ${(currentStep / 4) * 100}%"></div></div>
                <div class="step-labels">
                    <span>Identity</span><span>Location</span><span>Work</span><span>Confirm</span>
                </div>
            </div>
            <form id="multi-stage-form">
                <div class="form-stage ${currentStep === 1 ? 'active' : ''}" data-step="1">
                    <h3>Personal Details</h3>
                    <div class="input-group">
                        <label>Full Name</label>
                        <input type="text" id="name" value="${formData[1].name}" placeholder="John Doe">
                        <div id="err-name" class="error-msg"></div>
                    </div>
                    <div class="input-group">
                        <label>Email Address</label>
                        <input type="email" id="email" value="${formData[1].email}" placeholder="john@example.com">
                        <div id="err-email" class="error-msg"></div>
                    </div>
                </div>

                <div class="form-stage ${currentStep === 2 ? 'active' : ''}" data-step="2">
                    <h3>Address Information</h3>
                    <div class="input-group">
                        <label>Phone Number (10 digits)</label>
                        <input type="tel" id="phone" value="${formData[2].phone}" placeholder="1234567890">
                        <div id="err-phone" class="error-msg"></div>
                    </div>
                    <div class="input-group">
                        <label>City</label>
                        <input type="text" id="city" value="${formData[2].city}">
                        <div id="err-city" class="error-msg"></div>
                    </div>
                </div>

                <div class="form-stage ${currentStep === 3 ? 'active' : ''}" data-step="3">
                    <h3>Professional Info</h3>
                    <div class="input-group">
                        <label>Company Name</label>
                        <input type="text" id="company" value="${formData[3].company}">
                        <div id="err-company" class="error-msg"></div>
                    </div>
                    <div class="input-group">
                        <label>Role</label>
                        <input type="text" id="role" value="${formData[3].Role}">
                        <div id="err-role" class="error-msg"></div>
                    </div>
                </div>

                <div class="form-stage ${currentStep === 4 ? 'active' : ''}" data-step="4">
                    <h3>Review & Submit</h3>
                    <div class="summary">
                        <p><strong>Name:</strong> ${formData[1].name}</p>
                        <p><strong>Email:</strong> ${formData[1].email}</p>
                    </div>
                    <div class="input-group" style="margin-top:20px">
                        <label><input type="checkbox" id="terms" ${formData[4].terms ? 'checked' : ''}> I agree to terms</label>
                        <div id="err-terms" class="error-msg"></div>
                    </div>
                </div>

                <div class="controls">
                    ${currentStep > 1 ? '<button type="button" class="btn-prev" id="prevBtn">Previous</button>' : '<div></div>'}
                    ${currentStep < 4 
                        ? '<button type="button" class="btn-next" id="nextBtn">Next Step</button>' 
                        : '<button type="submit" class="btn-next" id="submitBtn">Submit Form</button>'}
                </div>
            </form>
        `;

        attachEventListeners();
    }

    function validateStep(step) {
        let isValid = true;
        const clearErrors = () => document.querySelectorAll('.error-msg').forEach(e => e.innerText = '');
        clearErrors();

        if (step === 1) {
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            if (name.length < 3) { 
                document.getElementById('err-name').innerText = 'Name must be at least 3 chars'; 
                isValid = false; 
            }
            if (!email.includes('@')) { 
                document.getElementById('err-email').innerText = 'Enter a valid email'; 
                isValid = false; 
            }
            if (isValid) { formData[1].name = name; formData[1].email = email; }
        } 
        else if (step === 2) {
            const phone = document.getElementById('phone').value;
            const city = document.getElementById('city').value;
            if (!/^\d{10}$/.test(phone)) { 
                document.getElementById('err-phone').innerText = 'Enter 10 digit number'; 
                isValid = false; 
            }
            if (!city) { 
                document.getElementById('err-city').innerText = 'City is required'; 
                isValid = false; 
            }
            if (isValid) { formData[2].phone = phone; formData[2].city = city; }
        }
        else if (step === 3) {
            const company = document.getElementById('company').value;
            const role = document.getElementById('role').value;
            if (!company) { document.getElementById('err-company').innerText = 'Company required'; isValid = false; }
            if (!role) { document.getElementById('err-role').innerText = 'Role required'; isValid = false; }
            if (isValid) { formData[3].company = company; formData[3].Role = role; }
        }
        else if (step === 4) {
            const terms = document.getElementById('terms').checked;
            if (!terms) { document.getElementById('err-terms').innerText = 'You must accept terms'; isValid = false; }
            if (isValid) { formData[4].terms = terms; }
        }

        return isValid;
    }

    function attachEventListeners() {
        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');
        const form = document.getElementById('multi-stage-form');

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (validateStep(currentStep)) {
                    currentStep++;
                    render();
                }
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentStep--;
                render();
            });
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validateStep(4)) {
                alert('Form Submitted Successfully!\n' + JSON.stringify(formData, null, 2));
                console.log('Final Data:', formData);
            }
        });
    }

    render();
})();