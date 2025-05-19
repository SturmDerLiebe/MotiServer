import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    Unique,
    Check,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { GroupChallenge } from '../../group-challenge/entities/group-challenge.entity';

@Entity()
@Unique(['user_id', 'group_challenge_id'])
@Check('"target_count" >= 0')
@Check('"achieved_count" >= 0')
@Check('"achieved_count" <= "target_count"')
export class UserWeeklyTarget {
    @PrimaryGeneratedColumn()
    target_id: number;

    @Column({ nullable: false })
    user_id: number;

    @Column({ nullable: false })
    group_challenge_id: number;

    @Column({ nullable: false })
    target_count: number;

    @Column({ nullable: false })
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
