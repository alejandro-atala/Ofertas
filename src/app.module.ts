import { Module } from '@nestjs/common';
import { RegistroController } from './Registro/registro.controller';
import { RegistroService } from './Registro/registro.service';
import { ServeStaticModule } from '../node_modules/@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [ServeStaticModule.forRoot({rootPath:join(__dirname,'..','client')})],
  controllers: [ RegistroController],
  providers: [ RegistroService],
})
export class AppModule {}
