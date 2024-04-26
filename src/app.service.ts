import {
  Inject,
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

interface Geyser {
  subscribeTransactionUpdates(request: any): Observable<any>;
}

@Injectable()
export class AppService implements OnModuleInit, OnModuleDestroy {
  private geyserService: Geyser;

  constructor(@Inject('GEYSER_PACKAGE') private client: ClientGrpc) {}

  onModuleDestroy() {
    throw new Error('Method not implemented.');
  }

  onModuleInit() {
    this.geyserService = this.client.getService<Geyser>('Geyser');
    this.handleTransactions();
  }

  handleTransactions() {
    return this.geyserService.subscribeTransactionUpdates({}).subscribe({
      next: (tx: any) => {
        console.log('some tx', tx);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
