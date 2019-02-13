window.onload = function () {
  //#region GLOBAL VARIABLES
  const titleInput = document.getElementById('title');
  const authorInput = document.getElementById('author');
  const ISBNInput = document.getElementById('ISBN');
  const category = document.getElementById('category');
  let categoryValue;
  let bookID = 8;
  let booksArr = [{
    titleInputValue: "The Complete Stories",
    authorInputValue: "Flannery O'Connor",
    ISBNInputValue: 1234567891,
    categoryValue: "drama",
    id: 1
  }, {
    titleInputValue: "Letting Go",
    authorInputValue: "Philip Roth",
    ISBNInputValue: 1234567892,
    categoryValue: "uncategorised",
    id: 2
  }, {
    titleInputValue: "Fear of Flying",
    authorInputValue: "Erica Jong",
    ISBNInputValue: 1234567893,
    categoryValue: "horror",
    id: 3
  }, {
    titleInputValue: "The French Laundry Cookbook",
    authorInputValue: "Thomas Keller",
    ISBNInputValue: 1234567894,
    categoryValue: "horror",
    id: 4
  }, {
    titleInputValue: "Wide Sargasso Sea",
    authorInputValue: "Jean Rhys",
    ISBNInputValue: 1234567895,
    categoryValue: "horror",
    id: 5
  }, {
    titleInputValue: "When Breath Becomes Air",
    authorInputValue: "Paul Kalanithi",
    ISBNInputValue: 1234567896,
    categoryValue: "action",
    id: 6
  }, {
    titleInputValue: "GENESIS",
    authorInputValue: "Lélia Wanick Salgado",
    ISBNInputValue: 1234567897,
    categoryValue: "comedy",
    id: 7
  }];
  //#endregion

  //#region mandatoryStars EventListener
  const mandatoryStars = document.getElementsByClassName('mandatory');
  for (let i = 0; i < mandatoryStars.length; i++) {
    mandatoryStars[i].addEventListener('click', showPopUp);
    mandatoryStars[i].addEventListener('mouseover', showPopUp);
  }

  function showPopUp() {
    const mandatoryPopUp = document.getElementsByClassName('popUpCSS');
    this.nextElementSibling.style.display = 'block';
    setTimeout(() => {
      this.nextElementSibling.style.display = 'none';
    }, 1500);
  }
  //#endregion

  //#region Add Book Btn
  const addBtn = document.getElementById('add');
  addBtn.addEventListener('click', addBook);

  function addBook(e) {
    e.preventDefault();
    e.stopPropagation();
    const titleBool = Validate.title(titleInput.value.trim());
    if (titleBool === false) return;
    const authorBool = Validate.author(authorInput.value.trim());
    if (authorBool === false) return;
    const ISBNBool = (ISBNInput.value === undefined) ? Validate.ISBNlength(ISBNInput.value) : Validate.ISBNlength(ISBNInput.value.trim());
    if (ISBNBool === false) return;
    categoryValue = category.value; // save value if input field is NOT empty
    const categoryBool = Validate.category(category.value.trim());
    if (categoryBool === false) return;

    const book = {
      titleInputValue: titleInput.value.trim(),
      authorInputValue: authorInput.value.trim(),
      ISBNInputValue: Number(ISBNInput.value.trim()),
      categoryValue: categoryValue.trim(),
    };
    Validate.uniqueBookParams(book);
  }
  //#endregion

  //#region show All Books Btn
  const showAllBooksBtn = document.getElementById('showAllBooks');
  showAllBooksBtn.addEventListener('click', showAllBooks);

  const booksContainer = document.getElementById('booksContainer');

  function showAllBooks(str = '') {
    let booksArrCopy = booksArr.slice();
    if (booksArrCopy.length === 0) return booksContainer.innerHTML = 'Sorry, no books found!';

    if (str === 'byCategories') booksArrCopy = booksArrCopy.sort((a, b) => a.categoryValue > b.categoryValue);
    if (str === 'byAuthor') booksArrCopy = booksArrCopy.sort((a, b) => a.authorInputValue > b.authorInputValue);


    let HTMLstr = '';
    booksArrCopy.forEach(obj => {
      HTMLstr += `<div>Title: ${obj.titleInputValue}, Author: ${obj.authorInputValue}, ISBN: ${obj.ISBNInputValue}, Category: ${obj.categoryValue}</div>`;
    });
    booksContainer.innerHTML = HTMLstr;

    // prepare all books in container to be clicked
    const allBooksInContainerArr = booksContainer.children;
    for (let i = 0; i < allBooksInContainerArr.length; i++) {
      allBooksInContainerArr[i].addEventListener('click', (e) => e.target.classList.toggle('clicked'));
    }
  }
  //#endregion

  //#region Sort By Categories Btn
  const sortByCategories = document.getElementById('sortByCategories');
  sortByCategories.addEventListener('click', () => showAllBooks('byCategories'));
  //#endregion

  //#region Sort By Author Btn
  const sortByAuthor = document.getElementById('sortByAuthor');
  sortByAuthor.addEventListener('click', () => showAllBooks('byAuthor'));
  //#endregion

  //#region show All Categories Btn
  const showAllCategories = document.getElementById('showAllCategories');
  showAllCategories.addEventListener('click', showAllCategoriesFunc);

  function showAllCategoriesFunc() {
    if (booksArr.length === 0) return booksContainer.innerHTML = 'Sorry, no books found!';

    let categoryArr = [];
    booksArr.forEach(obj => {
      if (!categoryArr.includes(obj.categoryValue)) {
        categoryArr.push(obj.categoryValue);
      }
    });

    const resultStr = categoryArr.sort().join(', ');
    booksContainer.innerHTML = `All book categories: ${resultStr}`;
  }
  //#endregion

  //#region Delete Btn
  const deleteBtn = document.getElementById('delete');
  deleteBtn.addEventListener('click', deleteSelected);

  function deleteSelected() {
    const itemsToDeleteArr = Array.from(document.getElementsByClassName('clicked'));
    itemsToDeleteArr.forEach(div => div.remove());
  }

  //#endregion

  //#region Delete All Btn
  const deleteAll = document.getElementById('deleteAll');
  deleteAll.addEventListener('click', deleteAllBooks);

  function deleteAllBooks() {
    booksArr = [];
    showAllBooks();
  }
  //#endregion

  //#region Validate user inputs
  const Validate = {
    title(str) {
      if (str.length < 2 || str.length > 100) {
        alert(`Length of 'Title' must be between 2 and 100 characters`);
        return false;
      } else {
        return true;
      }
    },
    author(str) {
      if (str === '') {
        alert(`'Author' must have at least 1 characters`);
        return false;
      } else {
        return true;
      }
    },
    ISBNlength(num) {
      if ((isNaN(num) || num === 0) || (num.toString().length !== 10 && num.toString().length !== 13)) {
        alert(`'ISBN' must be a number, 10 or 13 digits`);
        return false;
      } else {
        return true;
      }
    },
    category(str) {
      if (str.length === 0) categoryValue = 'uncategorised';
      if (str.length > 100) {
        alert(`'Category' must be less than 100 characters`);
        return false;
      } else {
        return true;
      }
    },
    uniqueBookParams(book) {
      for (let i = 0; i < booksArr.length; i++) { // show alert and clear the correct input field
        if (booksArr[i].titleInputValue === book.titleInputValue) {
          alert('Such Title already exists');
          titleInput.value = '';
          titleInput.style.backgroundColor = '#ff4b4b';
          return;
        } else {
          titleInput.style.backgroundColor = '#17181C';
        };
        if (booksArr[i].authorInputValue === book.authorInputValue) {
          alert('Such Author already exists');
          authorInput.value = '';
          authorInput.style.backgroundColor = '#ff4b4b';
          return;
        } else {
          authorInput.style.backgroundColor = '#17181C';
        };
        if (booksArr[i].ISBNInputValue === Number(book.ISBNInputValue)) {
          alert('Such ISBN already exists');
          ISBNInput.value = '';
          ISBNInput.style.backgroundColor = '#ff4b4b';
          return;
        } else {
          ISBNInput.style.backgroundColor = '#17181C';
        };
      }

      book.id = bookID++;
      booksArr.push(book);
      showAllBooks();

      titleInput.value = '';
      authorInput.value = '';
      ISBNInput.value = '';
      category.value = '';
    }
  }
  //#endregion
}