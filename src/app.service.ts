import {
  Inject,
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { deserializeTransactions } from "jito-ts/dist/sdk/block-engine/utils";
import { PacketBatch } from "jito-ts/dist/gen/block-engine/packet";

interface Geyser {
  subscribeTransactionUpdates(request: any): Observable<any>;
}

interface Relayer {
  subscribeClientPackets(request: any): Observable<any>;
}

@Injectable()
export class AppService implements OnModuleInit, OnModuleDestroy {
  private geyserService: Geyser;
  private relayerService: Relayer;

  constructor(@Inject('GEYSER_PACKAGE') private geyserClient: ClientGrpc, @Inject('RELAYER_PACKAGE') private relayerClient: ClientGrpc) {}

  onModuleDestroy() {
    throw new Error('Method not implemented.');
  }

  onModuleInit() {
    this.geyserService = this.geyserClient.getService<Geyser>('Geyser');
    this.relayerService = this.relayerClient.getService<Relayer>('Relayer');
    this.handleTransactions();
  }

  handleTransactions() {
    this.geyserService.subscribeTransactionUpdates({}).subscribe({
      next: (tx: any) => {
        console.log('processed tx', tx);
      },
      error: (err) => {
        console.log(err);
      },
    });

    this.relayerService.subscribeClientPackets({}).subscribe({
      next: (tx: any) => {
        console.log('some tx', tx);
        if (tx.batch != null) {
          const batch = tx.batch as PacketBatch;
          const txs = deserializeTransactions(batch.packets);
          console.log('unprocessed tx', txs);
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
