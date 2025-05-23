import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToOne,
    OneToMany,
    Unique,
    Index,
} from 'typeorm';
import { Authentication } from '../../google-oauth/entities/authentication.entity';
import { Message } from '../../message/entities/message.entity';
import { GroupMember } from '../../group-member/entities/group-member.entity';
import { MessageReaction } from '../../message-reaction/entities/message-reaction.entity';
import { UserWeeklyTarget } from '../../user-weekly-target/entities/user-weekly-target.entity';
import { Group } from '../../group/entities/group.entity';
import { PasskeyEntity } from '../../auth/entities/passkey.entity';
import { Challenge } from '../../auth/entities/challenge.entity';

@Entity()
@Unique(['email'])
@Index(['user_id'])
export class User {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    user_id: string;

    @Column({ length: 255 })
    name: string;

    @Column({ length: 255 })
    email: string;

    @Column()
    account_status: boolean;

    @Column({ length: 255, nullable: false })
    password: string;

    @Column({ length: 255 })
    profile_picture: string;

    @OneToOne(() => Authentication, (authentication) => authentication.user)
    authentication: Authentication;

    @OneToMany(() => Message, (message) => message.sender)
    messages: Message[];

    @OneToMany(() => GroupMember, (groupMember) => groupMember.user)
    groupMemberships: GroupMember[];

    @OneToMany(() => MessageReaction, (messageReaction) => messageReaction.user)
    messageReactions: MessageReaction[];

    @OneToMany(
        () => UserWeeklyTarget,
        (userWeeklyTarget) => userWeeklyTarget.user,
    )
    weeklyTargets: UserWeeklyTarget[];

    @OneToMany(() => Group, (group) => group.ownerUser)
    ownedGroups: Group[];

    @OneToMany(() => PasskeyEntity, (passkey) => passkey.user, {
        cascade: true,
    })
    passkeys: PasskeyEntity[];

    @OneToMany(() => Challenge, (challenge) => challenge.user, {
        cascade: true,
    })
    challenges: Challenge[];
}
