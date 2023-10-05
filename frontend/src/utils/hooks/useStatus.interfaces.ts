import { Socket } from 'socket.io-client';

export interface Channel {
  chanID: string;
  chanName: string;
  creatorID: string;
  chanAdmins: string[];
  chanType: string;
  chanCreatedAt: Date;
}

export interface Message {
  messageID: string;
  content: string;
  sender: string;
  senderID: string;
  receiver?: string;
  receiverID?: string;
  chanName?: string;
  chanID?: string;
  createdAt: Date;
}

export interface Session {
  userID: string;
}
export interface User extends Session {
  username: string;
}

export interface Contact extends User {
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
