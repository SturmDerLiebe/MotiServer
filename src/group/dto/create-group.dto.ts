import { IsNotEmpty, IsString, IsOptional, IsArray } from 'class-validator';

export class CreateGroupDto {
    @IsNotEmpty()
    @IsString()
    groupName: string;

    @IsOptional()
    @IsArray()
    memberIds?: string[];

    @IsOptional()
    @IsString()
    createdById?: string;

    @IsOptional()
    @IsString()
    inviteCode?: string;
}
