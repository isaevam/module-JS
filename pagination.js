"use strict";

//определяем количество товаров на странице по умолчанию
const calculateNumberPages = (productsLength) => {
  const pageSize = document.getElementById("select-page-size").value;
  return Math.ceil(productsLength / pageSize);
}

//чистим плагинацию
const clearPagination = () => {
  // const div = document.querySelectorAll(".pagination>a");
  //   div.forEach((element) => {
  //   element.remove();
  // });
  const div = document.querySelector(".pagination");
  div.innerHTML='';
}

//создание кнопок пагинации
const creatButton = (value) => `<a value="${value}">${value}</a>`;
const creatButtonNext = () => `<a value=">">></a>`;
const creatButtonPrevios = () => `<a value="<"><</a>`;
const creatThreeFirstButtons = () =>
  `<a value="<"><</a><a value="1">1</a><a value="previos">...</a>`;
const creatThreeLastButtons = (pageCount) =>
  `<a value="next">...</a><a value="${pageCount}">${pageCount}</a><a value=">">></a>`;

//отрисовка пагинации
export const drawPaginationButtons = (productsLength, page) => {
    clearPagination();
  const pageCount = calculateNumberPages(productsLength);
  const div = document.querySelector(".pagination");
  const threeLastButtons = creatThreeLastButtons(pageCount);
  const threeFirstButtons = creatThreeFirstButtons(pageCount);
  const buttonPrevios = creatButtonPrevios();
  const buttonNext = creatButtonNext();
    if (pageCount < 10) {
    for (let i = 1; i <= pageCount; i++) {
      const button = creatButton(i);
      div.insertAdjacentHTML("beforeend", button);
    }
  } else {
    if (page < 5) {
      for (let i = 1; i <= 5; i++) {
        const button = creatButton(i);
        div.insertAdjacentHTML("beforeend", button);
      }
      div.insertAdjacentHTML("beforeend", threeLastButtons);
      if (page != 1) {
        div.insertAdjacentHTML("afterbegin", buttonPrevios);
      }
    }else if (page > pageCount - 4) {
           div.insertAdjacentHTML("beforeend", threeFirstButtons);
      for (let j = pageCount - 4; j <= pageCount; j++) {
        const button2 = creatButton(j);
        div.insertAdjacentHTML("beforeend", button2);
      }
      if (page != pageCount) {
          div.insertAdjacentHTML("beforeend", buttonNext);
      }}
      else{
      div.insertAdjacentHTML("beforeend", threeFirstButtons);
      for (let k = page - 2; k <= page + 2; k++) {
        const button3 = creatButton(k);
        div.insertAdjacentHTML("beforeend", button3);
      }
      div.insertAdjacentHTML("beforeend", threeLastButtons);
    }
  }
  document
    .querySelector(`.pagination>a[value="${page}"]`)
    .classList.add("active");
  }

