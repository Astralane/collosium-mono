import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('key')
export class Key {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  key: string;

  @Column({ type: 'text' })
  rpsLimit: number;
}
