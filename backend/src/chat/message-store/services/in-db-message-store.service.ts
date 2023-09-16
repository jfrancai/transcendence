import { Logger } from '@nestjs/common';
import { UUID } from 'src/utils/types';
import { Message, MessageStore } from '../message-store.interface';
import { MessageService } from '../../../database/service/message.service';

export default class InDbMessageStoreService implements MessageStore {
  private readonly logger = new Logger(InDbMessageStoreService.name);

  constructor(private messaseService: MessageService) {}

  saveMessage(message: Message): any {
    this.messaseService.createMessage({
      content: message.content,
      sender: message.from,
      receiver: message.to
    });
  }

  findMessageForUser(userID: UUID): any {}
}
