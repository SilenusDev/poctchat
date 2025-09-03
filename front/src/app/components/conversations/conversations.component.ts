import { Component, OnInit } from '@angular/core';
import { ConversationService } from 'src/app/services/conversation.service';
import { ConversationDTO } from 'src/app/interfaces/conversation-dto.interface';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { MeResponse } from 'src/app/interfaces/me-response.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.scss']
})
export class ConversationsComponent implements OnInit {
  me: MeResponse | null = null;
  conversations: ConversationDTO[] = [];
  isLoading = true;

  constructor(
    private conversationService: ConversationService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.me().subscribe(user => {
      this.me = {
        id: user.id,
        username: (user as any).name || (user as any).username || '',
        email: (user as any).email || '',
        role: (user as any).role || 'CLIENT',
        createdAt: (user as any).createdAt || new Date()
      };
    });

    this.conversationService.getMyConversations().subscribe(items => {
      console.log('Conversations reçues:', items);
      items.forEach(conv => {
        console.log(`Conversation ${conv.id}: titre = "${conv.titre}"`);
      });
      this.conversations = [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      this.isLoading = false;
    });
  }

  contactSupport(event: any): void {
    const selectedType = event.target.value;
    if (selectedType) {
      this.conversationService.contactSupport(selectedType).subscribe(conv => {
        this.router.navigate(['/chat', conv.id]);
      });
      // Reset the select after creating conversation
      event.target.value = '';
    }
  }

  openConversation(conv: ConversationDTO): void {
    this.router.navigate(['/chat', conv.id]);
  }

  getOtherUserName(conversation: ConversationDTO): string {
    if (!this.me) return 'Utilisateur inconnu';
    
    const otherUser = conversation.user1.id === this.me.id ? conversation.user2 : conversation.user1;
    return otherUser.username || otherUser.name || `Utilisateur ${otherUser.id}`;
  }

  getOtherUserDisplayName(conversation: ConversationDTO): string {
    if (!this.me) return 'Utilisateur inconnu';
    
    const otherUser = conversation.user1.id === this.me.id ? conversation.user2 : conversation.user1;
    const userName = otherUser.username || otherUser.name || `Utilisateur ${otherUser.id}`;
    
    // Ajouter le rôle devant le nom
    if ((otherUser as any).role === 'ADMIN') {
      return `ADMIN ${userName}`;
    } else if ((otherUser as any).role === 'CLIENT') {
      return `CLIENT ${userName}`;
    }
    
    return userName;
  }

  getUser1DisplayName(conversation: ConversationDTO): string {
    const user1 = conversation.user1;
    const userName = user1.username || user1.name || `Utilisateur ${user1.id}`;
    
    // Ajouter le rôle devant le nom
    if ((user1 as any).role === 'ADMIN') {
      return `ADMIN ${userName}`;
    } else if ((user1 as any).role === 'CLIENT') {
      return `CLIENT ${userName}`;
    }
    
    return userName;
  }

  getConversationTitleLabel(conversation: ConversationDTO): string {
    console.log('getConversationTitleLabel appelé pour conversation:', conversation.id, 'titre:', conversation.titre);
    
    if (!conversation.titre) {
      console.log('Pas de titre trouvé, retour par défaut');
      return 'Autre demande';
    }
    
    switch (conversation.titre) {
      case 'PROBLEME_LOCATION':
        return 'Problème de location';
      case 'DEMANDE_REPARATION':
        return 'Demande de réparation';
      case 'AUTRE':
        return 'Autre demande';
      default:
        console.log('Titre non reconnu:', conversation.titre);
        return 'Autre demande';
    }
  }
}


