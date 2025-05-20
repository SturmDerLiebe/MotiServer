import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    Unique,
    Index,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Group } from '../../group/entities/group.entity';

@Entity()
@Unique(['group_id', 'user_id'])
@Index(['group_id'])
@Index(['user_id'])
export class GroupMember {
    @PrimaryGeneratedColumn()
    member_id: number;

    @Column({ nullable: false })
    group_id: number;

    @Column({ nullable: false })
    user_id: number;

    @CreateDateColumn()
    joined_at: Date;

    @ManyToOne(() => User, (user) => user.groupMemberships)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Group, (group) => group.members)
    @JoinColumn({ name: 'group_id' })
    group: Group;
}
