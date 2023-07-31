const comercios = [
  { id: 1, nombre: "carniceria", password: "1234", latitud: -38.727140350561176, longitud: -61.29254884546753, productos: [], marcador: null },
  { id: 2, nombre: "verduleria", password: "1234", latitud: -38.720140350561176, longitud: -61.28254884546753, productos: [], marcador: null },
  { id: 3, nombre: "supermercado", password: "1234", latitud: -38.728140350561176, longitud: -61.28254884546753, productos: [], marcador: null }
];

let currentUser = null;
let isComerciante = false;
let markerDragEnabled = false; // Variable para habilitar/deshabilitar el movimiento del marcador
let map;
let mapInitialized = false;

// Función para obtener la ubicación actual del dispositivo y llamar a initMap
function getLocation() {

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const latitudInicial = position.coords.latitude;
        const longitudInicial = position.coords.longitude;
        console.log("Poicisionamiento por GPS");
        initMap(latitudInicial, longitudInicial);
      },
      function (error) {
        console.log("Error al obtener la ubicación: " + error.message);
        initMap(-38.727140350561176, -61.29254884546753); // Ubicación predeterminada en caso de error
      }
    );
  } else {
    console.log("La geolocalización no es compatible con este navegador.");
    initMap(-38.727140350561176, -61.29254884546753); // Ubicación predeterminada si no es compatible
  }
}

function initMap() {

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const latitud = position.coords.latitude;
        const longitud = position.coords.longitude;
        createMap(latitud, longitud);
      },
      function (error) {
        console.log("Error al obtener la ubicación:", error);
        // Si no se puede obtener la ubicación, puedes proporcionar valores predeterminados
        const latitud = -38.728140350561176;
        const longitud = -61.29254884546753;
        createMap(latitud, longitud);
      }
    );
  } else {
    // Si el navegador no admite la geolocalización, también puedes proporcionar valores predeterminados
    const latitud = -38.728140350561176;
    const longitud = -61.29254884546753;
    createMap(latitud, longitud);
  }
}

function createMap(latitud, longitud) {
  const loadingText = document.getElementById('loading-text');
  loadingText.style.display = 'none';
  map = L.map("map").setView([latitud, longitud], 14);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    maxZoom: 18
  }).addTo(map);

  comercios.forEach(comercio => {
    const marker = L.marker([comercio.latitud, comercio.longitud], { draggable: false }).addTo(map);
    marker.bindPopup(createPopupContent(comercio));
    comercio.marcador = marker;
  });

  const showParagraphCheckbox = document.getElementById("showParagraph");
  showParagraphCheckbox.addEventListener("change", function () {
    const comercioComerciante = comercios.find(c => c.nombre === currentUser);
    const marker = comercioComerciante.marcador;
    const popupContent = createPopupContent(comercioComerciante);
    marker.getPopup().setContent(popupContent);
  });


  if (comercios.length > 0) {
    showProducts(comercios[0].id);
  }
}

function createPopupContent(comercio) {
  let popupContent = `<h3>${comercio.nombre}</h3>`;

  const showParagraphCheckbox = document.getElementById("showParagraph");
  const isParagraphVisible = showParagraphCheckbox.checked;

  if (comercio.nombre === currentUser) { // Verificar si el comercio coincide con el usuario actual
    if (comercio.productos && comercio.productos.length > 0) {
      const productosValidos = comercio.productos.filter((_, index) => index < comercio.productos.length);
      if (productosValidos.length > 0) {
        popupContent += `<h4>Productos en oferta:</h4>`;
        popupContent += `<ul>`;
        productosValidos.forEach(producto => {
          popupContent += `<li>${producto.nombre} - $ ${producto.precio}</li>`;
        });
        popupContent += `</ul>`;
      }
    } else {
      popupContent += `<p>No hay productos en oferta.</p>`;
    }

    if (isParagraphVisible) {
      popupContent += `<h4>Reintegro cuenta DNI</h4>`;
    }
  }

  return popupContent;
}

function restoreCheckboxState(comercio) {
  const checkboxState = localStorage.getItem(`checkboxState_${comercio.id}`);

  if (checkboxState === "true") {
    comercio.marcador.getPopup().getElement().querySelector("#showParagraph").checked = true;
  } else {
    comercio.marcador.getPopup().getElement().querySelector("#showParagraph").checked = false;
  }
}

function updateCheckboxState(comercio) {
  const checkbox = comercio.marcador.getPopup().getElement().querySelector("#showParagraph");
  const checkboxState = checkbox.checked;
  localStorage.setItem(`checkboxState_${comercio.id}`, checkboxState);
}



// function locateMarker(comercioId) {
//   const comercio = comercios.find(c => c.id === comercioId);
//   const marker = comercio.marcador;
//   const locateButton = document.querySelector("#locateButton");

