//book class - represents books
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

//UI class - handle UI tasks
class UI {
  static displayBooks() {
    const books = Store.getBooks();

    books.forEach((book) => UI.addBookToList(book));
  }

  static addBookToList(book) {
    const list = document.querySelector("#book-list");
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href="#" class="btn btn-danger btn-sm delete">Done</a></td>
    `;

    list.appendChild(row);
  }

  static deleteBook(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(messege, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(messege));
    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");
    container.insertBefore(div, form);
    //timeout disappear
    setTimeout(() => document.querySelector(".alert").remove(), 2000);
  }

  static clearFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#isbn").value = "";
  }
}

//localStorage

class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();

    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem("books", JSON.stringify(books));
  }
}

//Store Class: Handles Storage

//Event to display bookstore
document.addEventListener("DOMContentLoaded", UI.displayBooks);

//Event to add a book
document.querySelector("#book-form").addEventListener("submit", (e) => {
  //prevent submit
  e.preventDefault();

  //get form value
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const isbn = document.querySelector("#isbn").value;

  //validate
  if (title === "" || author === "" || isbn === "") {
    UI.showAlert("You need to fill all fields", "danger");
  } else {
    //instatiate book
    const book = new Book(title, author, isbn);
    //add book to UI
    UI.addBookToList(book);

    //add book to store
    Store.addBook(book);

    //success message
    UI.showAlert("Book Added, great!", "success");

    //clear fields
    UI.clearFields(book);
  }
});

//Event remove a books
document.querySelector("#book-list").addEventListener("click", (e) => {
  //remove book from UI
  UI.deleteBook(e.target);

  //remove book from Store
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  //remove message
  UI.showAlert("Book has been deleted", "info");
});
