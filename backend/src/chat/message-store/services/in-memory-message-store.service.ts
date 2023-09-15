import { Injectable } from '@nestjs/common';
import { UUID } from 'src/database/service/interface/users';
import { Message, MessageStore } from '../message-store.interface';

@Injectable()
export default class InMemoryMessageStoreService implements MessageStore {
  private readonly messages: Message[] = [];

  saveMessage(message: Message) {
    this.messages.push(message);
  }

  findMessageForUser(userID: UUID) {
    return this.messages.filter(
      ({ from, to }) => from === userID || to === userID
    );
  }
}
