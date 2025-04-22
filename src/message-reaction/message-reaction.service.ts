import { Injectable } from '@nestjs/common';
import { CreateMessageReactionDto } from './dto/create-message-reaction.dto';
import { UpdateMessageReactionDto } from './dto/update-message-reaction.dto';

@Injectable()
export class MessageReactionService {
  create(createMessageReactionDto: CreateMessageReactionDto) {
    return 'This action adds a new messageReaction';
  }

  findAll() {
    return `This action returns all messageReaction`;
  }

  findOne(id: number) {
    return `This action returns a #${id} messageReaction`;
  }

  update(id: number, updateMessageReactionDto: UpdateMessageReactionDto) {
    return `This action updates a #${id} messageReaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} messageReaction`;
  }
}
