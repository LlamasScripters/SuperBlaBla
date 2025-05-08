// server/src/users/users.controller.ts
import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('Profil utilisateur')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Mettre à jour le profil utilisateur' })
  @ApiResponse({ status: 200, description: 'Profil mis à jour avec succès.' })
  @ApiResponse({ status: 400, description: 'Données invalides.' })
  @Put(':userId/profile')
  updateProfile(
    @Param('userId') userId: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(userId, updateProfileDto);
  }

  @ApiOperation({ summary: 'Récupérer le profil utilisateur' })
  @ApiResponse({ status: 200, description: 'Profil récupéré avec succès.' })
  @ApiResponse({ status: 400, description: 'Utilisateur non trouvé.' })
  @Get(':userId/profile')
  getProfile(@Param('userId') userId: string) {
    return this.usersService.getProfile(userId);
  }
}