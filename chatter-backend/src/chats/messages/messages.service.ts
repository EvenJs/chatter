import { Inject, Injectable } from '@nestjs/common';
import { ChatsRepository } from '../chat.repository';
import { CreateMessageInput } from './dto/create-message.input';
import { Types } from 'mongoose';
import { Message } from './entities/message.entity';
import { GetMessageArgs } from './dto/get-message.args';
import { PUB_SUB } from 'src/common/constants/injection-token';
import { PubSub } from 'graphql-subscriptions';
import { MESSAGE_CREATED } from './constants/pubsub-triggers';

@Injectable()
export class MessagesService {
  constructor(
    private readonly chatsRepository: ChatsRepository,
    @Inject(PUB_SUB) private readonly pubSub: PubSub
  ) { }

  async createMessage({ content, chatId }: CreateMessageInput, userId: string) {
    const message: Message = {
      content,
      userId,
      chatId,
      createdAt: new Date(),
      _id: new Types.ObjectId(),
    }

    await this.chatsRepository.findOneAndUPdate({
      _id: chatId,
      ...this.userChatFilter(userId),
    }, {
      $push: { messages: message }
    });

    await this.pubSub.publish(MESSAGE_CREATED, { messageCreated: message })
    return message
  }

  private userChatFilter(userId: string) {
    return {
      $or: [{ userId }, { userIds: { $in: [userId] } }]
    }
  }

  async getMessages({ chatId }: GetMessageArgs, userId: string) {
    return (
      await this.chatsRepository.findOne({ _id: chatId, ...this.userChatFilter(userId), }
      )
    ).messages;
  }
}
