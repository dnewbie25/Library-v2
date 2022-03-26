'use strict';

const bookTest = document.querySelector('.book');
const main = document.querySelector('main');

// set the id like this
const randomNum = () => Math.trunc(Math.random()*new Date().getTime());
bookTest.setAttribute('book-id', randomNum());