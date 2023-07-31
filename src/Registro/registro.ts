

export class Registro {
    private id: number
    private nombre: string;
    private apellido: string;
    private direccion: string;
    private dni: string;
    private comercio: string;
    private pass: string;
    private latitude: number;
    private longitude: number;
    productos: any;
  
    constructor(
        id: number,
      nombre: string,
      apellido: string,
      direccion: string,
      dni: string,
      comercio: string,
      pass: string,
      latitude: number,
      longitude: number
    ) {
        this.id = id;
      this.nombre = nombre;
      this.apellido = apellido;
      this.direccion = direccion;
      this.dni = dni;
      this.comercio = comercio;
      this.pass = pass;
      this.latitude = latitude;
      this.longitude = longitude;
    }

    public getId(): number {
        return this.id;
    }

    public getNombre(): string {
        return this.nombre;
    }

    public getApellido(): string {
        return this.apellido;
    }

    public getDireccion(): string {
        return this.direccion;
    }

    public getDni(): string {
        return this.dni;
    }
    public getComercio(): string {
        return this.comercio;
    }
    public getPass(): string {
        return this.pass;
    }
    public getLat(): number {
        return this.latitude;
    }
    public getLon(): number {
        return this.longitude;
    }



    public setNombre(nombre: string) {
        this.nombre = nombre;
    }

    public setApellido(apellido: string) {
        this.apellido = apellido;
    }

    public setDireccion(direccion: string) {
        this.direccion = direccion;
    }

    public setDni(dni: string) {
        this.dni = dni;
    }
    public setComercio(comercio: string) {
        this.comercio = comercio;
    }
    public setPass(pass: string) {
        this.pass = pass;
    }
    public setLat(latitude: number) {
        this.latitude = latitude;
    }
    public setLon(longitude: number) {
        this.longitude = longitude;
    }

}

// nuevo ---------------



export class Producto {   
    private id: number 
    private producto: string;
    private precio: number;

  
    constructor(
        id: number,
        producto: string,
        precio: number,

    ) {
        this.id = id;
      this.producto = producto;
      this.precio = precio;
      
    }

    public getId(): number {
        return this.id;
    }

    public getProducto(): string {
        return this.producto;
    }

    public getPrecio(): number {
        return this.precio;
    }
}