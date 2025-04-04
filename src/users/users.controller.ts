import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Req,
    Param,
    Body,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return 'This action creates a user'; //TODO: create user
    }
    @Get()
    // TODO: implement authorization and admin guard
    findAll(): string {
        return 'Trying to get all users?';
    }
    @Get(':id')
    // TODO: implement authorization and user guard
    findOne(@Param('id') id: string): string {
        return `Return the json for user ${id}`; //TODO: get user data
    }
    @Put(':id')
    // TODO: implement authorization and user guard
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return `This action updates user ${id}`; //TODO: update user
    }
    @Delete(':id')
    // TODO: implement authorization and user guard
    remove(@Param('id') id: string) {
        return `This action removes user ${id}`; //TODO: delete user
    }
}
