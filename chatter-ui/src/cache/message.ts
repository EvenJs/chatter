import type { ApolloCache } from "@apollo/client";
import type { Message } from "../gql/graphql";
import { getMessageDocument } from "../hooks/useGetMessages";
import { CHAT_SIZE } from "../constants/page-size";

export const updateMessages = (cache: ApolloCache<unknown>, message: Message) => {
  const messagesQueryOptions = {
    query: getMessageDocument,
    variables: {
      chatId: message.chatId,
      skip: 0,
      limit: CHAT_SIZE,
    },
  }

  const messages = cache.readQuery({
    ...messagesQueryOptions
  })

  cache.writeQuery({
    ...messagesQueryOptions,
    data: {
      messages: (messages?.messages || []).concat(message),
    }
  })
}