//   if (!markerDragEnabled) {
//     marker.dragging.enable();
//     marker.on("dragend", function (e) {
//       const latLng = e.target.getLatLng();
//       comercio.latitud = latLng.lat;
//       comercio.longitud = latLng.lng;
//     });
//     markerDragEnabled = true;
//     locateButton.innerText = "Fijar aquí";
//   } else {
//     marker.dragging.disable();
//     markerDragEnabled = false;
//     locateButton.textContent = "Ubicar en el mapa";
//   }
// }

function createProductListItem(producto, index, comercioId) {
  const listItem = document.createElement("li");
  listItem.textContent = `${producto.nombre} - $ ${producto.precio}  -   `;

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Eliminar";
  deleteButton.addEventListener("click", function () {
    removeProduct(comercioId, index, listItem); // Pasamos el listItem como argumento
  });

  listItem.appendChild(deleteButton);

  return listItem;
}

function showProducts(comercioId) {
  clearProductList(); // Limpiar la lista de productos antes de mostrar los nuevos productos

  const comercio = comercios.find(c => c.id === comercioId);
  const productList = document.getElementById("productList");

  if (comercio.productos.length > 0) {
    comercio.productos.forEach((producto, index) => {
      const listItem = createProductListItem(producto, index, comercioId);
      productList.appendChild(listItem);
    });
  } else {
    const listItem = document.createElement("li");
    listItem.textContent = "No hay ofertas";
    productList.appendChild(listItem);
  }

  const marker = comercio.marcador;
  const popupContent = createPopupContent(comercio);
  marker.getPopup().setContent(popupContent);
}

function removeProduct(comercioId, productoIndex, listItem) {
  const comercio = comercios.find(c => c.id === comercioId);

  if (productoIndex >= 0 && productoIndex < comercio.productos.length) {
    comercio.productos.splice(productoIndex, 1);
    showProducts(comercioId);
    listItem.remove(); // Eliminamos el listItem del DOM
  }
}

function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const comercio = comercios.find(c => c.nombre === username && c.password === password);

  if (comercio) {
    currentUser = comercio.nombre;
    isComerciante = true;

    const storedProducts = localStorage.getItem(`productosComercio_${comercio.id}`);
    if (storedProducts) {
      comercio.productos = JSON.parse(storedProducts);
    }

    document.getElementById("loginForm").style.display = "none";
    document.getElementById("addProductForm").style.display = "block";
    document.querySelector(".product-title").style.display = "block";
    document.querySelector(".product-list").style.display = "block";
    showProducts(comercio.id);
  } else {
    alert("Nombre de usuario o contraseña incorrectos.");
  }
}


function logout() {
  const comercioActual = comercios.find(c => c.nombre === currentUser);

  localStorage.setItem("productosComercio", JSON.stringify(comercioActual.productos));

  currentUser = null;
  isComerciante = false;
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("addProductForm").style.display = "none";
  document.querySelector(".product-title").style.display = "none";
  document.querySelector(".product-list").style.display = "none";
  clearProductList();
  const comercioComerciante = comercios.find(c => c.nombre === currentUser);
  comercioComerciante.marcador.removeFrom(map);
}

function clearProductList() {
  const productList = document.getElementById("productList");
  productList.innerHTML = "";
}

function storeProduct(comercioId, productName, productPrice) {
  const comercio = comercios.find(c => c.id === comercioId);

  if (productName.trim() === "" || isNaN(productPrice)) {
    alert("Ingresa valores válidos para el producto.");
    return;
  }

  if (!comercio.productos) {
    comercio.productos = [];
  }

  comercio.productos.push({ nombre: productName, precio: parseFloat(productPrice) });

  // Almacenar los productos en el almacenamiento local
  localStorage.setItem(`productosComercio_${comercioId}`, JSON.stringify(comercio.productos));
}

function addProduct() {
  if (!isComerciante) {
    alert("No tienes permisos para agregar productos.");
    return;
  }

  const productNameInput = document.getElementById("productName");
  const productPriceInput = document.getElementById("productPrice");
  const productName = productNameInput.value;
  const productPrice = parseFloat(productPriceInput.value);

  const comercioActual = comercios.find(comercio => comercio.nombre === currentUser);

  if (!productName || isNaN(productPrice)) {
    alert("Ingresa valores válidos para el producto");
    return;
  }
  
  agregarProducto(comercioActual.id, productName, productPrice);
  storeProduct(comercioActual.id, productName, productPrice);

  productNameInput.value = "";
  productPriceInput.value = "";
  if (markerDragEnabled) {
    locateMarker(comercioActual.id);
  }

  showProducts(comercioActual.id);
  const comercioComerciante = comercios.find(c => c.nombre === currentUser);
comercioComerciante.marcador.openPopup();
}

const iniciar = document.getElementById('password');

iniciar.addEventListener('keydown', function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    login();
  }
});

document.addEventListener("DOMContentLoaded", function () {
  getLocation();
  initMap();

  const addProductButton = document.getElementById("addProductButton");
  const locateButton = document.getElementById("locateButton");

  addProductButton.addEventListener("click", addProduct);
  locateButton.addEventListener("click", function () {
    const comercioComerciante = comercios.find(c => c.nombre === currentUser);
    locateMarker(comercioComerciante.id);
  });
});