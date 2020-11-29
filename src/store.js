
const items = [];
let hideCheckeditems = false;

const findById = function (id) {
  return this.items.find(currentItem => currentItem.id === id);
};

const addItem = function (item) {
  this.items.push(item);
};


const findAndDelete = function (id) {
  this.items = this.items.filter(currentItem => currentItem.id !== id);
};

const toggleCheckedFilter = function () {
  this.hideCheckedItems = !this.hideCheckedItems;
};

/* This function finds the current item and updates their names */
function findAndUpdate(id, newData){
  
  // Find the item using the passed id and the findById function
  const foundItem = this.findById(id);
  //Use Object.assign() to merge the newData into the current found item
  Object.assign(foundItem, newData)
};

export default {
  items,
  hideCheckeditems,
  findById,
  addItem,
  toggleCheckedFilter,
  findAndDelete,
  findAndUpdate
};