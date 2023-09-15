export interface Message {
  content: string;
  from: string;
  to: string;
}

export interface MessageStore {
  saveMessage(message: Message): any;
  findMessageForUser(userID: string): any;
}
