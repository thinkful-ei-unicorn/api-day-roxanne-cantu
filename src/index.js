import $ from 'jquery';

import 'normalize.css';
import './index.css';

import shoppingList from './shopping-list';

import api from './api';
import store from './store';




const main = function (){ 
  
  /* Here we are: fetching all of our items,
  iterating through the response,
  running store.addItem on each response,
  and re-running shoppingList.render()  */
  api.getItems()
  .then((items) => {
    items.forEach((item) => store.addItem(item));
    shoppingList.render();

  });

  shoppingList.bindEventListeners();
  // creates new var shoppingListItemsString and calls 
  // generateShoppingItemsString function passing in new array "items" with only
  // items that are not checked with buttons
  //and displays
  shoppingList.render();
};

$(main);
