import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Post('new')
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }
    @Get()
    // TODO: implement authorization and admin guard
    findAll() {
        return this.usersService.findAll();
    }
    @Get(':id')
    // TODO: implement authorization and user guard
    findOne(@Param('id') id: number): any {
        return this.usersService.findOne(id) || 'user not found';
    }
    @Put(':id')
    // TODO: implement authorization and user guard
    update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
        if (this.usersService.update(id, updateUserDto)) {
            return 'user updated';
        } else {
            return 'user not updated';
        }
    }
    @Delete(':id')
    // TODO: implement authorization and user guard
    remove(@Param('id') id: number) {
        return this.usersService.remove(id)
            ? 'user deleted'
            : 'user could not be deleted';
    }
}
