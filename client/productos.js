

async function agregarProducto(id,producto,precio) {


    let productos = {
        "id" : id,
        "producto": producto,
        "precio": precio,
    }
 

    let respuesta = await fetch('/registro/agregarProd', {
        method: 'POST',
        headers: { 'content-Type': 'application/json' },
        body: JSON.stringify(productos)
    });
    return (await respuesta.text() == "OK")
}




async function eliminarProducto() {
    let id = this.getAttribute("identificador");
    let response = await fetch(`/registro/eliminar/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    });

}