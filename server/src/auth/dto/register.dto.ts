import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'Email de l\'utilisateur',
    example: 'ariaaman@outlook.fr',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Mot de passe de l\'utilisateur',
    example: 'azertyuiop',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Nom de l\'utilisateur (optionnel)',
    example: 'Aria AMAN',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;
}