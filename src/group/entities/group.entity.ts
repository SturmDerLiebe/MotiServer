import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

// TODO: #78 Add Group Entity
@Entity('groups')
export class Group {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    groupName: string;

    // TODO: #97 Temporary column for member IDs (to be replaced by ManyToMany relationship)
    @Column('simple-array', { nullable: true })
    memberIds: string[]; // TODO: Replace with ManyToMany relationship with User entity

    // TODO: #97  Temporary column for creator ID (to be replaced by ManyToOne relationship)
    @Column({ nullable: true })
    createdById: string;

    @Column({ nullable: true })
    inviteCode: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
