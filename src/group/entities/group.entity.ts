import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('groups')
export class Group {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    groupName: string;

    // Temporary column for member IDs (to be replaced by ManyToMany relationship)
    @Column('simple-array', { nullable: true })
    memberIds: string[]; // TODO: Replace with ManyToMany relationship with User entity

    // Temporary column for creator ID (to be replaced by ManyToOne relationship)
    @Column({ nullable: true })
    createdById: string; // TODO: Replace with ManyToOne relationship with User entity

    @Column({ nullable: true })
    inviteCode: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
