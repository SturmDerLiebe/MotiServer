import { IsNotEmpty, IsString, IsOptional, IsArray } from 'class-validator';

export class CreateGroupDto {
    @IsNotEmpty()
    @IsString()
    groupName: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    memberIds?: string[];

    @IsOptional()
    @IsString()
    createdById?: string;

    @IsOptional()
    @IsString()
    inviteCode?: string;
}
