window.onload = renderData;
const url = "http://localhost:8080/customer";
let getUrl = `${url}/getAll?`;

let pageUrl = new URLSearchParams(location.search);
const bearerToken = pageUrl.get("token");





function renderData() {
  getAndRender(getUrl);
}

// Search Functionality
let searchBtn = document.getElementById("srch");
searchBtn.addEventListener("click", search);

function search() {
  let str = document.getElementById("search-bar").value;
  let searchUrl = getUrl + `&searchParam=${str}`;
  getAndRender(searchUrl);
}

// Sort Functionality
let sortField = document.getElementById("sort-by");
sortField.addEventListener("change", sortFields);

function sortFields(event) {
  let field = event.target.value;
  let sortUrl = getUrl + `&sortParam=${field}`;
  getAndRender(sortUrl);
}



let currentPage = 1;
//changingPages
let nxtBtn = document.getElementById("nxt");
nxtBtn.addEventListener("click", nxtPage);
function nxtPage() {
  currentPage++;
  let nextPageUrl = getUrl + `&pageNoParam=${currentPage}`;
  getAndRender(nextPageUrl);
}

let prvBtn = document.getElementById("prv");
prvBtn.addEventListener("click", prvPage);
function prvPage() {
  if(currentPage > 1){
    currentPage--;
    let nextPageUrl = getUrl + `&pageNoParam=${currentPage}`;
    getAndRender(nextPageUrl);
  }
}


function getAndRender(urlParam) {
  let card = document.getElementById("cards");
  console.log(urlParam);
  fetch(urlParam , {
    method : "GET",
    headers: {
      'Authorization': `Bearer ${bearerToken}`
    }
  })
    .then((res) => res.json())
    .then((list) => {
      card.innerHTML = ""; // Clear existing content before rendering new data
      list.forEach((card_data) => {
        card.innerHTML += `
          <div class="card">
            <div class="card-info">
              <h2>${card_data.first_name}  ${card_data.last_name}</h2>
              <p>Customer Id : ${card_data.id}</p>
              <p>${card_data.street}, ${card_data.address}, ${card_data.city} , ${card_data.state}</p>
              <p>Email: ${card_data.email}</p>
              <p>Phone: ${card_data.phone}</p>
            </div>
            <div class="card-actions" id="${card_data.id}">
              <button class="action-btn del_button"><i class="fa-solid fa-trash"></i></button>
              <button class="action-btn update_button"><i class="fa-solid fa-pen"></i></button>
            </div>
          </div>`;
      });

      attachEventListeners();
    });
}


function attachEventListeners() {
  let delBtns = document.getElementsByClassName("del_button");

  Array.from(delBtns).forEach((element) => {
    element.addEventListener("click", () => {
      let id = element.parentElement.id;
      deleteCard(id);
    });
  });

  let updateBtns = document.getElementsByClassName("update_button");

  Array.from(updateBtns).forEach((element) => {
    element.addEventListener("click", () => {
      let id = element.parentElement.id;
      updateCard(id);
    });
  });
}
var popup = document.getElementById("popup-form");

var addCustomerBtn = document.getElementById("add-customer-btn");

addCustomerBtn.onclick = function () {
  openPopUp();
};

function openPopUp() {
  popup.style.display = "block";
}

function openPopUp(id) {
  renderPopUp(id);
  popup.style.display = "block";
}

