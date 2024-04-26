import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'GEYSER_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'solana.geyser',
          protoPath: join('src/geyser/geyser.proto'),
          url: '127.0.0.1:10000',
        },
      },
    ]),
  ],
  providers: [AppService],
})
export class AppModule {}
