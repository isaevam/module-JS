"use strict";
//import{drawPaginationButtons} from "./pagination"
const url = new URL(
  "https://dummyjson.com/products?limit=0&select=id,title,category,brand,price"
);
//проверка статуса запроса
const sendRequest = async () => {
  try {
    const response = await fetch(url);
    if (response.ok) {
      //makeElementsVisible();
      return await response.json();
    } else {
      alert("Sorry, error HTTP: " + response.status);
    }
  } catch (err) {
    alert(err);
  } finally {
    document.querySelector(".loader").style.display = "none";
  }
};
sendRequest();

//сделать элементы видимыми
const makeElementsVisible = () => {
  document.querySelector(".catalog-header").style.display = "flex";
  document.querySelector(".div-select").style.display = "flex";
  document.querySelector(".pagination").style.display = "flex";
};

//создаем элементы каталога
const creatCatalogList = (id, name, category, brand, price) => {
  return `<div class="catalog-list-item" id="${id}">
<span class="catalog-list-item-number" >${id + 1}.</span>
<span class="catalog-list-item-name">${name}</span>
<span class="catalog-list-item-category">${category}</span>
<span class="catalog-list-item-brand">${brand}</span>
<span class="catalog-list-item-price">${price}</span>
<button class="catalog-list-item-button-buy">Buy</button>
</div>`;
};

//сортируем по названию
const sortedTitle = (products) => {
  products.sort((a, b) => {
    const titleA = a.title.toLowerCase();
    const titleB = b.title.toLowerCase();
    return titleA < titleB ? -1 : titleA > titleB ? 1 : 0;
  });
};
//сортируем по цене
const sortedPriceLowToHigh = (products) => {
  products.sort((a, b) => {
    return a.price - b.price;
  });
};
const sortedPriceHighToLow = (products) => {
  products.sort((a, b) => {
    return b.price - a.price;
  });
};
//сортировка с учетом значения списка сортировки
const sortedCatalog = (products) => {
  const value = document.getElementById("select-sort").value;
  if (value === "Name") {
    sortedTitle(products);
  }
  if (value === "PriceLowToHigh") {
    sortedPriceLowToHigh(products);
  }
  if (value === "PriceHighToLow") {
    sortedPriceHighToLow(products);
  }
};

//заполняем элементы каталога
const loadedCatalogList = (products,page) => {
  const cutProducts=cutCatalogList(products,page);
  console.log(cutProducts);
  cutProducts.forEach((element, index) => {
    const name = element.title;
    const category = element.category;
    const brand = element.brand;
    const price = element.price;
    const div = document.querySelector(".catalog-list");
    const catalogList = creatCatalogList(index, name, category, brand, price);
    div.insertAdjacentHTML("beforebegin", catalogList);
  });
};
//чистим каталог
const clearCatalogList = () => {
  const div = document.querySelectorAll(".catalog-list-item");
  div.forEach((element) => {
    element.remove();
  });
};

//загрузка отсортированного каталога
const loadedCatalog = async (page) => {
  console.log(page);
  const catalog = await sendRequest();
  const products = catalog.products;
  const productsLength=products.length;
  //const cutProducts = cutCatalogList(products);
  makeElementsVisible();
  clearCatalogList();
  sortedCatalog(products);
  loadedCatalogList(products,page);
  drawPaginationButtons(productsLength, page);
  addEventBattonsPagination();
  //cutCatalogList(products,page);
  
};
loadedCatalog(1);

//обработка событий списка сортировки
document.getElementById("select-sort").addEventListener("change", () => {
  loadedCatalog(1);
});
document.getElementById("select-page-size").addEventListener("change", () => {
  loadedCatalog(1);
});
//обработка событий кнопок пагинации
// console.log(document.querySelectorAll(".pagination>a"));
// document.querySelectorAll(".pagination>a").forEach((element)=>{console.log(element);element.addEventListener("click", (event) => {
//   const page=event.target.getAttribute("value");
//   console.log(event.target.getAttribute("value"));
//   loadedCatalog(page);
// })});


//обрезаем массив продуктов в зависимости от количества элементов выводимых на страницу
const cutCatalogList=(products,page)=>{
const numberElements=Number(document.getElementById("select-page-size").value);
const startElements=page*numberElements-numberElements;
return products.slice(startElements,startElements+numberElements);
}




const onClickButtonPagination=(event) => {
  const pageActive=Number(document.querySelector('.active').getAttribute("value"));
  const value=event.target.getAttribute("value");
let page;
  switch(value){
case"<":
  page=pageActive-1;
  break;
case">":
  page=pageActive+1;
break;
 case "previos":
  page=pageActive-3;
  break;
 case "next":
  page=pageActive+3;
  break;
  default:
  page = Number(event.target.getAttribute("value"));
}
// if(value==="<"){
//  page=pageActive-1;
// }else if(value===">"){
//   page=pageActive+1;
// }else if(value==="previos"){
//   page=pageActive-3;
// }else if(value==="next"){
//   page=pageActive+3;
// }else{
//   page = Number(event.target.getAttribute("value"));
// }
  loadedCatalog(page);
};

"use strict";

//определяем количество товаров на странице по умолчанию
const calculateNumberPages = (productsLength) => {
  const pageSize = document.getElementById("select-page-size").value;
  return Math.ceil(productsLength / pageSize);
};
//чистим плагинацию
const clearPagination = () => {
  console.log("dfg");
  const div = document.querySelectorAll(".pagination>a");
  console.log(div);
  div.forEach((element) => {
    element.remove();
  });
};
//создание кнопок пагинации
const creatButton = (value) => `<a value="${value}">${value}</a>`;
const creatButtonNext = () => `<a value=">">></a>`;
const creatButtonPrevios = () => `<a value="<"><</a>`;
const creatThreeFirstButtons = () =>
  `<a value="<"><</a><a value="1">1</a><a value="previos">...</a>`;
//const creatTwoLastButtons=(pageCount)=>`<a value="previos">...</a><a value="${pageCount}">${pageCount}</a>`
const creatThreeLastButtons = (pageCount) =>
  `<a value="next">...</a><a value="${pageCount}">${pageCount}</a><a value=">">></a>`;
//const creatPreviousPageButton=()=>`<a value="<"><</a>`
//const creatNextThreePagesButton=()=>`<a value="next">...</a>`
//const creatPreviousThreePagesButton=()=>`<a value="previous">...</a>`

//отрисовка пагинации
const drawPaginationButtons = (productsLength, page) => {
  //  const pagination= document.querySelectorAll('.pagination>a').remove();
  //  console.log(pagination);
  //pagination.delete;
  //const pageSize=(document.getElementById("select-page-size")).value;
  //const pageCount=Math.ceil((products.length)/pageSize);
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
        console.log(pageCount);
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
const addEventBattonsPagination=()=>{document.querySelectorAll(".pagination>a").forEach((element) => {
  element.addEventListener("click", onClickButtonPagination)})

}
