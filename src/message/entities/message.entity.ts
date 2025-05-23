import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn,
    CreateDateColumn,
    Check,
    Index,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Group } from '../../group/entities/group.entity';
import { MessageReaction } from '../../message-reaction/entities/message-reaction.entity';

@Entity()
@Check(`length(message_type) <= 50`)
@Check(`length(content) <= 2000`)
@Index(['message_id'])
export class Message {
    @PrimaryGeneratedColumn()
    message_id: number;

    @Column({ nullable: false })
    @Index()
    sender_id: number;

    @Column({ nullable: false })
    @Index()
    group_id: number;

    @Column({ length: 50, nullable: false })
    message_type: string;

    @Column({ length: 2000 })
    content: string;

    @CreateDateColumn()
    sent_at: Date;

    @ManyToOne(() => User, (user) => user.messages)
    @JoinColumn({ name: 'sender_id' })
    sender: User;

    @ManyToOne(() => Group, (group) => group.messages)
    @JoinColumn({ name: 'group_id' })
    group: Group;

    @OneToMany(() => MessageReaction, (reaction) => reaction.message)
    reactions: MessageReaction[];
}
