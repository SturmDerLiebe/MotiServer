import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	JoinColumn,
	CreateDateColumn,
} from 'typeorm';
import { User } from '../../user//entities/user.entity';
import { Group } from '../../group/entities/group.entity';

@Entity()
export class GroupMember {
  	@PrimaryGeneratedColumn()
  	member_id: number;
  
  	@Column()
  	group_id: number;
  
  	@Column()
  	user_id: number;
  
  	@CreateDateColumn()
  	joined_at: Date;
  
  	@ManyToOne(() => User, user => user.groupMemberships)
  	@JoinColumn({ name: 'user_id' })
  	user: User;
  
  	@ManyToOne(() => Group, group => group.members)
  	@JoinColumn({ name: 'group_id' })
  	group: Group;
}