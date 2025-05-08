import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
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
}