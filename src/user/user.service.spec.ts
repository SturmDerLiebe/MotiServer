import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';

describe('UsersService', () => {
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
        it('should create a user and return an ID', () => {
            const id = service.create({
                name: 'John',
                email: 'john@example.com',
                password: '123456',
            });
            expect(id).toBeGreaterThan(0);
        });

        it('should create multiple users with unique IDs', () => {
            const id1 = service.create({
                name: 'Jane',
                email: 'jane@example.com',
                password: 'abcdef',
            });
            const id2 = service.create({
                name: 'Doe',
                email: 'doe@example.com',
                password: 'qwerty',
            });
            expect(id1).not.toEqual(id2);
        });
    });

    describe('findOne()', () => {
        it('should return a user if it exists', () => {
            const id = service.create({
                name: 'Test',
                email: 'test@test.com',
                password: '123',
            });
            const user = service.findOne(id);
            expect(user).toBeDefined();
            expect(user?.name).toBe('Test');
        });

        it('should return undefined if user does not exist', () => {
            const user = service.findOne(999);
            expect(user).toBeUndefined();
        });
    });

    describe('findAll()', () => {
        it('should return all users', () => {
            service.create({
                name: 'User1',
                email: 'u1@mail.com',
                password: 'pass',
            });
            service.create({
                name: 'User2',
                email: 'u2@mail.com',
                password: 'pass',
            });
            const users = service.findAll();
            expect(users.length).toBeGreaterThanOrEqual(2);
        });

        it('should return empty array if no users', () => {
            const emptyService = new UserService();
            expect(emptyService.findAll()).toEqual([]);
        });
    });

    describe('update()', () => {
        it('should update user fields if user exists', () => {
            const id = service.create({
                name: 'Old',
                email: 'old@mail.com',
                password: '123',
            });
            const updated = service.update(id, { name: 'New' });
            const user = service.findOne(id);
            expect(updated).toBe(true);
            expect(user?.name).toBe('New');
        });

        it('should return false if user does not exist', () => {
            const result = service.update(999, { name: 'Ghost' });
            expect(result).toBe(false);
        });
    });

    describe('remove()', () => {
        it('should delete user if exists', () => {
            const id = service.create({
                name: 'ToDelete',
                email: 'del@mail.com',
                password: 'abc',
            });
            const result = service.remove(id);
            expect(result).toBe(true);
            expect(service.findOne(id)).toBeUndefined();
        });

        it('should return false if user does not exist', () => {
            expect(service.remove(999)).toBe(false);
        });
    });

    describe('findByUsername()', () => {
        it('should return user if username exists', () => {
            service.create({
                name: 'Alice',
                email: 'alice@mail.com',
                password: 'pass',
            });
            const user = service.findByUsername('Alice');
            expect(user).toBeDefined();
            expect(user?.email).toBe('alice@mail.com');
        });

        it('should return undefined if username not found', () => {
            expect(service.findByUsername('NotExist')).toBeUndefined();
        });
    });
});
