import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class PasskeyEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'bytea' })
    credentialID: Buffer;

    @Column({ type: 'bytea' })
    publicKey: Buffer;

    @Column('int')
    counter: number;

    @Column()
    webauthnUserID: string;

    @Column()
    deviceType: string;

    @Column()
    backedUp: boolean;

    @Column('simple-array', { nullable: true })
    transports: string[];

    @ManyToOne(() => User, (user) => user.passkeys, { onDelete: 'CASCADE' })
    user: User;
}
