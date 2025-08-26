import { User } from './user.interface';

export interface ConversationDTO {
  id: number;
  user1: User;
  user2: User;
  createdAt: Date;
}
