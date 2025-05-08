// server/src/users/dto/update-profile.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({
    description: 'Couleur personnalisée de l\'utilisateur',
    example: '#FF5733',
  })
  @IsString()
  @IsNotEmpty()
  color: string;
}