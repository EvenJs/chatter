import { useQuery } from "@apollo/client";
import { graphql } from "../gql";
import type { MessagesQueryVariables } from "../gql/graphql";


export const getMessageDocument = graphql(`
  query Messages($chatId: String!, $skip: Int!, $limit: Int!) {
    messages(chatId: $chatId, skip: $skip, limit: $limit) {
      ...MessageFragment
    }
  }
`)

const useGetMessages = (variables: MessagesQueryVariables) => {
  return useQuery(getMessageDocument, { variables })
}

export { useGetMessages };
