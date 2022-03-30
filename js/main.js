'use strict';

// adding book main button
const addBookBtn = document.querySelector('#add-book');
// modal buttons
const formModal = document.querySelector('#form-background')
const closeModalBtn = document.querySelector('#close-btn');
const title = document.querySelector('#title-input');
const author = document.querySelector('#author-input');
const read = document.querySelector('#read-input');
const numOfPages = document.querySelector('#pages-input');
const submitNewBookBtn = document.querySelector('#submit-button');
const main =document.querySelector('main');

class Book {
  constructor(author, title, read, numberOfPages = 0, bookID = undefined) {
    this.author = author;
    this.title = title;
    this.read = read;
    this.numberOfPages = numberOfPages;
    this.bookID = bookID;
    this.#generateID();
  }

  #generateID() {
    if(this.bookID === undefined){
      this.bookID = Math.trunc(Math.random() * new Date().getTime());
    }
  }

  displayPages(){
    if(Number(this.numberOfPages) > 0){
      return this.numberOfPages;
    }else{
      return 'Not specified'
    }
  }

  readBook(){
    if(this.read === false){
      return ['x-mark', 'not-read']
    }else if(this.read === true){
      return ['checked', 'read']
    }
  }

  // render book
  updateBook(){
    const book = document.createElement('div');
    book.classList.add('book');
    book.setAttribute('book-id', this.bookID);
    book.innerHTML = 
    `
      <div class="book-title">${this.title}</div>
      <div class="book-info">
        <div class="book-info__data">
          <div class="author">Author:<span class="author__name">${this.author}</span></div>
          <div class="pages">Pages:<span class="pages__number">${this.displayPages()}</span></div>
        </div>
        <div class="book-info__buttons">
          <p>Read?</p>
          <button class="${this.readBook()[1]}">
            <span class="${this.readBook()[0]}" data-id="${this.bookID}">
            </span>
          </button>
          <button class="delete">Delete?</button>
        </div>
      </div>
    `
    main.appendChild(book);
  }

}

const book = new Book();

class App {
  constructor() {
    this.booksList = [];
    this.openNewBookForm();
    this.closeNewBookForm();
    submitNewBookBtn.addEventListener('click', this.createBook.bind(this));
    window.localStorage.setItem('data', []);
    // update the read message
    document.addEventListener('click', this.updateReadStatus.bind(this));
    // deletes the book
    document.addEventListener('click', this.deleteBook.bind(this));
    this.readLocalStorage();
    this.renderBooks();
  }
  getList() {
    console.log(this.booksList);
    return this.booksList;
  }
  openNewBookForm() {
    addBookBtn.addEventListener('click', () => {
      title.value = "";
      title.blur();
      author.value = "";
      author.blur();
      read.checked = false;
      read.blur();
      numOfPages.value = "";
      numOfPages.blur();
      formModal.style.display = 'block';
    })
  }

  closeNewBookForm() {
    closeModalBtn.addEventListener('click', e => {
      e.preventDefault();
      title.value = "";
      title.blur();
      author.value = "";
      author.blur();
      read.checked = false;
      read.blur();
      numOfPages.value = "";
      numOfPages.blur();
      formModal.style.display = 'none';
    })
  }

  createBook(e) {
    e.preventDefault();
    const book = new Book(
      author.value,
      title.value,
      read.checked,
      numOfPages.value
    );
    this.booksList.push(book);
    this.renderBooks();
    // clears fields
    title.value = "";
    title.blur();
    author.value = "";
    author.blur();
    read.checked = false;
    read.blur();
    numOfPages.value = "";
    numOfPages.blur();
    formModal.style.display = 'none';
  }

  renderBooks(){
    main.innerHTML = "";
    this.booksList.forEach(book=>{
      this.addToLocalStorage(book);
      book.updateBook();
    });
  }

  addToLocalStorage(book){
    window.localStorage.setItem(book.bookID,JSON.stringify(book));
  }

  updateReadStatus(e){
    const element = e.target;
      if(element.classList.contains('x-mark') || element.classList.contains('checked')){
        const id = element.getAttribute('data-id');
        const parentID = element.parentNode.parentNode.parentNode.parentNode.getAttribute('book-id');
        const parentBtn = element.parentNode;
        if(id === parentID){
          if(element.classList.contains('x-mark')){
            element.classList.remove('x-mark');
            element.classList.add('checked');
            parentBtn.classList.remove('not-read');
            parentBtn.classList.add('read');
            this.booksList.forEach(book=>{
              if (String(book.bookID) === parentID){
                book.read = true;
                this.addToLocalStorage(book);
              }
            });
          }else if(element.classList.contains('checked')){
            element.classList.add('x-mark');
            element.classList.remove('checked');
            parentBtn.classList.remove('read');
            parentBtn.classList.add('not-read');
            this.booksList.forEach(book=>{
              if (String(book.bookID) === parentID){
                book.read = false;
                this.addToLocalStorage(book);
              }
            });
          }
        }
      }
  }

  deleteBook(e){
    const element = e.target;
    if (element.classList.contains('delete')){
      const parentElement = element.parentNode.parentNode.parentNode;
      const index = this.booksList.findIndex(book=>String(book.bookID) === parentElement.getAttribute('book-id'));
      this.booksList.splice(index, 1);
      window.localStorage.removeItem(parentElement.getAttribute('book-id'));
    }
    this.renderBooks();
  }

  readLocalStorage(){
    if(window.localStorage.length > 0){
      for(const key in window.localStorage){
        if(Number.isFinite(Number(key))){
          // this.booksList.push(JSON.parse(localStorage[key]))
          const book = JSON.parse(window.localStorage[key]);
          this.booksList.push(new Book(
            book.author,
            book.title,
            book.read,
            book.numOfPages,
            book.bookID
          ));
        }
      }
    }
  }
}

const app = new App();