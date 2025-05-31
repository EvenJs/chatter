import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { MessagesService } from './messages.service';
import { Message } from './entities/message.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CreateMessageInput } from './dto/create-message.input';
import { CurrentUser } from 'src/auth/current-user-decorator';
import { TokenPayload } from 'src/auth/token-payload.interface';
import { GetMessageArgs } from './dto/get-message.args';

import { MessageCreatedArgs } from './dto/message-create.args';

@Resolver(() => Message)
export class MessagesResolver {
  constructor(
    private readonly messagesService: MessagesService,
  ) { }

  @Mutation(() => Message)
  @UseGuards(GqlAuthGuard)
  async createMessage(
    @Args('createMessageInput') createMessageInput: CreateMessageInput,
    @CurrentUser() user: TokenPayload
  ): Promise<Message> {
    return this.messagesService.createMessage(createMessageInput, user._id)
  }

  @Query(() => [Message], { name: 'messages' })
  @UseGuards(GqlAuthGuard)
  async getMessages(
    @Args() getMessageArgs: GetMessageArgs,
  ): Promise<Message[]> {
    return this.messagesService.getMessages(getMessageArgs)
  }


  @Subscription(() => Message, {
    filter: (payload, variables, context) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const userId = context.req.user._id;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const message: Message = payload.messageCreated;
      return (
        payload.messageCreated.chatId === variables.chatId &&
        userId !== message.user._id.toHexString()
      );
    }
  })
  messageCreated(
    @Args() messageCreatedArgs: MessageCreatedArgs,
  ) {
    return this.messagesService.messageCreated(messageCreatedArgs);
  }
}
