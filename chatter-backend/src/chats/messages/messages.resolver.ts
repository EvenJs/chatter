import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { MessagesService } from './messages.service';
import { Message } from './entities/message.entity';
import { Inject, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CreateMessageInput } from './dto/create-message.input';
import { CurrentUser } from 'src/auth/current-user-decorator';
import { TokenPayload } from 'src/auth/token-payload.interface';
import { GetMessageArgs } from './dto/get-message.args';
import { PUB_SUB } from 'src/common/constants/injection-token';
import { PubSub } from 'graphql-subscriptions';
import { MessageCreatedArgs } from './dto/message-create.args';

@Resolver(() => Message)
export class MessagesResolver {
  constructor(
    private readonly messagesService: MessagesService,
    @Inject(PUB_SUB) private pubSub: PubSub
  ) { }

  @Mutation(() => Message)
  @UseGuards(GqlAuthGuard)
  async createMessage(
    @Args('createMessageInput') createMessageInput: CreateMessageInput,
    @CurrentUser() user: TokenPayload
  ) {
    return this.messagesService.createMessage(createMessageInput, user._id)
  }

  @Query(() => [Message], { name: 'messages' })
  @UseGuards(GqlAuthGuard)
  async getMessages(
    @Args() getMessageArgs: GetMessageArgs,
    @CurrentUser() user: TokenPayload,
  ) {
    return this.messagesService.getMessages(getMessageArgs, user._id)
  }


  @Subscription(() => Message, {
    filter: (payload, variables, context) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const userId = context.req.user._id;
      return (payload.messageCreated.chatId === variables.chatId && userId !== payload.messageCreated.userId);
    }
  })
  messageCreated(
    @Args() messageCreatedArgs: MessageCreatedArgs,
    @CurrentUser() user: TokenPayload
  ) {
    return this.messagesService.messageCreated(messageCreatedArgs, user._id);
  }
}
