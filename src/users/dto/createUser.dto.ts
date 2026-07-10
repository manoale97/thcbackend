import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, MaxLength, IsOptional, IsBoolean, IsObject, IsNumber } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ example: 'johndoe' })
    @IsString()
    @MinLength(3)
    @MaxLength(20)
    username!: string;

    @ApiProperty({ example: 'john@example.com' })
    @IsEmail()
    email!: string;

    @ApiProperty({ example: 'SecurePass123!' })
    @IsString()
    @MinLength(8)
    password!: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    firstName?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    lastName?: string;

    @ApiProperty({ required: false })
    @IsNumber()
    status!: number;

    @ApiProperty({ example: 'client' })
    @IsString()
    role!: string;
}
