import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { PasskeyEntity } from './passkey.entity';
import { Challenge } from './challenge.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: bigint;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @OneToMany(() => PasskeyEntity, (passkey) => passkey.user, {
        cascade: true,
    })
    passkeys: PasskeyEntity[];

    @OneToMany(() => Challenge, (challenge) => challenge.user, {
        cascade: true,
    })
    challenges: Challenge[];
}
