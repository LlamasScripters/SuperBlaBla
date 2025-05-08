// /src/users/users.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../auth/supabase.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    try {
      
      const { data: user, error: userError } = await this.supabaseService
        .getClient()
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (userError && !user) {
        
        const { error } = await this.supabaseService
          .getClient()
          .from('profiles')
          .insert([
            {
              id: userId,
              color: updateProfileDto.color,
            },
          ]);

        if (error) throw new BadRequestException(error.message);
      } else {
        
        const { error } = await this.supabaseService
          .getClient()
          .from('profiles')
          .update({ color: updateProfileDto.color })
          .eq('id', userId);

        if (error) throw new BadRequestException(error.message);
      }

      return {
        message: 'Profil mis à jour avec succès',
        color: updateProfileDto.color,
      };
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Une erreur est survenue lors de la mise à jour du profil',
      );
    }
  }

  async getProfile(userId: string) {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw new BadRequestException(error.message);

      return data;
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Une erreur est survenue lors de la récupération du profil',
      );
    }
  }
}