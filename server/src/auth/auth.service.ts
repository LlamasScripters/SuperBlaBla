import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async register(registerDto: RegisterDto) {
    try {
      console.log('Tentative d\'inscription avec:', { email: registerDto.email, name: registerDto.name });
      
      const { data, error } = await this.supabaseService
        .getClient()
        .auth.signUp({
          email: registerDto.email,
          password: registerDto.password,
          options: {
            data: {
              name: registerDto.name || '',
            },
          },
        });

      console.log('Résultat inscription:', { 
        success: !error, 
        userId: data?.user?.id,
        error: error ? error.message : null 
      });

      if (error) {
        throw new BadRequestException(error.message);
      }

      return {
        message: 'Inscription réussie. Veuillez vérifier votre email pour confirmer votre compte.',
        user: data.user,
      };
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      throw new BadRequestException(
        error.message || 'Une erreur est survenue lors de l\'inscription',
      );
    }
  }

  async login(loginDto: LoginDto) {
    try {
      console.log('Tentative de connexion avec:', { email: loginDto.email });
      
      const { data, error } = await this.supabaseService
        .getClient()
        .auth.signInWithPassword({
          email: loginDto.email,
          password: loginDto.password,
        });

      console.log('Résultat connexion:', { 
        success: !error, 
        userId: data?.user?.id,
        error: error ? error.message : null 
      });

      if (error) {
        throw new BadRequestException(error.message);
      } 

      return {
        message: 'Connexion réussie',
        user: data.user,
      };
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw new BadRequestException(
        error.message || 'Une erreur est survenue lors de la connexion',
      );
    }
  }
}