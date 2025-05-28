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
        payload: { sender: string; text: string; userId: string, color: string },
    ): Promise<void> {
        try {
            if (!payload.userId) {
                return;
            }
            
            const messageData = {
                sender: payload.sender,
                userId: payload.userId,
                text: payload.text,
                color: payload.color || '#10b981',
                timestamp: new Date().toISOString(),
            };
            
            this.server.emit('message', messageData);
            
        } catch (error) {
            this.server.emit('message', {
                sender: payload.sender || 'Utilisateur',
                userId: payload.userId || 'unknown',
                text: payload.text || '',
                color: payload.color || '#10b981',
                timestamp: new Date().toISOString(),
            });
        }
    }

    @SubscribeMessage('changeColor')
    async handleChangeColor(client: Socket, payload: { sender: string, color: string }) {
        try {
            if (!payload.sender) {
                return;
            }
            
            const colorChangeData = {
                sender: payload.sender,
                color: payload.color
            };
            
            this.server.emit('profileColorChanged', colorChangeData);
            
        } catch (error) {
            client.emit('error', { message: 'Erreur lors du changement de couleur' });
        }
    }
}