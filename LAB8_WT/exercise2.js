const student = {
  id: 101,
  name: "Priya",
  department: "CSE",
  marks: 92
};

const { id, name, department, marks } = student;

console.log(id, name, department, marks);

let grade;
if (marks >= 90) {
  grade = 'A';
} else if (marks >= 80) {
  grade = 'B';
} else if (marks >= 70) {
  grade = 'C';
} else if (marks >= 60) {
  grade = 'D';
} else {
  grade = 'F';
}

const updatedStudent = {
  ...student,
  grade: grade
};

console.log(updatedStudent);