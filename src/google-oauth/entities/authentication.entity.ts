import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    Unique,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
@Unique(['user_id', 'google_id'])
export class Authentication {
    @PrimaryGeneratedColumn()
    auth_id: number;

    @Column()
    user_id: number;

    @Column({ length: 100, nullable: true })
    google_id: string;

    @Column({ length: 50 })
    source: string;

    @OneToOne(() => User, (user) => user.authentication)
    @JoinColumn({ name: 'user_id' })
    user: User;
}
