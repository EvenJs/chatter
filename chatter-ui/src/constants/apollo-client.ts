import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import excludedRoutes from './excluded-routes';
import { onLogout } from '../utils/logout';
import { createClient } from 'graphql-ws';
import { WS_URL } from './url';
import { getMainDefinition } from '@apollo/client/utilities';


const LogoutLink = onError((error) => {
  console.log(9, error)
  if (error.graphQLErrors?.length) {
    if (!excludedRoutes.includes(window.location.pathname)) {
      onLogout()
    }
  }
})

const httpLink = new HttpLink({ uri: `/api/graphql`, })

const wsLink = new GraphQLWsLink(createClient({
  url: `ws://${WS_URL}/graphql`,
}));

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (definition.kind === "OperationDefinition" && definition.operation === "subscription");
  }, wsLink, httpLink
)

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: LogoutLink.concat(splitLink)
})

export default client;