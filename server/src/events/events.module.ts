import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { SupabaseService } from '../auth/supabase.service';

@Module({
    providers: [EventsGateway, SupabaseService],
})

export class EventsModule {}