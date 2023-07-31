import { Injectable } from '@nestjs/common';
import {  Producto, Registro } from './registro';
import * as fs from 'fs';

@Injectable()
export class RegistroService {
  private  listaRegistro = [];

  
  constructor() {
    this.loadRegistros();
    this.loadProductos();
}

private loadRegistros(): any {
    let archivo = fs.readFileSync('registros.csv', 'utf-8');
    let datos: string[][] = [];
    let dato: string[];
    let linea: string;
    let lineas: string[] = archivo.split('\n');
    for (let i = 0; i < lineas.length; i++) {
        linea = lineas[i].replace('\r', '');
        dato = linea.split(',');
        datos.push(dato);
    }

    for (let i = 0; i < datos.length; i++) {

       let id = parseInt(datos[i][0]);
        let nombre = datos[i][1];
        let apellido = datos[i][2];
        let direccion = datos[i][3];
        let dni = datos[i][4];
        let comercio = datos[i][5];
        let pass = datos[i][6];
        let lat = parseFloat(datos[i][7]);
        let lon = parseFloat(datos[i][8]);
        let registro = new Registro(id,nombre, apellido, direccion, dni, comercio, pass,lat,lon)

        this.listaRegistro.push(registro);
   
    }
}


    public getRegistros(): any {
        return this.listaRegistro;
    }



public async agregarRegistro(body: any) {

    const registro = new Registro(
     body.comercianteId,
      body.nombre,
      body.apellido,
      body.direccion,
      body.dni,
      body.comercio,
      body.pass,
      body.latitude,
      body.longitude
    );

    this.listaRegistro.push(registro);
    fs.appendFileSync(
      'registros.csv',
      `\n${registro.getId()},${registro.getNombre()},${registro.getApellido()},${registro.getDireccion()},${registro.getDni()},${registro.getComercio()},${registro.getPass()},${registro.getLat()},${registro.getLon()}`
    );
    return 'OK';
  }
  

// nuevo----------------------------------



private loadProductos(): void {
  let archivo = fs.readFileSync('productos.csv', 'utf-8');
  let datos: string[][] = [];
  let dato: string[];
  let linea: string;
  let lineas: string[] = archivo.split('\n');
  for (let i = 0; i < lineas.length; i++) {
      linea = lineas[i].replace('\r', '');
      dato = linea.split(',');
      datos.push(dato);
  }

  for (let i = 0; i < datos.length; i++) {

     let id = parseInt(datos[i][0]);
      let producto = datos[i][1];
      let precio = parseInt(datos[i][2]);
  
      let registro = new Producto(id,producto, precio)

      this.listaProductos.push(registro);
  }
}


private  listaProductos = [];

public async agregarProducto(body: any) {
  console.log(body)
  const registro = new Producto(
   body.id,
    body.producto,
    body.precio 
  );

  this.listaProductos.push(registro);
 
  fs.appendFileSync(
    'productos.csv',`${registro.getId()},${registro.getProducto()},${registro.getPrecio()}\n`
  );
  return 'OK';
}




public eliminarProducto(id:number):any{
  let existe = false;
  let pos = 0;
 console.log(this.listaProductos)
  for(let i= 0; i < this.listaProductos.length; i++){

      if(id === this.listaProductos[i].id){
          existe = true;
          pos = i
      }
  }
  if(existe){
      this.listaProductos.splice(pos,1);
      this.updateCSV();
      return {
      "msj": `Producto ${id} eliminado`
      
      }
  }
  else{
      return{
          "msj": `Producto ${id} no encontrado`
      }
  }
}


private updateCSV():void{
  let csv = "";
  for(let i=0; i < this.listaProductos.length; i++){
      csv+= `${this.listaProductos[i].getId()},${this.listaProductos[i].getProducto()},${this.listaProductos[i].getPrecio()}\n`
  }
  csv = csv.substring(0,csv.length-1);
  fs.writeFileSync('productos.csv',csv);
}

}
