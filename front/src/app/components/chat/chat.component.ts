import { Component, OnDestroy, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { ConversationService } from 'src/app/services/conversation.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewInit {
  conversationId!: number;
  messages: any[] = [];
  content = '';
  currentUserId: number | null = null;
  currentUser: any = null;
  conversation: any = null;
  otherUser: any = null;
  @ViewChild('messagesList') messagesList!: ElementRef<HTMLDivElement>;

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService,
    private auth: AuthService,
    private conversationService: ConversationService
  ) {}

  ngOnInit(): void {
    this.conversationId = Number(this.route.snapshot.paramMap.get('id'));
    this.auth.me().subscribe(u => {
      this.currentUserId = u.id;
      this.currentUser = u;
      
      // Récupérer les détails de la conversation pour identifier l'autre utilisateur
      this.conversationService.getConversation(this.conversationId).subscribe({
        next: (conversation) => {
          console.log('Conversation récupérée:', conversation);
          this.conversation = conversation;
          // Identifier l'autre utilisateur
          this.otherUser = conversation.user1.id === this.currentUserId ? conversation.user2 : conversation.user1;
          console.log('Utilisateur courant ID:', this.currentUserId);
          console.log('User1:', conversation.user1);
          console.log('User2:', conversation.user2);
          console.log('Autre utilisateur identifié:', this.otherUser);
        },
        error: (error) => {
          console.error('Erreur lors de la récupération de la conversation:', error);
        }
      });
    });
    
    // Charger l'historique
    this.conversationService.getMessages(this.conversationId).subscribe(msgs => {
      this.messages = msgs;
      this.scrollToTop();
    });
    this.chatService.connect(this.conversationId, (msg) => {
      this.messages.push(msg);
      this.scrollToTop();
    });
  }

  ngAfterViewInit(): void {
    this.scrollToTop();
  }

  ngOnDestroy(): void {
    this.chatService.disconnect();
  }

  send(): void {
    if (!this.content.trim() || this.currentUserId == null) return;
    this.chatService.sendMessage(this.conversationId, { senderId: this.currentUserId, content: this.content });
    this.content = '';
  }

  getUserName(senderId: number): string {
    if (senderId === this.currentUserId) {
      return this.currentUser?.username || this.currentUser?.name || 'Moi';
    }
    // Afficher le nom de l'autre utilisateur de la conversation
    if (this.otherUser && senderId === this.otherUser.id) {
      return this.otherUser.username || this.otherUser.name || `Utilisateur ${senderId}`;
    }
    return `Utilisateur ${senderId}`;
  }

  isSameUser(index: number): boolean {
    if (index === 0) return false;
    const reversedMessages = this.messages.slice().reverse();
    return reversedMessages[index].senderId === reversedMessages[index - 1].senderId;
  }

  private scrollToTop(): void {
    if (!this.messagesList) return;
    setTimeout(() => {
      const el = this.messagesList.nativeElement;
      el.scrollTop = 0;
    }, 0);
  }

  private scrollToBottom(): void {
    if (!this.messagesList) return;
    setTimeout(() => {
      const el = this.messagesList.nativeElement;
      el.scrollTop = el.scrollHeight;
    }, 0);
  }
}
