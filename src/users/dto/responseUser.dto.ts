import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength, MaxLength, IsOptional, IsBoolean, IsObject, IsNumber } from 'class-validator';

export class responseUserDto {
        @ApiProperty({ example: 'johndoe' })
        @IsString()
        @MinLength(3)
        @MaxLength(20)
        username!: string;
    
        @ApiProperty({ example: 'john@example.com' })
        @IsEmail()
        email!: string;

        @ApiProperty({ example: 'John' })
        @IsString()
        @IsOptional()
        firstName?: string;
    
        @ApiProperty({ example: 'Doe' })
        @IsString()
        @IsOptional()
        lastName?: string;
}