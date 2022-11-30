"use strict";

const token = window.localStorage.getItem("token");
if (!token) {
  window.location.replace("index.html");
}
logaut.addEventListener("click", function () {
  window.localStorage.removeItem("token");

  window.location.replace("index.html");
});

const elInput = document.querySelector(".header__search");
const elOrderBy = document.querySelector(".hero__mode");
const elBooksResult = document.querySelector(".hero__books-result");

const elBookmarkList = document.querySelector(".bookmark");
const elTemplateBookmark = document.querySelector("#templateBookmark").content;
const elBooksTemplate = document.querySelector("#templateBooks").content;
const elBooksList = document.querySelector(".books");
const elBookItem = document.querySelector(".books__item");

const elModall = document.querySelector(".modall");
const elModalTitle = document.querySelector(".modall__title");
const elModalImg = document.querySelector(".modall__img");
const elModaldecs = document.querySelector(".modall__decs");
const elModalAuthor = document.querySelector(".modall__author");
const elModallPublished = document.querySelector(".modall__published");
const elModallPublishers = document.querySelector(".modall__publishers");
const elModallCategories = document.querySelector(".modall__categories");
const elModallPagesCount = document.querySelector(".modall__pages-count");
const elModallBtnRead = document.querySelector(".books__btn-read");

const elPagesWrapper = document.querySelector(".pages__wrapper");
const elPageList = document.querySelector(".page__list");
const elPageActive = document.querySelector(".page__active");

const elPagePrev = document.querySelector(".page__prev");
const elPageNext = document.querySelector(".page__next");

let search = "animals";
let page = 1;
let booksArr;
let orderBy = "&";

let totalResult;
let pagesLength;

const localData = JSON.parse(window.localStorage.getItem("bookmark"));
const bookmarkArr = localData || [];
resultBookmark.textContent = bookmarkArr.length;

// SEARCH:
elInput.addEventListener("input", function () {
  search = elInput.value;
  page = 1;

  getBooks();
});

// MODE:
mode.addEventListener("click", function(evt){
  if(evt.target.matches(".nighttime")){
    body.classList.remove("bg-opacity-25")
    body.classList.add("opacity-75")
    body.classList.add("bg-opacity-50")
    elInput.classList.remove("border-0")
    mode.setAttribute("src", "./images/Solnse.png")
    mode.classList.remove("nighttime")
    mode.classList.add("daytime")
    mainId.classList.remove("bg-light")
    mainId.classList.add("bg-secondary")
    mainId.classList.add("bg-opacity-25")
  } else {
    body.classList.add("bg-opacity-25")
    body.classList.remove("opacity-75")
    body.classList.remove("bg-opacity-50")
    elInput.classList.add("border-0")
    mode.setAttribute("src", "./images/moon.png")
    mode.classList.add("nighttime")
    mode.classList.remove("daytime")
    mainId.classList.add("bg-light")
    mainId.classList.remove("bg-secondary")
    mainId.classList.remove("bg-opacity-25")
  }
})

// SORT:
elOrderBy.addEventListener("click", function (evt) {
  orderBy = "&";
  orderBy += "orderBy=newest";
  getBooks();
});

// BOOKS:
const renderBooks = function (arr, htmlElement) {
  const newFragment = document.createDocumentFragment();
  elBooksList.innerHTML = null;

  arr.forEach((item) => {
    const booksTemplate = elBooksTemplate.cloneNode(true);

    booksTemplate.querySelector(".books__img").src =
      item.volumeInfo.imageLinks?.smallThumbnail;
    booksTemplate.querySelector(".books__title").textContent =
      item.volumeInfo.title;
    booksTemplate.querySelector(".books__author").textContent =
      item.volumeInfo.authors;
    booksTemplate.querySelector(".books__year").textContent =
      item.volumeInfo.publishedDate;
    booksTemplate.querySelector(".books__btn-bookmark").dataset.bookmarkId =
      item.id;
    booksTemplate.querySelector(".books__btn-more-info").dataset.moreInfoId =
      item.id;
    booksTemplate.querySelector(".books__btn-read").href =
      item.volumeInfo.previewLink;
    booksTemplate.querySelector(".books__btn-read").dataset.readId = item.id;

    newFragment.appendChild(booksTemplate);
  });
  htmlElement.appendChild(newFragment);
};

