// Modifier server/src/user/users.module.ts
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller'; 
import { UsersService } from './users.service';
import { SupabaseService } from '../auth/supabase.service';

@Module({
  controllers: [UsersController], 
  providers: [UsersService, SupabaseService],
  exports: [UsersService],
})
export class UsersModule {}