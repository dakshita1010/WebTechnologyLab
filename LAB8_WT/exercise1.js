let studentName = "Shashwat";
let science = 95;
let math = 90;
let english = 98;

let totalMarks = science + math + english;

const computeAverage = (s, m, e) => (s + m + e) / 3;

let averageMarks = computeAverage(science, math, english);

console.log(`Student Name: ${studentName}`);
console.log(`Total Marks: ${totalMarks}`);
console.log(`Average Marks: ${averageMarks.toFixed(2)}`);