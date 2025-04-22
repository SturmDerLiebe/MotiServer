import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Authentication{
  	@PrimatyGeneratedColumn()
  	auth_id: number;
  
  	@Column()
  	user_id: number;
  
  	@Column({ length: 100, nullable: true })
  	google_id: string;
  
  	@Column({ length: 50 })
  	source: string;
  
  	@OneToOne(() => User, user => user.authentication)
  	@JoinColumn({ name: 'user_id' })
  	user: User;
}