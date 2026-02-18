let students = [];

async function fetchStudents() {
    try {
        const response = await fetch('students.json');

        if (!response.ok) {
            throw new Error("Failed to fetch JSON");
        }

        students = await response.json(); 
        displayStudents();

    } catch (error) {
        console.error("Error loading JSON:", error);
        alert("Error loading student data.");
    }
}

function displayStudents() {
    const table = document.getElementById("studentTable");
    table.innerHTML = "";

    students.forEach(student => {
        table.innerHTML += `
            <tr>
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.course}</td>
                <td>${student.marks}</td>
                <td>
                    <button onclick="editStudent(${student.id})">Edit</button>
                    <button onclick="deleteStudent(${student.id})">Delete</button>
                </td>
            </tr>
        `;
    });
}

document.getElementById("studentForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const id = document.getElementById("id").value.trim();
    const name = document.getElementById("name").value.trim();
    const course = document.getElementById("course").value.trim();
    const marks = document.getElementById("marks").value.trim();

    if (!id || !name || !course || !marks) {
        alert("All fields are required!");
        return;
    }

    if (isNaN(marks) || marks < 0 || marks > 100) {
        alert("Marks must be between 0 and 100.");
        return;
    }

    students.push({
        id: Number(id),
        name,
        course,
        marks: Number(marks)
    });

    displayStudents();
    this.reset();
});

function editStudent(id) {
    const student = students.find(s => s.id === id);

    const newCourse = prompt("Enter new course:", student.course);
    const newMarks = prompt("Enter new marks:", student.marks);

    if (newCourse && newMarks && !isNaN(newMarks)) {
        student.course = newCourse;
        student.marks = Number(newMarks);
        displayStudents();
    }
}

function deleteStudent(id) {
    students = students.filter(student => student.id !== id);
    displayStudents();
}

fetchStudents();
