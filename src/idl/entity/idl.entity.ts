import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('program_idl')
export class Idl {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  program_pubkey: string;

  @Column({ type: 'jsonb' })
  idl: any;
}
