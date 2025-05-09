import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Message } from '../../message/entities/message.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class MessageReaction {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    reaction_id: string;

    @Column()
    message_id: number;

    @Column()
    user_id: number;

    @Column({ length: 50 })
    reaction_type: string;

    @ManyToOne(() => Message, (message) => message.reactions)
    @JoinColumn({ name: 'message_id' })
    message: Message;

    @ManyToOne(() => User, (user) => user.messageReactions)
    @JoinColumn({ name: 'user_id' })
    user: User;
}
