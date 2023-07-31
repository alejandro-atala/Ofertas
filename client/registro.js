function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    alert("La geolocalización no está soportada por este navegador.");
  }
}

function showPosition(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  // Llenar automáticamente los campos de latitud y longitud en el formulario de registro
  document.getElementById("latitude").value = latitude;
  document.getElementById("longitude").value = longitude;
}

function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      alert("El usuario denegó la solicitud de geolocalización.");
      break;
    case error.POSITION_UNAVAILABLE:
      alert("La información de ubicación no está disponible.");
      break;
    case error.TIMEOUT:
      alert("Se agotó el tiempo para obtener la ubicación.");
      break;
    case error.UNKNOWN_ERROR:
      alert("Ocurrió un error desconocido al obtener la ubicación.");
      break;
  }
}

function registrarse() {
  const nombre = document.getElementById("Nombre").value;
  const apellido = document.getElementById("Apellido").value;
  const direccion = document.getElementById("DireccionDelComercio").value;
  const dni = document.getElementById("DNI").value;
  const comercio = document.getElementById("nombreComercio").value;
  const pass = document.getElementById("Contraseña").value;
  const latitude = parseFloat(document.getElementById("latitude").value);
  const longitude = parseFloat(document.getElementById("longitude").value);

  const comercianteId = generarIdUnico();

  // Guardar los datos del formulario en el almacenamiento local
  localStorage.setItem('comercianteId', comercianteId);
  localStorage.setItem('nombre', nombre);
  localStorage.setItem('apellido', apellido);
  localStorage.setItem('direccion', direccion);
  localStorage.setItem('dni', dni);
  localStorage.setItem('comercio', comercio);
  localStorage.setItem('pass', pass);
  localStorage.setItem('latitude', latitude);
  localStorage.setItem('longitude', longitude);

  // Redireccionar a la página de pago de Mercado Pago
  window.location.href = 'https://mpago.la/17QmeaD';
}

window.onload = function() {
  completarRegistro();
};

async function completarRegistro() {
  const comercianteId = localStorage.getItem('comercianteId');
  const nombre = localStorage.getItem('nombre');
  const apellido = localStorage.getItem('apellido');
  const direccion = localStorage.getItem('direccion');
  const dni = localStorage.getItem('dni');
  const comercio = localStorage.getItem('comercio');
  const pass = localStorage.getItem('pass');
  const latitude = parseFloat(localStorage.getItem('latitude'));
  const longitude = parseFloat(localStorage.getItem('longitude'));

  if (comercianteId && nombre && apellido && direccion && dni && comercio && pass && !isNaN(latitude) && !isNaN(longitude)) {
    const data = {
      comercianteId,
      nombre,
      apellido,
      direccion,
      dni,
      comercio,
      pass,
      latitude,
      longitude
    };

    let response = await fetch('/registro/agregar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => {
        if (response.ok) {
          alert('Registro exitoso. Su ID es: ' + comercianteId);
          // Restablecer los campos del formulario
          document.getElementById("Nombre").value = "";
          document.getElementById("Apellido").value = "";
          document.getElementById("DireccionDelComercio").value = "";
          document.getElementById("DNI").value = "";
          document.getElementById("nombreComercio").value = "";
          document.getElementById("Contraseña").value = "";
          document.getElementById("latitude").value = "";
          document.getElementById("longitude").value = "";
        } else {
          //  alert('Error al registrar');
        }
      })
      .catch(error => {
        alert('Error al realizar la solicitud');
        console.error(error);
      });

    // Limpiar los datos del almacenamiento local
    localStorage.removeItem('comercianteId');
    localStorage.removeItem('nombre');
    localStorage.removeItem('apellido');
    localStorage.removeItem('direccion');
    localStorage.removeItem('dni');
    localStorage.removeItem('comercio');
    localStorage.removeItem('pass');
    localStorage.removeItem('latitude');
    localStorage.removeItem('longitude');
  }
}

let ultimoId = 0;

function generarIdUnico() {
  ultimoId++;
  return ultimoId;
}
