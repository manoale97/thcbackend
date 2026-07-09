import { IsString, MinLength, MaxLength, IsNotEmpty} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChannelDto {
    @ApiProperty({ example: 'telegram' })
    @IsString()
    @IsNotEmpty()
    code!: string;

    @ApiProperty({ example: 'Telegram' })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({ example: true })
    @IsString()
    @IsNotEmpty()
    isActive!: boolean;
}