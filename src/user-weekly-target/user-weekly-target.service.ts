import { Injectable } from '@nestjs/common';
import { CreateUserWeeklyTargetDto } from './dto/create-user-weekly-target.dto';
import { UpdateUserWeeklyTargetDto } from './dto/update-user-weekly-target.dto';

@Injectable()
export class UserWeeklyTargetService {
  create(createUserWeeklyTargetDto: CreateUserWeeklyTargetDto) {
    return 'This action adds a new userWeeklyTarget';
  }

  findAll() {
    return `This action returns all userWeeklyTarget`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userWeeklyTarget`;
  }

  update(id: number, updateUserWeeklyTargetDto: UpdateUserWeeklyTargetDto) {
    return `This action updates a #${id} userWeeklyTarget`;
  }

  remove(id: number) {
    return `This action removes a #${id} userWeeklyTarget`;
  }
}
