import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { RegistroService } from './registro.service';

@Controller('registro')
export class RegistroController {

    constructor(private registroService: RegistroService) { }

    @Get('mostrar')
    public getRegistros(): any {
        return this.registroService.getRegistros();
    }


    @Post('agregar')
    public agregarRegistro(@Body() body: any):any {
        return this.registroService.agregarRegistro(body)
    }

    @Post('agregarProd')
    public agregarProducto(@Body() body: any):any {
        return this.registroService.agregarProducto(body)
    }

    @Delete("eliminar/:id")
    public eliminarPista(@Param("id", ParseIntPipe) id :number): any{
        return this.registroService.eliminarProducto(id)
    }
}
