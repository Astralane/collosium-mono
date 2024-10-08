import { Injectable, Logger } from '@nestjs/common';
import { Connection, PublicKey } from '@solana/web3.js';
import { Repository } from 'typeorm';
import { inflate } from 'zlib';
import { promisify } from 'util';
import { Idl } from './entity/idl.entity';
import { InjectRepository } from '@nestjs/typeorm';

const zlibInflate = promisify(inflate);

const ANCHOR_SEED = 'anchor:idl';
const ANCHOR_ACCOUNT_DISCRIMINATOR_LENGTH = 8;
const RPC_NODE_URL = process.env.RPC_NODE_URL;

@Injectable()
export class IdlService {
  private connection: Connection;
  private readonly logger = new Logger(IdlService.name);

  constructor(
    @InjectRepository(Idl)
    private readonly programIdlRepository: Repository<Idl>,
  ) {
    this.connection = new Connection(RPC_NODE_URL);
  }

  async downloadIdl(programPubkey: string): Promise<string | undefined> {
    try {
      const programPublicKey = new PublicKey(programPubkey);
      const [base] = PublicKey.findProgramAddressSync([], programPublicKey);

      const anchorPubkey = await PublicKey.createWithSeed(
        base,
        ANCHOR_SEED,
        programPublicKey,
      );

      const accountInfo = await this.connection.getAccountInfo(anchorPubkey);
      if (!accountInfo) {
        throw new Error('Failed to get account data from rpc');
      }

      const accountData = accountInfo.data;
      const dataLenStart = ANCHOR_ACCOUNT_DISCRIMINATOR_LENGTH + 32;
      const dataLenEnd = dataLenStart + 4;
      const dataLen = new DataView(
        accountData.buffer.slice(dataLenStart, dataLenEnd),
      ).getUint32(0, true);

      const data = accountData.slice(dataLenEnd, dataLenEnd + dataLen);
      const deflatedIdl = await zlibInflate(data);

      return deflatedIdl.toString();
    } catch (e) {
      this.logger.error(
        `Could not download idl for ${programPubkey} pub key: ${e}`,
      );
      return undefined;
    }
  }

  async storeIdl(programPubkey: string, idlString: string): Promise<void> {
    const idlJson = JSON.parse(idlString);
    const idl = {
      program_pubkey: programPubkey,
      idl: idlJson,
    };

    await this.programIdlRepository
      .createQueryBuilder()
      .insert()
      .into(Idl)
      .values(idl)
      .orUpdate(['idl'], ['program_pubkey'])
      .execute();
  }

  async idlExists(programPubkey: string): Promise<boolean> {
    const idl = await this.programIdlRepository.findOneBy({
      program_pubkey: programPubkey,
    });

    if (!idl) {
      return false;
    }

    return true;
  }
}
