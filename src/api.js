

const BASE_URL = 'https://thinkful-list-api.herokuapp.com/roxanne-cantu';

/* Function to catch errors  */     // WHY DO WE NOT PASS THROUGH EXPORT??? Don't need to bc other functions call it
/* rest parameter syntax (...args) allows us to represent
     an indefinite number of arguments as an array. 
     creates an object named args  */
function listApiFetch(...args){
    // make variable in scope outside of promise chain
    let error;

    // seperate the objects and pass them individually
    return fetch(...args)
    .then(res => {
        // If response is not okay then error variable is 
        // set error object with value of response status
        if(!res.ok){
            error = {code: res.status};

        // If response is not JSON type, place statusText in 
        // error object and immediately reject promise
        if(!res.headers.get('content-type').includes('json')){
            // assumes object accepts keys 
            error.message = res.statusText;
            // Stating that promise is being rejected
            // raises an error
            return Promise.reject(error);
        }
        }

        // otherwise, return parsed JSON
        return res.json();
    })
    // returned res.json is stored in data
    .then(data =>{
        /* if error exists, place the JSON message into the 
            error object and reject the Promise with your 
            error object so it lands in the next 
            catch.  IMPORTANT: Check how the API sends errors 
            -- not all APIs will respond with a JSON object containing 
            message key */
            // refers to line 18's error
            if (error) {
                error.message = data.message;
                return Promise.reject(error);
              }
        
              // otherwise, return the json as normal resolved Promise
              return data;
    });
};



// Use getItems method to fetch data, place it in the store,
// and re-render the page
function getItems() {

    // Remember, fetch always returns a promise
    // so getItems is now returning a promise
    return listApiFetch(`${BASE_URL}/items`);
};


function createItem(name) {
    /* newItem vairable with a new object assigned
        This is the data we will send into our POST request
        Because key and value have the same name, we don't need to list both in ES6
        Could still use {name: name} */
    const newItem = JSON.stringify({ name });


    // Call and return fetch
    // first argument is our base url/items
    //second argument will be an object of options
    return listApiFetch(`${BASE_URL}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: newItem
    })
};

/* This function should make a PATCH request to ${BASE_URL}/items/${id}
 with the JSON request body. Updates item matching id parameter with the 
 fields provided. Requires a request body. */
function updateItem(id, updateData) {

    const newData = JSON.stringify(updateData);

    return listApiFetch(`${BASE_URL}/items/${id}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: newData
    });
};

function deleteItem(id){
    // Why do they not use $ with tick marks?
    // Use + (BASE_URL + '/items/' + id)
   return listApiFetch(`${BASE_URL}/items/${id}`, {method: 'DELETE'})
};


export default {
    getItems,
    createItem,
    updateItem,
    deleteItem
};