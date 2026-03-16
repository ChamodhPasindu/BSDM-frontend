export interface INotificationData {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  senderName: string;
  recipientName: string;
  priority: string;
  senderUserName: string;
}
