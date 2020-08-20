mapboxgl.accessToken = 'pk.eyJ1IjoiZGF1ZGk5NyIsImEiOiJjanJtY3B1bjYwZ3F2NGFvOXZ1a29iMmp6In0.9ZdvuGInodgDk7cv-KlujA';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    zoom: 13,
    center: [2.330433656745072, 48.85229003055221],
    attributionControl:false
});

// change the styles
var userSpecification = {
    size:"",
    style:"mapbox://styles/mapbox/streets-v11",
    orientation:"Potrait",
    scaleFactor:1,
    styleName:"streets-v11",
    cardStyle:"box",
    emojis:[],
    location:"Paris",
    description:{
        name:"Magerita",
        date:"12-03-14",
        text:"Home Is Home"
    },
    cost:20
};

var snackBar = document.getElementById('snackbar');
var mapSection = document.getElementById('map-section');
var badge = document.getElementById("badge");
var priceWithSize = document.querySelectorAll(".size-price");
var cart = [];
var emojis = [];
var cardStyles = {

};

var markers = [];
var activeEmoji = "🗺️";
var mapInfoContainer = document.getElementById('map-info');

// Location: Link to geocoder
var geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl
});

geocoder.on('result', function(e) {
    console.log(e);
    userSpecification.location = e.result.place_name;

    // 
    setTimeout(function(e) {
        geocoder.clear();
    }, 5000);
});
     
document.getElementById('location').appendChild(geocoder.onAdd(map));

map.on('load', function(e) {
    map.on('click', function(e){
        console.log(Object.values(e.lngLat));

        
            let element = document.createElement("div");
            element.innerHTML = "<span>"+activeEmoji+"</span>";

            let marker = new mapboxgl.Marker({
                element:element
                })
                .setLngLat(Object.values(e.lngLat))
                .addTo(map);
            
            element.addEventListener('click', function(e) {

                console.log(this);
                this.remove();

                e.stopPropagation();
                console.log("Marker remove");
            });

            markers.push(marker);
        
    });

    map.on('moveend', function(e) {
        let latlng = map.getCenter();

        console.log(latlng);
        var dc = document.getElementById('coordinate');

        let lat = latlng.lat > 0 ? latlng.lat.toFixed(2) + '° E' : latlng.lat.toFixed(2) + '° W';
        let lng = latlng.lng > 0 ? latlng.lng.toFixed(2) + '° N' : latlng.lng.toFixed(2) + '° S';

        dc.innerHTML = '——  ' + lat + "  /  "+ lng +'  ——';
    });
});

// Styles section
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

        let txt = this.innerText.split("\n");
        let price = txt[0];

        let size = this.getAttribute("data-size");

        printSize = size.split(",");

        let factor = this.getAttribute("data-scale");

        factor = parseFloat(factor);

        updatePrintSize(printSize, price, factor);        
        rescaleMap(factor, userSpecification.orientation);
    });
});


function updatePrintSize(printSize, price, factor) {
    userSpecification.size = printSize;
    userSpecification.cost = price;
    userSpecification.scaleFactor = factor;
}

// Description section
var descriptionInput = document.querySelectorAll(".description");

var name = document.getElementById("name");
var date = document.getElementById("date");
var textDescription = document.getElementById("text-description");

descriptionInput.forEach(dInput => {
    dInput.addEventListener("input", function(e) {
        let name = this.name;
        let element = document.getElementById(name);

        userSpecification.description[name] = this.value;
        element.innerHTML = this.value;
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
var emojis = document.querySelectorAll(".emoji");
emojis.forEach(emoji => {
    emoji.addEventListener("click", function(e) {
        let emoji = this.innerHTML;

        console.log(emoji);

        toggleActiveClasses(emojis, "emoji-active");
        this.classList.add("emoji-active");

        setEmoji(emoji);
    });
});

function setEmoji(emoji) {
    activeEmoji = emoji
}

// Cart section
var addToCartButton = document.getElementById("cart-btn");

addToCartButton.addEventListener("click", function(e) {
    addToCart(userSpecification);
    // userSpecification
});

function addToCart(item) {
    if(item.style) {
        let mapItem = JSON.parse(JSON.stringify(item));
        mapItem.id = cart.length;
        cart.push(mapItem);
        
        updateCartBadge();
        
    } else {
        // snackbar
        toggleSnackBar("Pick a style");
    }
    
}

function updateCartBadge() {
    badge.innerHTML = cart.length;
}

function removeItemFromCart(itemId) {
    cart = cart.filter(item => item.id != itemId);
    populateCartInfoSection();

    updateCartBadge();
}

// Display checkout section
var cartInfoSection = document.getElementById("cart-info");
var toggleModalBtn = document.getElementById("toggle-checkout");
cartInfoSection.innerHTML += "<p class='cart-item'><b>Item</b><b>Cost</b><b>Action</b></p>";

toggleModalBtn.addEventListener("click", function(e) {
    e.preventDefault();

    // popupulate the cart info section
    if(cart[0]) {
        populateCartInfoSection();
        $('#checkout').modal('show');
    } else {
        // snackbar
        toggleSnackBar("Your cart is empty");

    }
   
});

function populateCartInfoSection() {
    cartInfoSection.innerHTML = "";
    cart.forEach(item => {
        cartInfoSection.innerHTML += "<p class='cart-item'><b>"+item.styleName+"</b><span>"+item.cost+
            "</span><button class='btn btn-sm btn-danger w-25 cart-remove' data-id='"+item.id+"'>Remove</button</p>";
    });

    // remove cart item Event method
    removeItemEventHandler()
}

function removeItemEventHandler() {
    let removeBtns = document.querySelectorAll('.cart-remove');

    removeBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            let id = this.getAttribute('data-id');
            removeItemFromCart(parseInt(id));
        });
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

// rescale the map
function rescaleMap(factor, orientation) {
    
    let size = [60, 80];

    if(window.innerWidth < 670) {
        size = orientation != 'Potrait' ? [40, 85] : [80, 60]
    }

    if(orientation != 'Potrait') {
        size = size.reverse();
    }

    let height = size[1] * factor;
    let width =  size[0] * factor;

    // rescale the 
    mapSection.style.height = height + "vh";
    mapSection.style.width = width + "%";

    map.resize();
}

// change 
let orientButton = document.querySelectorAll('.orientation');
orientButton.forEach(button => {
    button.addEventListener("click", function(e) {
        let orientation = this.innerText;
        changeMapOrientation(orientation);

        toggleActiveClasses(orientButton, 'btn-active');
        this.classList.add('btn-active');

        userSpecification.orientation = orientation;
    });
});

function changeMapOrientation(orientation) {
   rescaleMap(
    userSpecification.scaleFactor,
    orientation
   );

   priceCalculate(orientation);
}


function priceCalculate(orientation) {
    priceWithSize.forEach(btn => {
        let txt = btn.innerText.match(/([0-9]{2,3}cm\w+)/g);

        // recalcalute the size
        if(orientation == 'Potrait') {
            let price = btn.getAttribute('data-price');
            
            btn.innerHTML = "$ " + price +"<br><b>"+txt[0]+"</b>"

        } else {
            let price = btn.getAttribute('data-price-landscape');
            btn.innerHTML = "$ " + price +"<br><b>"+txt[0]+"</b>"
        }   
    });
}

function updateLandStylePrice() {

}

// toggle snackbar
function toggleSnackBar(message) {
    console.log(message);

    snackBar.classList.toggle('open');

    snackBar.innerHTML = message;

    setTimeout(function(e) {
       snackBar.classList.toggle('open');
    }, 3000);
}
