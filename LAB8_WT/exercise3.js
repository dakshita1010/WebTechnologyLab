class Course {
  constructor(name, instructor, seatsAvailable) {
    this.name = name;
    this.instructor = instructor;
    this.seatsAvailable = seatsAvailable;
  }

  displayDetails() {
    console.log(`Course: ${this.name}, Instructor: ${this.instructor}`);
  }

  enroll() {
    return new Promise((resolve, reject) => {
      if (this.seatsAvailable > 0) {
        this.seatsAvailable--;
        resolve("Enrollment Successful");
      } else {
        reject("Course Full");
      }
    });
  }
}

const course = new Course("Web Technologies", "Dr. Kumar", 1);

course.displayDetails();

course.enroll()
  .then(message => console.log(message))
  .catch(error => console.log(error));