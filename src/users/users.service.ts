import { Injectable } from '@nestjs/common';
import { User } from './interfaces/user.interface';

@Injectable()
export class UsersService {
    private users: Map<number, User> = new Map();
    private userIDcounter: number = 0;

    create(user: User): number {
        // TODO: #26 - add user to database if it does not exist yet
        this.userIDcounter += 1;
        this.users.set(this.userIDcounter, user);
        return this.userIDcounter;
    }
    findAll() {
        // TODO: #26 - get all users from DB
        return Array.from(this.users.values());
    }
    findOne(userID: number): User | undefined {
        //returns User or undefined
        // TODO: #26 - get user info from

        // the + ensures that the type is number, which on testing with postman
        // was not the case despite the type being number in the function def
        // parseInt will not work because the defined type is already "number"
        return this.users.get(+userID);
    }
    update(userID: number, user: User): boolean {
        // TODO: #26 - update user in DB
        if (this.users.has(+userID)) {
            this.users.set(+userID, user);
            return true;
        } else {
            return this.users.has(+userID);
        }
    }
    remove(userID: number): boolean {
        // TODO: #26 - delete user from DB
        return this.users.delete(+userID);
    }
}
