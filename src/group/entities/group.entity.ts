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

    @Column('simple-array', { nullable: true })
    memberIds: string[];

    @Column({ nullable: true })
    createdById: string;

    @Column({ nullable: true })
    inviteCode: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
