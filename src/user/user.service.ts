import { Injectable } from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { UpdateUserDto } from './dto/update-user.dto';

//TODO: #26 - Overhaul Service methods according to use cases
@Injectable()
export class UserService {
    //TODO: #26 - remove users and userIDcounter when implementing UserService properly
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
    findByUsername(username: string): User | undefined {
        return Array.from(this.users.values()).find(
            (user) => user.name === username,
        );
    }
    update(userID: number, user: UpdateUserDto): boolean {
        // TODO: #26 - update user in DB
        if (this.users.has(+userID)) {
            const old_user = this.users.get(+userID)!;
            const new_user: User = {
                name: user.name || old_user.name,
                email: user.email || old_user.email,
                password: user.password || old_user.password,
            };
            this.users.set(+userID, new_user);
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
