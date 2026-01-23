export interface ChatMessage {
  id: number;
  sender: string;
  receiver: string;
  type: string | null;
  content: string;
  createdAt: string;
  read: boolean;
}

