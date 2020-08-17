mapboxgl.accessToken = 'pk.eyJ1IjoiZGF1ZGk5NyIsImEiOiJjanJtY3B1bjYwZ3F2NGFvOXZ1a29iMmp6In0.9ZdvuGInodgDk7cv-KlujA';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    zoom: 13,
    center: [2.330433656745072, 48.85229003055221]
});

// change the styles
var userSpecification = {
    size:"",
    style:"",
    styleName:"",
    cardStyle:"",
    emojis:[],
    location:"",
    description:{
        name:"",
        date:"",
        text:""
    }
};


var cart = [];
var emojis = [];
var cardStyles = {

};

// Location: Link to geocoder
var geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl
});
     
document.getElementById('location').appendChild(geocoder.onAdd(map));

// Styles
var styles = document.querySelectorAll('.img');

styles.forEach(style => {

    style.addEventListener("click", function(e) {
        // remove any active style
       toggleActiveClasses(styles, 'active');

        this.classList.add('active');
        let styleId = "mapbox://styles/daudi97/" +this.getAttribute('data-style');
        let styleName = this.id;

        updateStyle(styleId,styleName);
    });
});

function updateStyle(styleId, styleName,) {
    userSpecification.style = styleId;
    userSpecification.styleName = styleName;
    map.setStyle(styleId);

}

// Size 
var sizes = document.querySelectorAll('.size');
sizes.forEach(size => {
    size.addEventListener("click", function(e) {
        toggleActiveClasses(sizes, 'btn-active');

        this.classList.add('btn-active');

        let printSize = this.innerText;
        console.log(this.innerText);
        updatePrintSize(printSize);
    });
});


function updatePrintSize(printSize) {
    userSpecification.size = printSize;
}

// Description section
var descriptionInput = document.querySelectorAll(".description");

var name = document.getElementById("name");
var date = document.getElementById("date");
var textDescription = document.getElementById("text-description");

descriptionInput.forEach(dInput => {
    dInput.addEventListener("input", function(e) {
        let name = this.name;

        userSpecification.description[name] = this.value;
        console.log(userSpecification);
    });
});

// Card styles
var activeStyle = "map-square";
var cardStylesDiv = document.querySelectorAll(".img-card");
cardStylesDiv.forEach(cardStyle => {
    cardStyle.addEventListener("click", function(e) {
        console.log("Click");
        updateMapClassStyle(this.getAttribute("data-style"));
    });
});

function updateMapClassStyle (classStyle){
    map.getContainer().classList.remove(activeStyle);

    let style = "map-"+ classStyle
    map.getContainer().classList.add(style);

    activeStyle = style;
}


// Emojis section

// Cart section
var addToCartButton = document.getElementById("cart-btn");

addToCartButton.addEventListener("click", function(e) {
    addToCart(userSpecification);
});

function addToCart(item) {
    cart.push(cart);
}

function removeItemFromCart(item) {

}

// Display checkout section
var cartInfoSection = document.getElementById("cart-info");
var toggleModalBtn = document.getElementById("toggle-checkout");
toggleModalBtn.addEventListener("click", function(e) {
    e.preventDefault();

    // popupulate the cart info section
    if(cart[0]) {
        populateCartInfoSection();
        $('#checkout').modal('show');
    } else {
        // snackbar

    }
   
});

function populateCartInfoSection() {
    cart.forEach(item => {
        cartInfoSection.innerHTML += "<p><b>"+item.styleName+"</b></p>";
    });

    
}

function checkout() {

}


// ================== Helper functions ===================================
// toggle active classess
function toggleActiveClasses(elements, className) {
    elements.forEach(element => {
        element.classList.remove(className);
    });
}