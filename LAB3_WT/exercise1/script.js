(function() {
    const style = document.createElement('style');
    style.textContent = `
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f4f7f6; display: flex; justify-content: center; padding: 40px; }
        .form-container { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); width: 100%; max-width: 450px; }
        h2 { text-align: center; color: #333; margin-bottom: 20px; }
        .field-group { margin-bottom: 15px; position: relative; }
        label { display: block; margin-bottom: 5px; font-weight: 600; color: #555; font-size: 14px; }
        input, select { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; transition: border 0.3s; }
        input.invalid { border-color: #e74c3c; background-color: #fdf2f2; }
        .error-msg { color: #e74c3c; font-size: 12px; margin-top: 4px; min-height: 15px; }
        .strength-meter { height: 4px; background: #eee; margin-top: 5px; border-radius: 2px; overflow: hidden; }
        .strength-bar { height: 100%; width: 0; transition: width 0.3s, background 0.3s; }
        button { width: 100%; padding: 12px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; margin-top: 10px; }
        button:disabled { background: #bdc3c7; cursor: not-allowed; }
        .hidden { display: none; }
    `;
    document.head.appendChild(style);

    const container = document.createElement('div');
    container.className = 'form-container';
    container.innerHTML = `
        <h2>Member Registration</h2>
        <form id="regForm" novalidate>
            <div class="field-group">
                <label>Full Name</label>
                <input type="text" id="name" placeholder="John Doe">
                <div id="nameError" class="error-msg"></div>
            </div>
            <div class="field-group">
                <label>Email Address</label>
                <input type="email" id="email" placeholder="email@domain.com">
                <div id="emailError" class="error-msg"></div>
            </div>
            <div class="field-group">
                <label>Role</label>
                <select id="role">
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
            <div class="field-group">
                <label>Age</label>
                <input type="number" id="age">
                <div id="ageError" class="error-msg"></div>
            </div>
            <div class="field-group" id="skillsContainer">
                <label>Primary Skill / Subject</label>
                <input type="text" id="skills">
                <div id="skillsError" class="error-msg"></div>
            </div>
            <div class="field-group">
                <label>Password</label>
                <input type="password" id="password">
                <div class="strength-meter"><div id="strengthBar" class="strength-bar"></div></div>
                <div id="passwordError" class="error-msg"></div>
            </div>
            <div class="field-group">
                <label>Confirm Password</label>
                <input type="password" id="confirmPassword">
                <div id="confirmError" class="error-msg"></div>
            </div>
            <button type="submit" id="submitBtn">Create Account</button>
        </form>
    `;
    document.body.appendChild(container);

    const form = document.getElementById('regForm');
    const roleSelect = document.getElementById('role');
    const inputs = form.querySelectorAll('input');

    const rules = {
        student: { minAge: 13, maxAge: 100, pwdRegex: /.{6,}/, pwdHint: "Min 6 characters" },
        teacher: { minAge: 21, maxAge: 70, pwdRegex: /^(?=.*[A-Z]).{8,}$/, pwdHint: "Min 8 chars + 1 Uppercase" },
        admin: { minAge: 25, maxAge: 65, pwdRegex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{12,}$/, pwdHint: "Min 12 chars, Uppercase, Number & Symbol" }
    };

    const validateField = (id, isValid, message = "") => {
        const input = document.getElementById(id);
        const errorDiv = document.getElementById(id + 'Error');
        if (isValid) {
            input.classList.remove('invalid');
            errorDiv.textContent = "";
        } else {
            input.classList.add('invalid');
            errorDiv.textContent = message;
        }
        return isValid;
    };

    const checkPasswordStrength = (pwd) => {
        const bar = document.getElementById('strengthBar');
        let score = 0;
        if (pwd.length > 5) score++;
        if (/[A-Z]/.test(pwd)) score++;
        if (/[0-9]/.test(pwd)) score++;
        if (/[@$!%*?&]/.test(pwd)) score++;

        const colors = ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71'];
        bar.style.width = (score * 25) + "%";
        bar.style.backgroundColor = colors[score - 1] || '#eee';
    };

    const runValidation = () => {
        const role = roleSelect.value;
        const config = rules[role];
        let isFormValid = true;

        const name = document.getElementById('name').value;
        if (!validateField('name', name.trim().length > 2, "Name must be at least 3 characters")) isFormValid = false;

        const email = document.getElementById('email').value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!validateField('email', emailRegex.test(email), "Please enter a valid email domain")) isFormValid = false;

        const age = parseInt(document.getElementById('age').value);
        if (!validateField('age', age >= config.minAge && age <= config.maxAge, `Age for ${role} must be ${config.minAge}-${config.maxAge}`)) isFormValid = false;

        if (role !== 'admin') {
            const skill = document.getElementById('skills').value;
            if (!validateField('skills', skill.trim().length > 0, "This field is required")) isFormValid = false;
        }

        const password = document.getElementById('password').value;
        if (!validateField('password', config.pwdRegex.test(password), config.pwdHint)) isFormValid = false;

        const confirm = document.getElementById('confirmPassword').value;
        if (!validateField('confirmPassword', confirm === password && confirm !== "", "Passwords do not match")) isFormValid = false;

        return isFormValid;
    };

    roleSelect.addEventListener('change', () => {
        const skillsContainer = document.getElementById('skillsContainer');
        skillsContainer.className = (roleSelect.value === 'admin') ? 'field-group hidden' : 'field-group';
        runValidation();
    });

    inputs.forEach(input => {
        input.addEventListener('input', () => {
            if (input.id === 'password') checkPasswordStrength(input.value);
            runValidation();
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (runValidation()) {
            alert('Registration Successful for ' + roleSelect.value + '!');
            form.reset();
            document.getElementById('strengthBar').style.width = "0";
        } else {
            alert('Please correct the errors before submitting.');
        }
    });
})();