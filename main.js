"use strict";
import {drawPaginationButtons} from "./pagination.js";
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
}
sendRequest();

//сделать элементы видимыми
const makeElementsVisible = () => {
  document.querySelector(".catalog-header").style.display = "flex";
  document.querySelector(".div-select").style.display = "flex";
  document.querySelector(".pagination").style.display = "flex";
}

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
}

//сортируем по названию
const sortedTitle = (products) => {
  products.sort((a, b) => {
    const titleA = a.title.toLowerCase();
    const titleB = b.title.toLowerCase();
    return titleA < titleB ? -1 : titleA > titleB ? 1 : 0;
  });
}

//сортируем по цене
const sortedPriceLowToHigh = (products) => {
  products.sort((a, b) => {
    return a.price - b.price;
  });
}

const sortedPriceHighToLow = (products) => {
  products.sort((a, b) => {
    return b.price - a.price;
  });
}

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
}

//заполняем элементы каталога
const loadedCatalogList = (products,page) => {
  const cutProducts=cutCatalogList(products,page);
  cutProducts.forEach((element, index) => {
    const name = element.title;
    const category = element.category;
    const brand = element.brand;
    const price = element.price;
    const div = document.querySelector(".catalog-list");
    const catalogList = creatCatalogList(index, name, category, brand, price);
    div.insertAdjacentHTML("beforeend", catalogList);
  });
}

//чистим каталог
const clearCatalogList = () => {
  // const div = document.querySelectorAll(".catalog-list-item");
  // div.forEach((element) => {
  //   element.remove();
  // });
  const div = document.querySelector(".catalog-list");
  div.innerHTML='';
}

//загрузка отсортированного каталога
const loadedCatalog = async (page) => {
  const catalog = await sendRequest();
  const products = catalog.products;
  const productsLength=products.length;
  makeElementsVisible();
  clearCatalogList();
  sortedCatalog(products);
  loadedCatalogList(products,page);
  drawPaginationButtons(productsLength, page);
  addEventBattonsPagination();
  addEventBattonsCatalog();
};
loadedCatalog(1);

//обработка событий списка сортировки
document.getElementById("select-sort").addEventListener("change", () => {
  loadedCatalog(1);
})
document.getElementById("select-page-size").addEventListener("change", () => {
  loadedCatalog(1);
})

//обрезаем массив продуктов в зависимости от количества элементов выводимых на страницу
const cutCatalogList=(products,page)=>{
const numberElements=Number(document.getElementById("select-page-size").value);
const startElements=page*numberElements-numberElements;
return products.slice(startElements,startElements+numberElements);
}

//функция для обработки событий клика кнопки пагинации
const onClickButtonPagination=(event) => {
  const pageActive=Number(document.querySelector('.active').getAttribute("value"));
  const value=event.target.getAttribute("value");
let page;
if(value==="<"){
 page=pageActive-1;
}else if(value===">"){
  page=pageActive+1;
}else if(value==="previos"){
  page=pageActive-3;
}else if(value==="next"){
  page=pageActive+3;
}else{
  page = Number(event.target.getAttribute("value"));
}
  loadedCatalog(page);
}

//добавляем на кнопки пагинации обработчик событий
const addEventBattonsPagination=()=>{document.querySelectorAll(".pagination>a").forEach((element) => {
  element.addEventListener("click", onClickButtonPagination)})
}

//добавляем на кнопки каталога обработчик событий
const addEventBattonsCatalog=()=>{document.querySelectorAll(".catalog-list-item-button-buy").forEach((element) => {
  element.addEventListener("click", onClickButtonCatalog)})
}

const onClickButtonCatalog=(event)=>{
  event.target.classList.add('catalog-list-item-button-in-cart');
  event.target.textContent="In cart";
  setCounter();
}

//счетчик корзины
const   setCounter=()=>{
 const counter=document.querySelector(".counter-cart");
 let count=Number(document.querySelector(".counter-cart").textContent);
count+=1;
counter.textContent=count;
}