const form = document.getElementById('studentForm');
const tbody = document.querySelector('#studentTable tbody');
const messageDiv = document.getElementById('message');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');

let students = [];
let editingStudentId = null;

// Load initial data from local JSON file
fetch('students.json')
  .then(response => {
    if (!response.ok) throw new Error(`Failed to load students.json: ${response.status}`);
    return response.json();
  })
  .then(data => {
    students = data;
    populateTable(students);
    showMessage('Students loaded from local JSON.', 'green');
  })
  .catch(error => {
    showMessage(error.message, 'red');
  });

// Submit form for Add or Update
form.onsubmit = function(e) {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const department = document.getElementById('department').value.trim();
  const marks = parseFloat(document.getElementById('marks').value.trim());

  if (editingStudentId) {
    updateStudent(editingStudentId, { name, department, marks });
  } else {
    addStudent({ name, department, marks });
  }
};

// Cancel editing
cancelBtn.onclick = resetForm;

// Populate table
function populateTable(studentsList) {
  tbody.innerHTML = '';
  studentsList.forEach(student => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${student.id}</td>
      <td>${student.name}</td>
      <td>${student.department}</td>
      <td>${student.marks}</td>
      <td>
        <button onclick="editStudent('${student.id}')">Edit</button>
        <button onclick="deleteStudent('${student.id}')">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Add new student
function addStudent(student) {
  // Generate a unique ID (e.g., using timestamp)
  const newId = 'S' + Date.now();
  const newStudent = { id: newId, ...student };
  students.push(newStudent);
  populateTable(students);
  resetForm();
  showMessage('Student added successfully.', 'green');
}

// Edit student
function editStudent(id) {
  const student = students.find(s => s.id === id);
  if (!student) {
    showMessage('Student not found.', 'red');
    return;
  }
  document.getElementById('studentId').value = student.id;
  document.getElementById('name').value = student.name;
  document.getElementById('department').value = student.department;
  document.getElementById('marks').value = student.marks;
  submitBtn.textContent = 'Update Student';
  cancelBtn.style.display = 'inline';
  editingStudentId = id;
}

// Update student
function updateStudent(id, updatedData) {
  const index = students.findIndex(s => s.id === id);
  if (index === -1) {
    showMessage('Student not found.', 'red');
    return;
  }
  students[index] = { id, ...updatedData };
  populateTable(students);
  resetForm();
  showMessage('Student updated successfully.', 'green');
}

// Delete student
function deleteStudent(id) {
  if (!confirm('Are you sure you want to delete this student?')) return;
  students = students.filter(s => s.id !== id);
  populateTable(students);
  showMessage('Student deleted successfully.', 'green');
}

// Reset form
function resetForm() {
  document.getElementById('studentId').value = '';
  document.getElementById('name').value = '';
  document.getElementById('department').value = '';
  document.getElementById('marks').value = '';
  submitBtn.textContent = 'Add Student';
  cancelBtn.style.display = 'none';
  editingStudentId = null;
}

// Show message
function showMessage(msg, color) {
  messageDiv.textContent = msg;
  messageDiv.style.color = color;
  setTimeout(() => { messageDiv.textContent = ''; }, 3000);
}