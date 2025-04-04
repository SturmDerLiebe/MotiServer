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
	constructor (private usersService: UsersService) {}

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
		return this.usersService.create(createUserDto);
    }
    @Get()
    // TODO: implement authorization and admin guard
    findAll(): Map<number, CreateUserDto> {
		return this.usersService.findAll();
    }
    @Get(':id')
    // TODO: implement authorization and user guard
    findOne(@Param('id') id: number): Map<number, CreateUserDto> {
		return this.usersService.findOne(id) || "user not found";
    }
    @Put(':id')
    // TODO: implement authorization and user guard
    update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
		return this.usersService.update(id, updateUserDto);
    }
    @Delete(':id')
    // TODO: implement authorization and user guard
    remove(@Param('id') id: number) {
		return this.usersService.remove(id);
	}
}
