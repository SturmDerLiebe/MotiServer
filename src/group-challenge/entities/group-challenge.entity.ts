import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Check,
} from 'typeorm';
import { Group } from '../../group/entities/group.entity';
import { UserWeeklyTarget } from '../../user-weekly-target/entities/user-weekly-target.entity';

@Entity()
@Check('"end_date" >= "start_date"')
export class GroupChallenge {
    @PrimaryGeneratedColumn()
    challenge_id: number;

    @Column({ nullable: false })
    group_id: number;

    @Column({ length: 1000 })
    description: string;

    @Column('date', { nullable: false })
    start_date: Date;

    @Column('date', { nullable: false })
    end_date: Date;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => Group, (group) => group.challenges)
    @JoinColumn({ name: 'group_id' })
    group: Group;

    @OneToMany(
        () => UserWeeklyTarget,
        (userWeeklyTarget) => userWeeklyTarget.groupChallenge,
    )
    userTargets: UserWeeklyTarget[];
}
