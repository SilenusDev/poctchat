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
    });
    // Charger l'historique
    this.conversationService.getMessages(this.conversationId).subscribe(msgs => {
      this.messages = msgs;
      this.scrollToBottom();
    });
    this.chatService.connect(this.conversationId, (msg) => {
      this.messages.push(msg);
      this.scrollToBottom();
    });
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    this.chatService.disconnect();
  }

  send(): void {
    if (!this.content.trim() || this.currentUserId == null) return;
    this.chatService.sendMessage(this.conversationId, { senderId: this.currentUserId, content: this.content });
    this.content = '';
  }

  private scrollToBottom(): void {
    if (!this.messagesList) return;
    setTimeout(() => {
      const el = this.messagesList.nativeElement;
      el.scrollTop = el.scrollHeight;
    }, 0);
  }
}
