import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConversationDTO } from 'src/app/interfaces/conversation-dto.interface';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {

  private baseUrl = 'api/conversations';

  constructor(private httpClient: HttpClient) {}

  public getMyConversations(): Observable<ConversationDTO[]> {
    return this.httpClient.get<ConversationDTO[]>(`${this.baseUrl}/my`);
  }

  public contactSupport(): Observable<ConversationDTO> {
    return this.httpClient.post<ConversationDTO>(`${this.baseUrl}/contact-support`, {});
  }

  public getMessages(conversationId: number): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}/${conversationId}/messages`);
  }

  public getConversation(conversationId: number): Observable<ConversationDTO> {
    return this.httpClient.get<ConversationDTO>(`${this.baseUrl}/${conversationId}`);
  }
}