async function renderPopUp(id) {
  let getByIdUrl = `${url}/getById?id=${id}`;
  if (!id) {
    popup.innerHTML = `
      <div class="popup-content">
        <span class="close" onclick="closePopup()">&times;</span>
        <h2>Add Customer</h2>
        <form id="customerForm">
          <label for="first_name">First Name:</label>
          <input type="text" id="first_name" name="first_name" required><br><br>
          <label for="last_name">Last Name:</label>
          <input type="text" id="last_name" name="last_name" required><br><br>
          <label for="street">Street:</label>
          <input type="text" id="street" name="street" required><br><br>
          <label for="address">Address:</label>
          <input type="text" id="address" name="address" required><br><br>
          <label for="city">City:</label>
          <input type="text" id="city" name="city" required><br><br>
          <label for="state">State:</label>
          <input type="text" id="state" name="state" required><br><br>
          <label for="email">Email:</label>
          <input type="email" id="email" name="email" required><br><br>
          <label for="phone">Phone:</label>
          <input type="tel" id="phone" name="phone" required><br><br>
          <button type="submit" class="btn">Submit</button>
        </form>
      </div>
    `;
    
    document.getElementById("customerForm").addEventListener("submit", onSubmitForm);
  } else {
    fetch(getByIdUrl , {
        method : "GET",
        headers: {
          'Authorization': `Bearer ${bearerToken}`
        }
    } )
      .then((response) => response.json())
      .then((data) => {
        popup.innerHTML = `
          <div class="popup-content">
            <span class="close" onclick="closePopup()">&times;</span>
            <h2>Add Customer</h2>
            <form id="customerForm">
              <label for="first_name">First Name:</label>
              <input type="text" id="first_name" name="first_name" value="${data.first_name}" required><br><br>
              <label for="last_name">Last Name:</label>
              <input type="text" id="last_name" name="last_name" value="${data.last_name}" required><br><br>
              <label for="street">Street:</label>
              <input type="text" id="street" name="street" value="${data.street}" required><br><br>
              <label for="address">Address:</label>
              <input type="text" id="address" name="address" value="${data.address}" required><br><br>
              <label for="city">City:</label>
              <input type="text" id="city" name="city" value="${data.city}" required><br><br>
              <label for="state">State:</label>
              <input type="text" id="state" name="state" value="${data.state}" required><br><br>
              <label for="email">Email:</label>
              <input type="email" id="email" name="email" value="${data.email}"  required><br><br>
              <label for="phone">Phone:</label>
              <input type="tel" id="phone" name="phone" value="${data.phone}" required><br><br>
              <button type="submit" class="btn">Submit</button>
            </form>
          </div>
        `;

        document.getElementById("customerForm").addEventListener("submit", async function(event) {
          event.preventDefault(); 
          await onUpdateForm(event); 
          deleteCard(id);
        });
      });
  }
}



function onSubmitForm(event) {

  var firstName = document.getElementById("first_name").value;
  var lastName = document.getElementById("last_name").value;
  var street = document.getElementById("street").value;
  var address = document.getElementById("address").value;
  var city = document.getElementById("city").value;
  var state = document.getElementById("state").value;
  var email = document.getElementById("email").value;
  var phone = document.getElementById("phone").value;

  var params = {
    first_name: firstName,
    last_name: lastName,
    street: street,
    address: address,
    city: city,
    state: state,
    email: email,
    phone: phone
  };

  //add Customer
  updateCards(params);

}

function onUpdateForm(event) {
  event.preventDefault(); // 

  var firstName = document.getElementById("first_name").value;
  var lastName = document.getElementById("last_name").value;
  var street = document.getElementById("street").value;
  var address = document.getElementById("address").value;
  var city = document.getElementById("city").value;
  var state = document.getElementById("state").value;
  var email = document.getElementById("email").value;
  var phone = document.getElementById("phone").value;

  var params = {
    first_name: firstName,
    last_name: lastName,
    street: street,
    address: address,
    city: city,
    state: state,
    email: email,
    phone: phone
  };

 updateCards(params);

  
}

async function deleteCard(id) {
  let delUrl = `${url}/delete?id=${id}`;
  

  await fetch(delUrl, {
    method : "DELETE",
    headers: {
      'Authorization': `Bearer ${bearerToken}`
    }
})
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    console.log('Card deleted successfully');
  })
  .catch(error => {
    console.error('Error deleting card:', error);
  });

  window.location.reload();
}


function updateCards(params) {
  let addUrl = `${url}/add`;

  fetch(addUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${bearerToken}`
    },
    body:JSON.stringify(params)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Customer added successfully:', data);
  })
  .catch(error => {
    console.error('Error adding customer:', error);
  });
}


function closePopup() {
  popup.style.display = "none";
}
window.onclick = function (event) {
  if (event.target == popup) {
    popup.style.display = "none";
  }
};

function updateCard(id) {
  openPopUp(id);
}

let syncBtn = document.getElementById("sync");
syncBtn.addEventListener("click" , syncDb);

async function syncDb() {
  console.log("clickerd");
  await fetch(`http://localhost:8080/customer/sync` , {
    method : "GET",
    headers: {
      'Authorization': `Bearer ${bearerToken}`
    }
  });

  renderData(`http://localhost:8080/customer/getAll`);
}


let delAllbtn = document.getElementById("delAll");
delAllbtn.addEventListener("click" , deleteAll);

function deleteAll() {
  fetch(`http://localhost:8080/customer/deleteAll` , {
    method : "DELETE",
    headers: {
      'Authorization': `Bearer ${bearerToken}`
    }
  });

  window.location.reload();
  
}




