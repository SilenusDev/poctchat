import { Role } from './role.interface';
import { ConversationDTO } from './conversation-dto.interface';

export interface MeResponse {
  id: number;
  username: string;
  email: string;
  role: Role;
  createdAt: Date;
  conversations?: ConversationDTO[];
}