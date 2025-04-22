import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserWeeklyTargetService } from './user-weekly-target.service';
import { CreateUserWeeklyTargetDto } from './dto/create-user-weekly-target.dto';
import { UpdateUserWeeklyTargetDto } from './dto/update-user-weekly-target.dto';

@Controller('user-weekly-target')
export class UserWeeklyTargetController {
  constructor(private readonly userWeeklyTargetService: UserWeeklyTargetService) {}

  @Post()
  create(@Body() createUserWeeklyTargetDto: CreateUserWeeklyTargetDto) {
    return this.userWeeklyTargetService.create(createUserWeeklyTargetDto);
  }

  @Get()
  findAll() {
    return this.userWeeklyTargetService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userWeeklyTargetService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserWeeklyTargetDto: UpdateUserWeeklyTargetDto) {
    return this.userWeeklyTargetService.update(+id, updateUserWeeklyTargetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userWeeklyTargetService.remove(+id);
  }
}
