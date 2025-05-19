import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    Unique,
    Check,
} from 'typeorm';
import { Message } from '../../message/entities/message.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
@Unique(['message_id', 'user_id', 'reaction_type'])
@Check(`length(reaction_type) <= 50`)
export class MessageReaction {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    reaction_id: string;

    @Column({ nullable: false })
    message_id: number;

    @Column({ nullable: false })
    user_id: number;

    @Column({ length: 50, nullable: false })
    reaction_type: string;

    @ManyToOne(() => Message, (message) => message.reactions)
    @JoinColumn({ name: 'message_id' })
    message: Message;

    @ManyToOne(() => User, (user) => user.messageReactions)
    @JoinColumn({ name: 'user_id' })
    user: User;
}
