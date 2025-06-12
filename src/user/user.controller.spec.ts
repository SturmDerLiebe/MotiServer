import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserController', () => {
    let controller: UserController;
    let service: UserService;

    const mockUser = {
        name: 'Alice',
        email: 'alice@mail.com',
        password: 'secret',
    };

    const mockService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [{ provide: UserService, useValue: mockService }],
        }).compile();

        controller = module.get<UserController>(UserController);
        service = module.get<UserService>(UserService);

        jest.clearAllMocks();
    });

    describe('create()', () => {
        it('should create and return a user ID', () => {
            mockService.create.mockReturnValue(1);
            const dto: CreateUserDto = mockUser;
            const result = controller.create(dto);
            expect(result).toBe(1);
            expect(mockService.create).toHaveBeenCalledWith(dto);
        });

        it('should handle create failure (mocked error)', () => {
            mockService.create.mockImplementation(() => {
                throw new Error('Create failed');
            });
            expect(() => controller.create(mockUser)).toThrow('Create failed');
        });
    });

    describe('findAll()', () => {
        it('should return all users', () => {
            mockService.findAll.mockReturnValue([mockUser]);
            const result = controller.findAll();
            expect(result).toEqual([mockUser]);
        });

        it('should return an empty array when no users exist', () => {
            mockService.findAll.mockReturnValue([]);
            const result = controller.findAll();
            expect(result).toEqual([]);
        });
    });

    describe('findOne()', () => {
        it('should return a user by ID', () => {
            mockService.findOne.mockReturnValue(mockUser);
            const result = controller.findOne(1);
            expect(result).toEqual(mockUser);
        });

        it('should return "user not found" if user doesn’t exist', () => {
            mockService.findOne.mockReturnValue(undefined);
            const result = controller.findOne(999);
            expect(result).toBe('user not found');
        });
    });

    describe('update()', () => {
        it('should return success message when update is successful', () => {
            mockService.update.mockReturnValue(true);
            const dto: UpdateUserDto = { name: 'Updated' };
            const result = controller.update(1, dto);
            expect(result).toBe('user updated');
        });

        it('should return failure message when update fails', () => {
            mockService.update.mockReturnValue(false);
            const result = controller.update(999, { name: 'Nope' });
            expect(result).toBe('user not updated');
        });
    });

    describe('remove()', () => {
        it('should return success message when user is deleted', () => {
            mockService.remove.mockReturnValue(true);
            const result = controller.remove(1);
            expect(result).toBe('user deleted');
        });

        it('should return failure message when user is not found', () => {
            mockService.remove.mockReturnValue(false);
            const result = controller.remove(999);
            expect(result).toBe('user could not be deleted');
        });
    });
});
