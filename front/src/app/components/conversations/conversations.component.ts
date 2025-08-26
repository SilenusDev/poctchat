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
      this.conversations = [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      this.isLoading = false;
    });
  }

  contactSupport(): void {
    this.conversationService.contactSupport().subscribe(conv => {
      this.router.navigate(['/chat', conv.id]);
    });
  }

  openConversation(conv: ConversationDTO): void {
    this.router.navigate(['/chat', conv.id]);
  }
}


