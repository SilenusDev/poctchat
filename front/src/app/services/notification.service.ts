import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private client: Client | null = null;
  private isConnected = false;
  private currentUserId: number | null = null;
  
  private newConversationSubject = new Subject<any>();
  public newConversation$ = this.newConversationSubject.asObservable();

  connect(userId: number): void {
    // Déconnecter si déjà connecté avec un autre utilisateur
    if (this.client && this.currentUserId !== userId) {
      this.disconnect();
    }

    // Ne pas reconnecter si déjà connecté avec le même utilisateur
    if (this.isConnected && this.currentUserId === userId) {
      return;
    }

    this.currentUserId = userId;
    this.client = new Client({
      webSocketFactory: () => new SockJS('/ws'),
      connectHeaders: {
        'userId': userId.toString()
      }
    });

    this.client.onConnect = () => {
      console.log('NotificationService: Connexion WebSocket établie pour userId:', userId);
      this.isConnected = true;
      
      // S'abonner aux notifications de nouvelles conversations
      this.client?.subscribe(`/user/${userId}/queue/new-conversations`, (message: IMessage) => {
        if (message.body) {
          console.log('NotificationService: Nouvelle conversation reçue:', message.body);
          const newConversation = JSON.parse(message.body);
          this.newConversationSubject.next(newConversation);
        }
      });

      // S'abonner aux notifications générales
      this.client?.subscribe(`/user/${userId}/queue/notifications`, (message: IMessage) => {
        if (message.body) {
          console.log('NotificationService: Notification reçue:', message.body);
          // Pour l'instant, on traite toutes les notifications comme des mises à jour de conversations
          this.newConversationSubject.next(JSON.parse(message.body));
        }
      });
    };

    this.client.onDisconnect = () => {
      console.log('NotificationService: Connexion WebSocket fermée');
      this.isConnected = false;
    };

    this.client.onStompError = (frame) => {
      console.error('NotificationService: Erreur STOMP:', frame);
    };

    this.client.activate();
  }

  disconnect(): void {
    if (this.client) {
      console.log('NotificationService: Déconnexion WebSocket');
      this.client.deactivate();
      this.client = null;
      this.isConnected = false;
      this.currentUserId = null;
    }
  }

  isConnectedForUser(userId: number): boolean {
    return this.isConnected && this.currentUserId === userId;
  }
}
