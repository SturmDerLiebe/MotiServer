import { Controller, Get, Req } from '@nestjs/common';

@Controller('users')
export class UsersController {
    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return 'This action creates a user'; //TODO: create user
    }
    @Get()
    findAll(): string {
        return 'Trying to get all users?';
    }
    @Get(':id')
    findOne(@Param('id') id: string): string {
        return `Return the json for user ${id}`; //TODO: get user data
    }
    @Put(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return `This action updates user ${id}`; //TODO: update user
    }
    @Delete(':id')
    remove(@Param('id') id: string) {
        return `This action removes user ${id}`; //TODO: delete user
    }
}
