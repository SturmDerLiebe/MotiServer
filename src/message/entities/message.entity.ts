import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn,
    CreateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Group } from '../../group/entities/group.entity';
import { MessageReaction } from '../../message-reaction/entities/message-reaction.entity';


@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    message_id: number;

    @Column()
    sender_id: number;

    @Column()
    group_id: number;

    @Column({ length: 50 })
    message_type: string;

    @Column({ length: 2000 })
    content: string;

    @CreateDateColumn()
    sent_at: Date;

    @ManyToOne(() => User, (user) => user.messages)
    @JoinColumn({ name: "sender_id" })
    sender: User;

    @ManyToOne(() => Group, (group) => group.messages)
    @JoinColumn({ name: "group_id" })
    group: Group;

    @OneToMany(() => MessageReaction, (reaction) => reaction.message)
    reactions: MessageReaction[];
}
