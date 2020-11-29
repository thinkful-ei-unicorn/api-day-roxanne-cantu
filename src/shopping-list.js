import $ from 'jquery';

import store from './store';

import api from './api';

const generateItemElement = function (item) {
  let itemTitle = `<span class="shopping-item shopping-item__checked">${item.name}</span>`;
  if (!item.checked)//if-statement only works "item.check=False"
  //formating the text to look grey and italicized
   {
    itemTitle = `
      <form class="js-edit-item">
        <input class="shopping-item" type="text" value="${item.name}" />
      </form>
    `;
  }
// returns item name with check and delete buttons
  return `
    <li class="js-item-element" data-item-id="${item.id}">
      ${itemTitle}
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
          <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
          <span class="button-label">delete</span>
        </button>
      </div>
    </li>`;
    
};

const generateShoppingItemsString = function (shoppingList) {

  // "item" goes through all of shoppingList array and calls
  // generateItemElement for each item in shoppingList array to make item name with buttons
  // new array is set to items var
  const items = shoppingList.map((item) => generateItemElement(item));
  // returns a string of all items array with buttons
  return items.join('');
};

function generateError(message){
  return `<section class="error-content">
          <button id= "cancel-error">X</button>
          <p>${message}</p>
          </section>`;
};

function renderError(){
  if(store.error){
    const el = generateError(store.error);
    $('.error-container').html(el);
  } else {
    $('.error-container').empty();
  }
};


function handleCloseError(){
  $('.error-container').on('click', '#cancel-error', () => {
    store.setError(null);
    renderError();
  });
};


const render = function () {
  renderError();

  // Filter item list if store prop is true by item.checked === false
  /* This rest parameter syntax creates an array that holds the length of the items array */
  let items = [...store.items];//copies "items" array from store script into "items" variable
  if (store.hideCheckedItems)//Note:hideCheckItems (=False) is a boolean var so if-statement only works if true
  {
    items = items.filter(item => !item.checked);//is looking at all "items" elements and filtering/removing all the 
    //elements that have "checked=True"
  }

  // render the shopping list in the DOM
  // creates new var shoppingListItemsString and calls 
  // generateShoppingItemsString function passing in new array "items" with only
  // items that are not checked with buttons
  const shoppingListItemsString = generateShoppingItemsString(items);

  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
};


const handleNewItemSubmit = function () {

  $('#js-shopping-list-form').submit(function (event) {
    event.preventDefault();
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');

  // We add a cal to our API before we add to our local store
  api.createItem(newItemName)
  .then(newItem => {
    store.addItem(newItem);
    render();
  })

  // passed on error from api listApiFetch and will detail the error further to user
  .catch((error) => {
    store.setError(error.message);
    renderError();
  });
});
};

const getItemIdFromElement = function (item) {
  return $(item)
    .closest('.js-item-element')
    .data('item-id');
};

/* Get delete event listener to function by calling in 
   api delete function to convert id of item to json
   then call store findAndDelete function to find item and
   officially delete. followed by render function */
const handleDeleteItemClicked = function () {
  // like in `handleItemCheckClicked`, we use event delegation
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    // get the index of the item in store.items
    const id = getItemIdFromElement(event.currentTarget);
    
    api.deleteItem(id)
    .then(() => {
      // delete the item
    store.findAndDelete(id)
    // render the updated shopping list
    render();
  })
  .catch((error) => {
    console.log(error);
    store.setError(error.message);
    renderError();
  });
});
};

const handleEditShoppingItemSubmit = function () {
  $('.js-shopping-list').on('submit', '.js-edit-item', event => {
    event.preventDefault();
    const id = getItemIdFromElement(event.currentTarget);
    const itemName = $(event.currentTarget).find('.shopping-item').val();
    
    api.updateItem(id, {name: itemName})
    // Empty bc just updating an item that already exists using new arguments
    .then(() => {
    store.findAndUpdate(id, {name: itemName})
    render();
    })
    .catch((error) => {
      console.log(error);
      store.setError(error.message);
      renderError();
    });
  });
};

/* Wire up the methods for editing the items name and toggling
the item's completed property to use the new findAndUpdate
methods in your api and store modules  */
const handleItemCheckClicked = function () {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    const id = getItemIdFromElement(event.currentTarget);
    let item = store.findById(id);
    api.updateItem(id, {checked: !item.checked})
    .then(() => {
      store.findAndUpdate(id, {checked: !item.checked})
    render();
    })

    .catch((error) => {
      store.setError(error.message);
      renderError();
    });
  });
};

const handleToggleFilterClick = function () {
  $('.js-filter-checked').click(() => {
    store.toggleCheckedFilter();
    render();
  });
};

const bindEventListeners = function () {
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleEditShoppingItemSubmit();
  handleToggleFilterClick();
  handleCloseError();
};
// This object contains the only exposed methods from this module:
export default {
  render,
  bindEventListeners
};