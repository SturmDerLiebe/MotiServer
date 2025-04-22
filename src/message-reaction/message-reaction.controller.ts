import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MessageReactionService } from './message-reaction.service';
import { CreateMessageReactionDto } from './dto/create-message-reaction.dto';
import { UpdateMessageReactionDto } from './dto/update-message-reaction.dto';

@Controller('message-reaction')
export class MessageReactionController {
  constructor(private readonly messageReactionService: MessageReactionService) {}

  @Post()
  create(@Body() createMessageReactionDto: CreateMessageReactionDto) {
    return this.messageReactionService.create(createMessageReactionDto);
  }

  @Get()
  findAll() {
    return this.messageReactionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messageReactionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageReactionDto: UpdateMessageReactionDto) {
    return this.messageReactionService.update(+id, updateMessageReactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageReactionService.remove(+id);
  }
}
