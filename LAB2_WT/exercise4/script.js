document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const userTableBody = document.querySelector('#userTable tbody');
    const clearAllButton = document.getElementById('clearAllButton');
    const noUsersMessage = document.getElementById('noUsersMessage');

    loadUsers();

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        registerUser();
    });

    clearAllButton.addEventListener('click', clearAllUsers);

    function getUsers() {
        const usersJSON = localStorage.getItem('users');
        return usersJSON ? JSON.parse(usersJSON) : [];
    }

    function saveUsers(users) {
        localStorage.setItem('users', JSON.stringify(users));
    }

    function registerUser() {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const mobile = document.getElementById('mobile').value.trim();
        const password = document.getElementById('password').value;

        if (!name || !email || !mobile || !password) {
            alert('All fields are mandatory.');
            return;
        }

        const mobileRegex = /^\d{10}$/;
        if (!mobileRegex.test(mobile)) {
            alert('Mobile number must be exactly 10 digits.');
            return;
        }

        if (password.length < 6) {
            alert('Password must be a minimum of 6 characters.');
            return;
        }
        
        const users = getUsers();
        if (users.some(user => user.email === email)) {
            alert('Registration failed: An account with this email already exists.');
            return;
        }
        
        const newUser = {
            id: Date.now(),
            name: name,
            email: email,
            mobile: mobile,
            password: password
        };

        users.push(newUser);
        saveUsers(users);

        alert('User Registered Successfully!');
        form.reset();
        displayUsers(users);
    }

    function displayUsers(users = getUsers()) {
        userTableBody.innerHTML = '';

        if (users.length === 0) {
            noUsersMessage.style.display = 'block';
            return;
        } else {
            noUsersMessage.style.display = 'none';
        }

        users.forEach(user => {
            const row = userTableBody.insertRow();
            
            row.insertCell().textContent = user.name;
            row.insertCell().textContent = user.email;
            row.insertCell().textContent = user.mobile;

            const actionCell = row.insertCell();
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-btn');
            deleteButton.onclick = () => deleteUser(user.id);
            actionCell.appendChild(deleteButton);
        });
    }

    function deleteUser(userId) {
        if (!confirm('Are you sure you want to delete this user?')) {
            return;
        }

        let users = getUsers();
        users = users.filter(user => user.id !== userId);
        
        saveUsers(users);
        displayUsers(users);
        alert('User deleted successfully.');
    }

    function clearAllUsers() {
        if (!confirm('WARNING: This will permanently delete ALL registered users. Proceed?')) {
            return;
        }

        localStorage.removeItem('users');
        displayUsers([]);
        alert('All users have been cleared from storage.');
    }

    function loadUsers() {
        displayUsers();
    }
});