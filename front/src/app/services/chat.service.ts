import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private client: Client | null = null;
  private isConnected = false;
  private sendQueue: Array<{ id: number; payload: any }> = [];
  private currentUserId: number | null = null;

  connect(conversationId: number, userId: number, onMessage: (msg: any) => void): void {
    // Déconnecter la connexion précédente si elle existe
    if (this.client && this.currentUserId !== userId) {
      this.disconnect();
    }

    this.currentUserId = userId;
    this.client = new Client({
      webSocketFactory: () => new SockJS('/ws'),
      connectHeaders: {
        'userId': userId.toString()
      }
    });

    this.client.onConnect = () => {
      this.isConnected = true;
      this.client?.subscribe(`/topic/conversations/${conversationId}`, (message: IMessage) => {
        if (message.body) {
          onMessage(JSON.parse(message.body));
        }
      });

      // Flush messages en attente
      this.sendQueue.forEach(item => {
        this.client?.publish({ destination: `/app/chat/${item.id}`, body: JSON.stringify(item.payload) });
      });
      this.sendQueue = [];
    };

    this.client.activate();
  }

  disconnect(): void {
    this.client?.deactivate();
    this.client = null;
    this.isConnected = false;
    this.currentUserId = null;
  }

  sendMessage(conversationId: number, payload: any): void {
    if (this.isConnected && this.client) {
      this.client.publish({ destination: `/app/chat/${conversationId}`, body: JSON.stringify(payload) });
    } else {
      this.sendQueue.push({ id: conversationId, payload });
    }
  }
}
