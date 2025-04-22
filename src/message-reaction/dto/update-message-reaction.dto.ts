import { PartialType } from '@nestjs/mapped-types';
import { CreateMessageReactionDto } from './create-message-reaction.dto';

export class UpdateMessageReactionDto extends PartialType(CreateMessageReactionDto) {}
