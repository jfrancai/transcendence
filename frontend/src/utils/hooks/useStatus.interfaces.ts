import { Socket } from 'socket.io-client';

export interface Channel {
  chanID: string;
  chanName: string;
  chanType: string;
  chanCreatedAt: Date;
}

export interface Message {
  messageID: string;
  content: string;
  sender: string;
  senderID: string;
  receiver: string;
  receiverID: string;
  createdAt: Date;
}

export interface Session {
  userID: string;
}
export interface User extends Session {
  username: string;
}

export interface Contact extends User {
  messages: Message[];
  connected: boolean;
}

export type ContactList = Contact[];

export interface Status {
  isConnected: boolean;
  contactList: Contact[];
  privateMessage: Message | undefined;
}

export interface PongSocket extends Socket {
  userID: string;
  username: string;
}
