import { IsNotEmpty, IsString, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGroupDto {
    @ApiProperty({
        description: 'The name of the group',
        example: 'Fitness Enthusiasts',
        maxLength: 100,
        type: String,
    })
    @IsNotEmpty()
    @IsString()
    groupName: string;

    @ApiProperty({
        description: 'The ids of the members to be added to the group',
        example: ['user123', 'user456'],
        type: [String],
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    memberIds?: string[];
}