elBooksList.addEventListener("click", function (evt) {
  const currentMoreInfo = evt.target.dataset.moreInfoId;
  const currentBookmark = evt.target.dataset.bookmarkId;

  if (currentMoreInfo) {
    const foundBook = booksArr.items.find(
      (item) => item.id === currentMoreInfo
    );

    elModalTitle.textContent = foundBook.volumeInfo.title;
    elModalImg.src = foundBook.volumeInfo.imageLinks.smallThumbnail;
    elModalAuthor.textContent =
      foundBook.volumeInfo.authors !== undefined
        ? foundBook.volumeInfo.authors
        : "unknown";
    elModallPublished.textContent =
      foundBook.volumeInfo.publishedDate !== undefined
        ? foundBook.volumeInfo.publishedDate
        : "unknown";
    elModallPublishers.textContent =
      foundBook.volumeInfo.publisher !== undefined
        ? foundBook.volumeInfo.publisher
        : "unknown";
    elModallCategories.textContent =
      foundBook.volumeInfo.categories !== undefined
        ? foundBook.volumeInfo.categories
        : "unknown";
    elModallPagesCount.textContent = foundBook.volumeInfo.pageCount;
    elModallBtnRead.dataset.readModalId = foundBook.id;
  }

  if (currentBookmark) {
    const foundBookmarkBook = booksArr.items.find(
      (item) => item.id === currentBookmark
    );

    if (!bookmarkArr.includes(foundBookmarkBook)) {
      bookmarkArr.unshift(foundBookmarkBook);

      resultBookmark.textContent = bookmarkArr.length;
      window.localStorage.setItem("bookmark", JSON.stringify(bookmarkArr));
      renderBookmark(bookmarkArr, elBookmarkList);
    }
  }
});

// BOOKMARKS:
const renderBookmark = function (arr, htmlElement) {
  const newFragment = document.createDocumentFragment();

  arr.forEach((item) => {
    const bookmarkTemplate = elTemplateBookmark.cloneNode(true);

    bookmarkTemplate.querySelector(".bookmark__title").textContent =
      item.volumeInfo.title;
    bookmarkTemplate.querySelector(".bookmark__author").textContent =
      item.volumeInfo.authors !== undefined
        ? item.volumeInfo.authors
        : "unknown";
    bookmarkTemplate.querySelector(".bookmark__read").href =
      item.volumeInfo.previewLink;
    bookmarkTemplate.querySelector(
      ".bookmark__delete"
    ).dataset.bookmarkDeleteId = item.id;

    newFragment.appendChild(bookmarkTemplate);
  });
  elBookmarkList.innerHTML = null;
  htmlElement.appendChild(newFragment);
};
renderBookmark(bookmarkArr, elBookmarkList);

elBookmarkList.addEventListener("click", function (evt) {
  const currentDelete = evt.target.dataset.bookmarkDeleteId;
  if (currentDelete) {
    const foundBookmark = bookmarkArr.findIndex(
      (item) => item.id === currentDelete
    );

    bookmarkArr.splice(foundBookmark, 1);
    elBookmarkList.innerHTML = null;

    resultBookmark.textContent = bookmarkArr.length;
    window.localStorage.setItem("bookmark", JSON.stringify(bookmarkArr));
    renderBookmark(bookmarkArr, elBookmarkList);
  }
});

// MODAL:
elModall.addEventListener("click", function (evt) {
  const currentRead = evt.target.dataset.readModalId;

  if (currentRead) {
    const foundRead = booksArr.items.find((item) => item.id === currentRead);
    elModallBtnRead.href = foundRead.volumeInfo.previewLink;
  }
});

// PAGES:
const renderPage = function (arr, elPageList) {
  elPageList.innerHTML = null;

  for (let i = 1; i <= Math.ceil(arr.totalItems / arr.items.length); i++) {
    const newItem = document.createElement("li");
    const newlink = document.createElement("a");

    newlink.setAttribute("class", "page__active page-link");
    newlink.setAttribute("href", "#");
    newlink.textContent = i;
    newlink.dataset.pageId = i;

    elPageList.appendChild(newItem);
    newItem.appendChild(newlink);
  }
};

    elPageList.addEventListener("click", function (evt) {
      elPageList.innerHTML = null;
      page = evt.target.textContent;

      if (page > 1) {
        elPagePrev.classList.remove("disabled");
      } else {
        elPagePrev.classList.add("disabled");
      }
      getBooks();
    });


elPagesWrapper.addEventListener("click", function (evt) {
  const clickPrev = evt.target.matches(".page__prev");
  const clickNext = evt.target.matches(".page__next");
  elPageList.innerHTML = null;

  if (clickPrev && page > 1) {
    page--;
    elPageNext.classList.remove("disabled");

    if (page === 1) {
      elPagePrev.classList.add("disabled");
    }
  }

  if (clickNext) {
    page++;

    elPagePrev.classList.remove("disabled");
    if (page === Math.ceil(totalResult / pagesLength) * 1) {
      elPageNext.classList.add("disabled");
    }
  }

  getBooks();
});

// GET:
const getBooks = async function () {
  let startIndex = (page - 1) * 30 + 1;
  const request = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=search+${search}&startIndex=${startIndex}&${orderBy}&maxResults=30`
  );
  booksArr = await request.json();

  totalResult = booksArr.totalItems;
  pagesLength = booksArr.items.length;

  if (totalResult >= 1 && page >= 1) {
    elBooksResult.textContent = booksArr.totalItems;
    resultFrom.textContent = (page - 1) * pagesLength + 1;
    resultTo.textContent = page * pagesLength;

    renderBooks(booksArr.items, elBooksList);
    renderPage(booksArr, elPageList);
  } else {
    alert("Sorry, we don't have any such books");
  }
};
getBooks();
