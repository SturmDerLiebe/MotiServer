import { Injectable } from '@nestjs/common';
import { User } from './interfaces/user.interface';

@Injectable()
export class UsersService {
    private users: Map<number, User> = new Map();

    create(user: User) {
        // TODO: #26 - add user to database if it does not exist yet
        this.users.set(user.id, user);
    }
    findAll() {
        // TODO: #26 - get all users from DB
        return this.users;
    }
    findOne(userID: number): any { //returns User or undefined
        // TODO: #26 - get user info from DB
        return this.users.get(userID);
    }
    update(userID: number, user: User): boolean {
        // TODO: #26 - update user in DB
        return true;
    }
    remove(userID: number): boolean {
        // TODO: #26 - delete user from DB
        return this.users.delete(userID);
    }
}
