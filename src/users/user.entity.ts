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
import * as bcrypt from 'bcrypt';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Unique identifier of the user' })
  id: string;

  @Column()
  @IsEmail()
  @ApiProperty({ description: 'Email address of the user' })
  email: string;

  @Column()
  @Length(1, 255)
  @ApiProperty({ description: 'Name of the user' })
  name: string;

  @Column()
  @Length(1, 50)
  @ApiProperty({ description: 'Role of the user' })
  role: string;

  @Column({ nullable: false, default: true })
  @ApiProperty({ description: 'Status of the user' })
  status: boolean;

  @Column()
  @Length(6, 255)
  @ApiProperty({ description: 'Password of the user' })
  password: string;

  @Column({ nullable: false })
  salt: string;

  @Column({ nullable: true, type: 'varchar', length: 64 })
  @ApiProperty({ description: 'Confirmation token of the user' })
  confirmationToken?: string;

  @Column({ nullable: true, type: 'varchar', length: 64 })
  @ApiProperty({ description: 'Recovery token of the user' })
  recoverToken?: string;

  @CreateDateColumn()
  @ApiProperty({ description: 'Date of creation' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'Date of last update' })
  updatedAt: Date;

  async checkPassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
