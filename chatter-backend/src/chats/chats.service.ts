import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChatInput } from './dto/create-chat.input';
import { UpdateChatInput } from './dto/update-chat.input';
import { ChatsRepository } from './chat.repository';
import { PipelineStage, Types } from 'mongoose';
import { PaginationArgs } from 'src/common/dto/pagination-args.dto';
import { skip } from 'node:test';

@Injectable()
export class ChatsService {
  constructor(private readonly chatsRepository: ChatsRepository) { }

  async create(createChatInput: CreateChatInput, userId: string) {
    return this.chatsRepository.create({
      ...createChatInput,
      userId,
      messages: [],
    })
  }

  async findMany(prePipelineStages: PipelineStage[] = [], paginationArgs?: PaginationArgs) {
    const pipeline: PipelineStage[] = [
      ...prePipelineStages,
      {
        $set: {
          latestMessage: {
            $cond: [
              '$messages',
              { $arrayElemAt: ['$messages', -1] },
              { createdAt: new Date() }
            ]
          }
        }
      },
      { $sort: { 'latestMessage.createdAt': -1 } },
      { $unset: 'messages' },
      {
        $lookup: {
          from: "users",
          localField: "latestMessage.userId",
          foreignField: "_id",
          as: "latestMessage.user"
        }
      },
    ]
    if (paginationArgs?.skip !== undefined) {
      pipeline.push({ $skip: paginationArgs.skip });
    }

    if (paginationArgs?.limit !== undefined) {
      pipeline.push({ $limit: paginationArgs.limit });
    }

    const chats = await this.chatsRepository.model.aggregate(pipeline)

    chats.forEach((chat) => {
      if (!chat.latestMessage?._id) {
        delete chat.latestMessage;
        return
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      chat.latestMessage.user = chat.latestMessage.user[0];
      delete chat.latestMessage.userId;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      chat.latestMessage.chatId = chat._id;
    })
    return chats;
  }

  async countChats() {
    return this.chatsRepository.model.countDocuments()
  }

  async findOne(_id: string) {
    const chats = await this.findMany([
      { $match: { _id: new Types.ObjectId(_id) } },
    ])

    if (!chats[0]) {
      throw new NotFoundException(`No chat was found with ID ${_id}`)
    }

    return chats[0];
  }


  update(_id: string, updateChatInput: UpdateChatInput) {
    return `This action updates a #${_id} chat`;
  }

  remove(_id: string) {
    return `This action removes a #${_id} chat`;
  }
}
