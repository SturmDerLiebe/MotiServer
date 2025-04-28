import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Req,
    Body,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

//TODO: #34 - Overhaul Controller methods according to use cases
@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Post('new')
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }
    @Get()
    // TODO: implement authorization and admin guard
    findAll() {
        return this.userService.findAll();
    }
    @Get()
    // TODO: implement authorization and user guard
    // TODO: return all relevant data for one user
    // user:
    // - name
    // - email
    // - NOT password
    // - profile picture
    // groups:
    // - group names?
    // challenge:
    // - target count
    // - achieved count
    // - current progress
    // - created at
    // group challenge:
    // - description
    // - start date
    // - end date
    // - created at
    // - updated at
    findOne(@Req() id: number): any {
        const user = this.userService.findOne(id);
        if (!user) {
            return 'user not found';
        }
        return {
            // TODO: return data on a users groups
            user: {
                name: user.name,
                email: user.email,
                groups: 'This would be a list of the group names if we support\
                many, or the name of the single group one user is part of',
            },
            //TODO: return actual data to user challenge
            user_challenge: {
                target_count: 'return target count',
                achieved_count: 'return achieved count',
                current_progress: 'return current progress',
            },
            //TODO: return data about group challenge
            group_challenge: {
                description: 'return description',
                start_date: 'return start_date',
                end_date: 'return end_date',
                created_at: 'return created_at',
                updated_at: 'return updated_at',
            },
        };
    }
    @Put(':id')
    // TODO: implement authorization and user guard
    update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
        if (this.userService.update(id, updateUserDto)) {
            return 'user updated';
        } else {
            return 'user not updated';
        }
    }
    @Delete(':id')
    // TODO: implement authorization and user guard
    remove(@Param('id') id: number) {
        return this.userService.remove(id)
            ? 'user deleted'
            : 'user could not be deleted';
    }
}
