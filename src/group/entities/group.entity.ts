import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { GroupMember } from '../../group-member/entities/group-member.entity';
import { Message } from '../../message/entities/message.entity';
import { GroupChallenge } from '../../group-challenge/entities/group-challenge.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Group {
    @PrimaryGeneratedColumn()
    group_id: number;

    @Column({ length: 100 })
    group_name: string;

    @Column({ length: 20 })
    invite_code: string;

    @Column('timestamp')
    created_at: Date;

    @Column()
    owner: number;

    @Column({ length: 50 })
    timezone: string;

    @OneToMany(() => GroupMember, (groupMember) => groupMember.group)
    members: GroupMember[];

    @OneToMany(() => Message, (message) => message.group)
    messages: Message[];

    @OneToMany(() => GroupChallenge, (groupChallenge) => groupChallenge.group)
    challenges: GroupChallenge[];

    @ManyToOne(() => User, (user) => user.ownedGroups)
    @JoinColumn({ name: 'owner' })
    ownerUser: User;
}
