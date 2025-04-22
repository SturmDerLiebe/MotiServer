import { Module } from '@nestjs/common';
import { MessageReactionService } from './message-reaction.service';
import { MessageReactionController } from './message-reaction.controller';

@Module({
    controllers: [MessageReactionController],
    providers: [MessageReactionService],
})
export class MessageReactionModule {}
