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
    @Get(':id')
    // TODO: implement authorization and user guard
    findOne(@Param('id') id: number): any {
        return this.userService.findOne(id) || 'user not found';
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
