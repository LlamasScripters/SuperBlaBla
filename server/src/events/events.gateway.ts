// server/src/events/events.gateway.ts
import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SupabaseService } from '../auth/supabase.service';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class EventsGateway implements OnGatewayInit {
    constructor(
        private readonly supabaseService: SupabaseService
    ) {}

    afterInit() {
        console.log('WebSocket Gateway initialisé');
    }

    @WebSocketServer()
    server: Server;

    @SubscribeMessage('message')
    async handleMessage(
        client: Socket,
        payload: { sender: string; text: string; userId: string },
    ): Promise<void> {
        try {
            
            const { data } = await this.supabaseService
                .getClient()
                .from('profiles')
                .select('color')
                .eq('id', payload.userId)
                .single();

            const color = data?.color || '#000000'; 

            console.log(`Message from ${payload.sender}: ${payload.text}`);
            
           
            this.server.emit('message', {
                sender: payload.sender,
                text: payload.text,
                color: color,
                timestamp: new Date(),
            });
        } catch (error) {
            console.error('Erreur lors de la récupération de la couleur:', error);
            
            this.server.emit('message', {
                sender: payload.sender,
                text: payload.text,
                color: '#000000',
                timestamp: new Date(),
            });
        }
    }

    @SubscribeMessage('changeColor')
    async handleChangeColor(client: Socket, payload: { userId: string, color: string }) {
        try {
            // Mettre à jour la couleur dans Supabase
            const { error } = await this.supabaseService
                .getClient()
                .from('profiles')
                .upsert({ 
                    id: payload.userId, 
                    color: payload.color 
                });

            if (error) throw error;

            // Notifier tous les clients du changement
            this.server.emit('profileColorChanged', { 
                userId: payload.userId, 
                color: payload.color 
            });
        } catch (error) {
            console.error('Erreur lors du changement de couleur:', error);
            client.emit('error', { message: 'Erreur lors du changement de couleur' });
        }
    }
}