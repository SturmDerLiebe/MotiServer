import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './interfaces/user.interface';

describe('UserService', () => {
    let service: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UserService],
        }).compile();

        service = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create()', () => {
        it('should create a user and return user ID', () => {
            const user: User = {
                name: 'Alice',
                email: 'alice@mail.com',
                password: '1234',
            };
            const id: number = service.create(user);
            expect(typeof id).toBe('number');
        });

        it('should create multiple users with unique IDs', () => {
            const user1: User = {
                name: 'User1',
                email: 'u1@mail.com',
                password: '123',
            };
            const user2: User = {
                name: 'User2',
                email: 'u2@mail.com',
                password: '456',
            };
            const id1 = service.create(user1);
            const id2 = service.create(user2);
            expect(id1).not.toBe(id2);
        });
    });

    describe('findAll()', () => {
        it('should return an array of users', () => {
            service.create({ name: 'A', email: 'a@mail.com', password: '123' });
            const users: User[] = service.findAll();
            expect(Array.isArray(users)).toBe(true);
            expect(users.length).toBeGreaterThan(0);
        });
    });

    describe('findOne()', () => {
        it('should return the user by ID', () => {
            const newUser: User = {
                name: 'Bob',
                email: 'bob@mail.com',
                password: 'pass',
            };
            const id = service.create(newUser);
            const user = service.findOne(id);
            expect(user).toBeDefined();
            expect(user?.name).toBe('Bob');
        });

        it('should return undefined for non-existent ID', () => {
            const result = service.findOne(9999);
            expect(result).toBeUndefined();
        });
    });

    describe('findByUsername()', () => {
        it('should find a user by name', () => {
            const user: User = {
                name: 'Alice',
                email: 'alice@mail.com',
                password: '1234',
            };
            service.create(user);
            const result = service.findByUsername('Alice');
            expect(result).toBeDefined();
            expect(result?.email).toBe('alice@mail.com');
        });

        it('should return undefined if username not found', () => {
            const result = service.findByUsername('NotExist');
            expect(result).toBeUndefined();
        });
    });

    describe('update()', () => {
        it("should update a user's data", () => {
            const user: User = {
                name: 'Old',
                email: 'old@mail.com',
                password: '123',
            };
            const id = service.create(user);

            const updated = service.update(id, {
                name: 'New',
                email: 'new@mail.com',
                password: '456',
            });

            expect(updated).toBe(true);

            const result = service.findOne(id);
            expect(result?.name).toBe('New');
            expect(result?.email).toBe('new@mail.com');
        });

        it('should return false when updating non-existent user', () => {
            const result = service.update(999, {
                name: 'Ghost',
            });
            expect(result).toBe(false);
        });
    });

    describe('remove()', () => {
        it('should delete a user', () => {
            const user: User = {
                name: 'Temp',
                email: 'temp@mail.com',
                password: 'temp',
            };
            const id = service.create(user);

            const deleted = service.remove(id);
            expect(deleted).toBe(true);
            expect(service.findOne(id)).toBeUndefined();
        });

        it('should return false for non-existent user', () => {
            const deleted = service.remove(12345);
            expect(deleted).toBe(false);
        });
    });
});
