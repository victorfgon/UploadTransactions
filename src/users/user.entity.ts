import {
  BaseEntity,
  Entity,
  Unique,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEmail, Length } from 'class-validator';

@Entity()
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  @Length(1, 255)
  name: string;

  @Column()
  @Length(1, 50)
  role: string;

  @Column()
  status: boolean;

  @Column()
  @Length(6, 255)
  password: string;

  @Column()
  salt: string;

  @Column({ nullable: true, type: 'varchar', length: 64 })
  confirmationToken?: string;

  @Column({ nullable: true, type: 'varchar', length: 64 })
  recoverToken?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
