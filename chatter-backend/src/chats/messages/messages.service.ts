import { Injectable } from '@nestjs/common';
import { ChatsRepository } from '../chat.repository';
import { CreateMessageInput } from './dto/create-message.input';
import { Types } from 'mongoose';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {
  constructor(private readonly chatsRepository: ChatsRepository) { }

  async createMessage({ content, chatId }: CreateMessageInput, userId: string) {
    const message: Message = {
      content,
      userId,
      createdAt: new Date(),
      _id: new Types.ObjectId(),
    }

    await this.chatsRepository.findOneAndUPdate({
      _id: chatId,
      $or: [{ userId }, { userIds: { $in: [userId] } }]
    }, {
      $push: { messages: message }
    });

    return message
  }

}
