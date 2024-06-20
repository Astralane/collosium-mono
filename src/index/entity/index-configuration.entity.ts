import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('index_configuration')
export class IndexConfiguration {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  table_name: string;

  @Column({ type: 'uuid' })
  index_id: string;

  @Column({ type: 'jsonb' })
  json_config: any;

  @Column({ type: 'text', nullable: true })
  last_updated_slot: string;

  @Column({ type: 'text' })
  api_key: string;
}