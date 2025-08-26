import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private client: Client | null = null;
  private isConnected = false;
  private sendQueue: Array<{ id: number; payload: any }> = [];

  connect(conversationId: number, onMessage: (msg: any) => void): void {
    this.client = new Client({
      webSocketFactory: () => new SockJS('/ws')
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
  }

  sendMessage(conversationId: number, payload: any): void {
    if (this.isConnected && this.client) {
      this.client.publish({ destination: `/app/chat/${conversationId}`, body: JSON.stringify(payload) });
    } else {
      this.sendQueue.push({ id: conversationId, payload });
    }
  }
}
