import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { GroupChallenge } from '../../group-challenge/entities/group-challenge.entity';

@Entity()
export class UserWeeklyTarget {
    @PrimaryGeneratedColumn()
    target_id: number;

    @Column()
    user_id: number;

    @Column()
    group_challenge_id: number;

    @Column()
    target_count: number;

    @Column()
    achieved_count: number;

    @Column({ length: 255 })
    current_progress: string;

    @CreateDateColumn()
    created_at: Date;

    @ManyToOne(() => User, (user) => user.weeklyTargets)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(
        () => GroupChallenge,
        (groupChallenge) => groupChallenge.userTargets,
    )
    @JoinColumn({ name: 'group_challenge_id' })
    groupChallenge: GroupChallenge;
}
