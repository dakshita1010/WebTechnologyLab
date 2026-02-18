let xmlDoc;
function loadBooks() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "books.xml", true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            xmlDoc = xhr.responseXML;
            displayBooks();
        }
    };

    xhr.send();
}
function displayBooks() {
    let books = xmlDoc.getElementsByTagName("book");
    let table = "<table>";
    table += "<tr><th>ID</th><th>Title</th><th>Author</th><th>Status</th></tr>";

    for (let i = 0; i < books.length; i++) {
        table += "<tr>";
        table += "<td>" + books[i].getElementsByTagName("id")[0].textContent + "</td>";
        table += "<td>" + books[i].getElementsByTagName("title")[0].textContent + "</td>";
        table += "<td>" + books[i].getElementsByTagName("author")[0].textContent + "</td>";
        table += "<td>" + books[i].getElementsByTagName("availability")[0].textContent + "</td>";
        table += "</tr>";
    }

    table += "</table>";
    document.getElementById("bookTable").innerHTML = table;
}
function validateInput(id, title, author) {
    if (id === "" || title === "" || author === "") {
        alert("All fields are required!");
        return false;
    }
    if (isNaN(id)) {
        alert("Book ID must be numeric!");
        return false;
    }
    return true;
}
function addBook() {

    let id = document.getElementById("bookId").value;
    let title = document.getElementById("title").value;
    let author = document.getElementById("author").value;
    let availability = document.getElementById("availability").value;

    if (!validateInput(id, title, author)) return;

    let books = xmlDoc.getElementsByTagName("book");

    // Check duplicate ID
    for (let i = 0; i < books.length; i++) {
        if (books[i].getElementsByTagName("id")[0].textContent === id) {
            alert("Book ID already exists!");
            return;
        }
    }

    let newBook = xmlDoc.createElement("book");

    let idNode = xmlDoc.createElement("id");
    idNode.textContent = id;

    let titleNode = xmlDoc.createElement("title");
    titleNode.textContent = title;

    let authorNode = xmlDoc.createElement("author");
    authorNode.textContent = author;

    let availabilityNode = xmlDoc.createElement("availability");
    availabilityNode.textContent = availability;

    newBook.appendChild(idNode);
    newBook.appendChild(titleNode);
    newBook.appendChild(authorNode);
    newBook.appendChild(availabilityNode);

    xmlDoc.getElementsByTagName("library")[0].appendChild(newBook);

    displayBooks();
}
function updateBook() {

    let id = document.getElementById("bookId").value;
    let availability = document.getElementById("availability").value;

    if (id === "") {
        alert("Enter Book ID to update!");
        return;
    }

    let books = xmlDoc.getElementsByTagName("book");

    for (let i = 0; i < books.length; i++) {
        if (books[i].getElementsByTagName("id")[0].textContent === id) {
            books[i].getElementsByTagName("availability")[0].textContent = availability;
            displayBooks();
            return;
        }
    }

    alert("Book not found!");
}
function deleteBook() {

    let id = document.getElementById("bookId").value;

    if (id === "") {
        alert("Enter Book ID to delete!");
        return;
    }

    let books = xmlDoc.getElementsByTagName("book");

    for (let i = 0; i < books.length; i++) {
        if (books[i].getElementsByTagName("id")[0].textContent === id) {
            books[i].parentNode.removeChild(books[i]);
            displayBooks();
            return;
        }
    }

    alert("Book not found!");
}
