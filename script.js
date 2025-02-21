let books = [];
let ebooks = [];
let issuedBooks = [];

// Simulate user authentication
const users = [
    { username: "admin", password: "admin123" }
];

// DOM Elements
const loginForm = document.getElementById("loginForm");
const dashboard = document.getElementById("dashboard");
const bookForm = document.getElementById("bookForm");
const ebookForm = document.getElementById("ebookForm");
const issueReturnForm = document.getElementById("issueReturnForm");

const bookList = document.getElementById("bookList");
const ebookList = document.getElementById("ebookList");
const issuedBooksList = document.getElementById("issuedBooksList");
const issueBookSelect = document.getElementById("issueBookSelect");
const bookSearch = document.getElementById("bookSearch");

// Event listeners
document.getElementById("login").addEventListener("submit", handleLogin);
bookForm.addEventListener("submit", addBook);
ebookForm.addEventListener("submit", addEbook);
issueReturnForm.addEventListener("submit", issueReturnBook);
bookSearch.addEventListener("input", searchBooks);

// Handle login
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    
    const user = users.find(user => user.username === username && user.password === password);
    
    if (user) {
        loginForm.style.display = "none";
        dashboard.style.display = "block";
        loadData();
    } else {
        alert("Invalid credentials");
    }
}

// Load data from LocalStorage
function loadData() {
    const storedBooks = localStorage.getItem("books");
    const storedEbooks = localStorage.getItem("ebooks");
    const storedIssuedBooks = localStorage.getItem("issuedBooks");
    
    if (storedBooks) books = JSON.parse(storedBooks);
    if (storedEbooks) ebooks = JSON.parse(storedEbooks);
    if (storedIssuedBooks) issuedBooks = JSON.parse(storedIssuedBooks);
    
    displayBooks();
    displayEbooks();
    displayIssuedBooks();
}

// Save data to LocalStorage
function saveData() {
    localStorage.setItem("books", JSON.stringify(books));
    localStorage.setItem("ebooks", JSON.stringify(ebooks));
    localStorage.setItem("issuedBooks", JSON.stringify(issuedBooks));
}

// Display books
function displayBooks() {
    bookList.innerHTML = "";
    issueBookSelect.innerHTML = "<option value='' disabled selected>Select a Book</option>";
    
    books.forEach((book, index) => {
        const li = document.createElement("li");
        li.innerHTML = `${book.title} by ${book.author} - ${book.pages} pages, Serial: ${book.serial}
            <button class="edit" onclick="editBook(${index})">Edit</button>
            <button class="delete" onclick="deleteBook(${index})">Delete</button>`;
        bookList.appendChild(li);
        
        const option = document.createElement("option");
        option.value = book.serial;
        option.textContent = book.title;
        issueBookSelect.appendChild(option);
    });
}

// Display e-books
function displayEbooks() {
    ebookList.innerHTML = "";
    ebooks.forEach(ebook => {
        const li = document.createElement("li");
        li.innerHTML = `${ebook.title} by ${ebook.author} - <a href="${ebook.link}" target="_blank">Read E-Book</a>`;
        ebookList.appendChild(li);
    });
}

// Display issued books
function displayIssuedBooks() {
    issuedBooksList.innerHTML = "";
    issuedBooks.forEach(issue => {
        const li = document.createElement("li");
        li.innerHTML = `${issue.bookTitle} issued on ${issue.issueDate} and due on ${issue.returnDate}`;
        issuedBooksList.appendChild(li);
    });
}

// Add a new book
function addBook(event) {
    event.preventDefault();
    
    const title = document.getElementById("bookTitle").value;
    const author = document.getElementById("bookAuthor").value;
    const pages = document.getElementById("bookPages").value;
    const serial = document.getElementById("bookSerial").value;
    
    const newBook = { title, author, pages, serial };
    books.push(newBook);
    saveData();
    displayBooks();
    event.target.reset();
}

// Add a new e-book
function addEbook(event) {
    event.preventDefault();
    
    const title = document.getElementById("ebookTitle").value;
    const author = document.getElementById("ebookAuthor").value;
    const link = document.getElementById("ebookLink").value;
    
    const newEbook = { title, author, link };
    ebooks.push(newEbook);
    saveData();
    displayEbooks();
    event.target.reset();
}

// Issue or return a book
function issueReturnBook(event) {
    event.preventDefault();
    
    const bookSerial = issueBookSelect.value;
    const issueDate = document.getElementById("issueDate").value;
    const returnDate = document.getElementById("returnDate").value;
    
    const book = books.find(b => b.serial === bookSerial);
    
    if (!book || !issueDate || !returnDate) {
        alert("Please fill in all fields");
        return;
    }

    const issuedBook = {
        bookTitle: book.title,
        issueDate,
        returnDate
    };

    issuedBooks.push(issuedBook);
    saveData();
    displayIssuedBooks();
    event.target.reset();
}

// Delete book
function deleteBook(index) {
    books.splice(index, 1);
    saveData();
    displayBooks();
}

// Edit book
function editBook(index) {
    const book = books[index];
    
    document.getElementById("bookTitle").value = book.title;
    document.getElementById("bookAuthor").value = book.author;
    document.getElementById("bookPages").value = book.pages;
    document.getElementById("bookSerial").value = book.serial;
    
    deleteBook(index);
}

// Search books
function searchBooks() {
    const query = bookSearch.value.toLowerCase();
    const filteredBooks = books.filter(book => book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query));
    
    bookList.innerHTML = "";
    filteredBooks.forEach((book, index) => {
        const li = document.createElement("li");
        li.innerHTML = `${book.title} by ${book.author} - ${book.pages} pages, Serial: ${book.serial}
            <button class="edit" onclick="editBook(${index})">Edit</button>
            <button class="delete" onclick="deleteBook(${index})">Delete</button>`;
        bookList.appendChild(li);
    });
}